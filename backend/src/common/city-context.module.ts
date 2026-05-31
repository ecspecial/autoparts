import { Global, Module } from '@nestjs/common';
import { CityContextService } from './city-context.service';

@Global()
@Module({
  providers: [CityContextService],
  exports: [CityContextService],
})
export class CityContextModule {}
