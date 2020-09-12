import {Inject, Injectable} from '@nestjs/common';
import * as crypto from 'crypto';
import {BinaryLike, ScryptOptions} from 'crypto';
import {bindCallback, fromEvent, Observable, of, race, throwError} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import * as stream from 'stream';

const ALGORITHM: string = 'aes-192-cbc';
const PREFIX: string = 'ENCRYPTED_';

@Injectable()
export class CryptoService {

  constructor(@Inject('HHNESTJS_CRYPTO_SECRET') private readonly secret: string) {
  }

  encryptString(decrypted: string): Observable<string> {
    const iv = Buffer.alloc(16, 0);
    return this.getKey().pipe(
      map((key: Buffer) => crypto.createCipheriv(ALGORITHM, key, iv)),
      mergeMap((cipher: stream.Transform) => this.cipherString(cipher, decrypted, 'utf8', 'hex', PREFIX))
    );
  }

  encryptStream(input: NodeJS.ReadableStream, output: NodeJS.WritableStream): Observable<void> {
    const iv = Buffer.alloc(16, 0);
    return this.getKey().pipe(
      map((key: Buffer) => crypto.createCipheriv(ALGORITHM, key, iv)),
      mergeMap((cipher: stream.Transform) => this.cipherStream(cipher, input, output))
    );
  }

  decryptString(encrypted: string): Observable<string> {
    const reg: RegExp = new RegExp(`^${PREFIX}`);
    const iv = Buffer.alloc(16, 0);
    return this.getKey().pipe(
      map((key: Buffer) => crypto.createDecipheriv(ALGORITHM, key, iv)),
      mergeMap((cipher: stream.Transform) => this.cipherString(cipher, encrypted.replace(reg, ''), 'hex', 'utf8'))
    );
  }

  decryptStream(input: NodeJS.ReadableStream, output: NodeJS.WritableStream): Observable<void> {
    const iv = Buffer.alloc(16, 0);
    return this.getKey().pipe(
      map((key: Buffer) => crypto.createDecipheriv(ALGORITHM, key, iv)),
      mergeMap((cipher: stream.Transform) => this.cipherStream(cipher, input, output))
    );
  }

  private cipherString(cipher: stream.Transform, text: string, fromEncode: BufferEncoding, toEncode: BufferEncoding, prefix: string = '') {
    let result = prefix;
    fromEvent(cipher, 'readable').subscribe(() => {
      let chunk: Buffer;
      while (null !== (chunk = cipher.read())) {
        result += chunk.toString(toEncode);
      }
    });
    const obs$ = race(fromEvent(cipher, 'end').pipe(
      map(() => result)
    ), fromEvent(cipher, 'error').pipe(
      mergeMap((error: Error) => throwError(error))
    ));
    cipher.write(text, fromEncode);
    cipher.end();
    return obs$;
  }

  private cipherStream(cipher: stream.Transform, input: NodeJS.ReadableStream, output: NodeJS.WritableStream) {
    const obs$ = race(fromEvent(cipher, 'end').pipe(
      map(() => undefined)
    ), fromEvent(cipher, 'error').pipe(
      mergeMap((error: Error) => throwError(error))
    ));
    input.pipe(cipher).pipe(output);
    return obs$;
  }

  private getKey(): Observable<Buffer> {
    return bindCallback<BinaryLike, BinaryLike, number, ScryptOptions, Error, Buffer>(crypto.scrypt).call(crypto, this.secret, 'salt', 24, null).pipe(
      mergeMap(([error, buffer]: [Error, Buffer]) => !!error ? throwError(error) : of(buffer)),
    );
  }

}

