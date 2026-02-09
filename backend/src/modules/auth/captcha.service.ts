import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { randomBytes } from 'crypto';

interface CaptchaEntry {
  text: string;
  createdAt: number;
}

@Injectable()
export class CaptchaService {
  private store = new Map<string, CaptchaEntry>();
  private readonly TTL_MS = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Cleanup expired entries every 2 minutes
    setInterval(() => this.cleanup(), 2 * 60 * 1000);
  }

  generate(): { captchaId: string; svg: string } {
    const captcha = svgCaptcha.create({
      size: 5,           // 5 characters
      noise: 3,          // 3 noise lines
      color: true,
      background: '#f0f0f0',
      width: 200,
      height: 60,
      fontSize: 50,
    });

    const captchaId = randomBytes(16).toString('hex');

    this.store.set(captchaId, {
      text: captcha.text.toLowerCase(),
      createdAt: Date.now(),
    });

    return { captchaId, svg: captcha.data };
  }

  verify(captchaId: string, userInput: string): boolean {
    const entry = this.store.get(captchaId);

    if (!entry) {
      return false; // Not found or already used
    }

    // Delete immediately (one-time use)
    this.store.delete(captchaId);

    // Check expiration
    if (Date.now() - entry.createdAt > this.TTL_MS) {
      return false;
    }

    return entry.text === userInput.toLowerCase().trim();
  }

  private cleanup() {
    const now = Date.now();
    for (const [id, entry] of this.store.entries()) {
      if (now - entry.createdAt > this.TTL_MS) {
        this.store.delete(id);
      }
    }
  }
}