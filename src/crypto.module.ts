import {DynamicModule, Logger, Module} from '@nestjs/common';
import { CryptoService } from './crypto.service';
import * as crypto from "crypto";

const DEFAULT_ALGORITHM = 'aes-192-cbc';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {
  private static readonly logger = new Logger(CryptoModule.name);
  public static forRoot(secret: string, options: {algorithm: string} = {algorithm: DEFAULT_ALGORITHM}): DynamicModule {
    const supported = crypto.getCiphers();
    if (!supported.includes(options.algorithm)) {
      const error = `Algorithm '${options.algorithm}' not supported`;
      this.logger.error(error)
      this.logger.error(`Supported algorithm : ${supported}`)
    }
    if (!options) {
      options = {algorithm: DEFAULT_ALGORITHM};
    }
    return {
      module: CryptoModule,
      providers: [CryptoService, {provide: 'HHNEST_CRYPTO_SECRET', useValue: secret}, {provide: 'HHNEST_CRYPTO_ALGORITHM', useValue: options.algorithm || DEFAULT_ALGORITHM}],
    };
  }
}
