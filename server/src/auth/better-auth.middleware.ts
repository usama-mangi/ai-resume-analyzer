import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';

@Injectable()
export class BetterAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(BetterAuthMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      return next();
    }

    try {
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const headers = new Headers();

      for (const [key, value] of Object.entries(req.headers)) {
        if (value !== undefined && value !== null) {
          const str = Array.isArray(value) ? value.join(', ') : String(value);
          headers.set(key, str);
        }
      }

      const init: RequestInit = {
        method: req.method,
        headers,
      };

      if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
        init.body = JSON.stringify(req.body);
        (init as any).duplex = 'half';
      }

      const request = new Request(url, init);
      const response = await auth.handler(request);

      res.status(response.status);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      const text = await response.text();
      res.send(text);
    } catch (err) {
      this.logger.error('Better Auth handler error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}