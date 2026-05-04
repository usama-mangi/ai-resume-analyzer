import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from '../../lib/auth';

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = new Headers();

    if (request.headers.cookie) {
      headers.set('cookie', request.headers.cookie);
    }
    if (request.headers.authorization) {
      headers.set('authorization', request.headers.authorization);
    }

    const session = await auth.api.getSession({ headers });

    if (!session) {
      throw new UnauthorizedException('Not authenticated');
    }

    request.user = {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };

    return true;
  }
}