import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieConsentLog } from './entities/cookie-consent-log.entity';
import { ConsentsController } from './consents.controller';
import { ConsentsService } from './consents.service';

@Module({
  imports: [TypeOrmModule.forFeature([CookieConsentLog])],
  controllers: [ConsentsController],
  providers: [ConsentsService],
})
export class ConsentsModule {}
