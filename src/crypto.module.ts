import {DynamicModule, Module} from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {
  public static forRoot(secret: string): DynamicModule {
    return {
      module: CryptoModule,
      providers: [CryptoService, {provide: 'HHNESTJS_CRYPTO_SECRET', useValue: secret}],
    };
  }
}
