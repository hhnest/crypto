import {CryptoService} from './crypto.service';
import {Test, TestingModule} from '@nestjs/testing';
import * as stream from 'stream';
import {PassThrough} from 'stream';
import {fromPromise} from 'rxjs/internal-compatibility';
import DoneCallback = jest.DoneCallback;

describe('CipherService', () => {
  let cryptoService: CryptoService;

  beforeEach((done: DoneCallback) => {
    fromPromise(Test.createTestingModule({
      providers: [CryptoService, {provide: 'HHNESTJS_CRYPTO_SECRET', useValue: 'dséfkjasdlkjflsadkjflkj'}],
    }).compile()).subscribe((moduleRef: TestingModule) => {
      cryptoService = moduleRef.get<CryptoService>(CryptoService);
      done();
    });
  });

  describe('encryptString', () => {
    it('should return an encrypted password', (done) => {
      cryptoService.encryptString('mon password').subscribe((result: string) => {
        expect(result).toEqual('ENCRYPTED_c7899974ea491d81adb323faba85f3b6');
        done();
      });
    });
  });

  describe('decryptString', () => {
    it('should return an decrypted password', (done) => {
      cryptoService.decryptString('ENCRYPTED_c7899974ea491d81adb323faba85f3b6').subscribe((result: string) => {
        expect(result).toEqual('mon password');
        done();
      });
    });
  });

  describe('encryptStream', () => {
    it('should return an encrypted password', (done) => {
      const input: PassThrough = new stream.PassThrough()
      input.write('mon password', 'utf-8')
      input.end();
      const output: PassThrough = new stream.PassThrough()
      cryptoService.encryptStream(input, output).subscribe(() => {
        const result = output.read().toString('hex');
        expect(result).toEqual('c7899974ea491d81adb323faba85f3b6');
        done();
      });
    });
  });

  describe('decyptStream', () => {
    it('should return an decrypted password', (done) => {
      const input: PassThrough = new stream.PassThrough()
      input.write('c7899974ea491d81adb323faba85f3b6', 'hex')
      input.end();
      const output: PassThrough = new stream.PassThrough()
      cryptoService.decryptStream(input, output).subscribe(() => {
        const result = output.read().toString('utf-8');
        expect(result).toEqual('mon password');
        done();
      });
    });
  });
});