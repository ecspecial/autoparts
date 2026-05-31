import { Injectable, NestMiddleware } from '@nestjs/common';
import { CityContextService } from './city-context.service';

/** Reads Host header and stores city ('ekb' | 'spb') for the request's async context. */
@Injectable()
export class CityMiddleware implements NestMiddleware {
  constructor(private readonly cityContext: CityContextService) {}

  use(req: any, _res: any, next: () => void): void {
    const host = String(req.headers?.host ?? '').toLowerCase();
    const city = host.startsWith('spb.') ? 'spb' : 'ekb';
    this.cityContext.run(city, next);
  }
}
