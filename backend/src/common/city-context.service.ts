import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class CityContextService {
  private readonly storage = new AsyncLocalStorage<string>();

  /** Wrap a request handler so all async code inside knows the city. */
  run<T>(city: string, fn: () => T): T {
    return this.storage.run(city, fn);
  }

  /** Returns city for the current async context, falls back to SITE_CITY env or 'ekb'. */
  getCity(): string {
    return (
      this.storage.getStore() ??
      (process.env.SITE_CITY ?? 'ekb').toLowerCase().trim()
    );
  }
}
