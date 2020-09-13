<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# @hhnest/crypto 

![Build](https://github.com/hhnest/crypto/workflows/Build/badge.svg)

## Description

A crypto module for [Nest](https://github.com/nestjs/nest).

Use standard nodejs crypto module

DEFAULT ALGORITHM : 'aes-192-cbc'

## Installation

```bash
$ npm install @hhnest/crypto
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
...
```

## API

### encryptString
```typescript
  encryptString(decrypted: string): Observable<string>;
```

### encryptStream
```typescript
  encryptStream(input: NodeJS.ReadableStream, output: NodeJS.WritableStream): Observable<void>;
```

### decryptString
```typescript
  decryptString(encrypted: string): Observable<string>;
```

### decryptStream
```typescript
  decryptStream(input: NodeJS.ReadableStream, output: NodeJS.WritableStream): Observable<void>;
```

## License

  @hhnest/crypto is [MIT licensed](LICENSE).
