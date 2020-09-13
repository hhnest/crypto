import {CryptoService} from './crypto.service';
import {Test, TestingModule} from '@nestjs/testing';
import * as stream from 'stream';
import {PassThrough} from 'stream';
import {fromPromise} from 'rxjs/internal-compatibility';
import DoneCallback = jest.DoneCallback;
import {CryptoModule} from './crypto.module';

describe('CryptoService', () => {
  let cryptoService: CryptoService;

  beforeEach((done: DoneCallback) => {
    fromPromise(Test.createTestingModule({
      imports: [
        CryptoModule.forRoot('dséfkjasdlkjflsadkjflkj', {algorithm: 'aes-192-cbc'})
      ]
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

  describe('getAlgorithmsSupported', () => {
    it('should return algorithms supported', (done) => {
      const result = cryptoService.getAlgorithmsSupported();
      expect(result).toContain('aes-192-cbc');
      done();
    });
  });

  describe('isAlgorithmSupported', () => {
    it(`should return as 'aes-192-cbc' is supported`, (done) => {
      const result = cryptoService.isAlgorithmSupported('aes-192-cbc');
      expect(result).toBeTruthy();
      done();
    });
    it(`should return as 'foo' is not supported`, (done) => {
      const result = cryptoService.isAlgorithmSupported('foo');
      expect(result).toBeFalsy();
      done();
    });
  });
});
