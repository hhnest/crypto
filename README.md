<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# @hhnest/crypto 

![Build](https://github.com/hhnest/crypto/workflows/Build/badge.svg)
[![codecov](https://codecov.io/gh/hhnest/crypto/branch/master/graph/badge.svg)](https://codecov.io/gh/hhnest/crypto)

## Description

A crypto module for [Nest](https://github.com/nestjs/nest).

Wrap standard nodejs crypto api with [Rxjs](https://github.com/ReactiveX/RxJS)

DEFAULT ALGORITHM : 'aes-192-cbc'

## Installation

```bash
$ npm install @hhnest/crypto --save
```

## Import module in your the app

```typescript
import {CryptoModule} from '@hhnest/crypto';
...
@Module({
  imports: [
    HttpModule,
    CryptoModule.forRoot(environment.secret),
// Or
    CryptoModule.forRoot(environment.secret, {algorithm: 'aes-192-cbc'}),
    ...
 ],
  controllers: [...],
  providers: [...],
})
export class AppModule {
  ...
}
```

## Use

```typescript
import {CryptoService} from '@hhnest/crypto';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  constructor(
    private readonly cryptoService: CryptoService
  ) {
  }
  encryptPassword(password: string): Observable<string> {
    return cryptoService.encryptString(password);
  }
  ...
}
```

## API

### cryptoService.encryptString

```typescript
  cryptoService.encryptString(decrypted: string): Observable<string>;
```
Encrypt string and return it.  
The encrypted string will be prefixed by ENCRYPTED_   

---

### cryptoService.encryptStream

```typescript
  cryptoService.encryptStream(input: NodeJS.ReadableStream, output: NodeJS.WritableStream): Observable<void>;
```
Encrypt input stream and write encrypted result in output stream  
The result will not be prefixed

---

### cryptoService.decryptString

```typescript
  cryptoService.decryptString(encrypted: string): Observable<string>;
```
Decrypt string and return it.  
The encrypted string should be prefixed by ENCRYPTED_   

---

### cryptoService.decryptStream

```typescript
  cryptoService.decryptStream(input: NodeJS.ReadableStream, output: NodeJS.WritableStream): Observable<void>;
```
Decrypt input stream and write decrypted result in output stream  

---

### cryptoService.getCurrentAlgorithm

```typescript
  cryptoService.getCurrentAlgorithm(): string;
```
Return the current algorithm as defined in module declaration
Default value is 'aes-192-cbc'

---

### cryptoService.getSupportedAlgorithms

```typescript
  cryptoService.getSupportedAlgorithms(): string[];
```
Return supported algorithms

---

### cryptoService.isSupportedAlgorithm

```typescript
  cryptoService.isSupportedAlgorithm(algorithm: string): boolean;
```
Return if an algorithm is supported

---

## License

  @hhnest/crypto is [MIT licensed](LICENSE).
