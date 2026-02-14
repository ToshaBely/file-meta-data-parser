import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

const AUTHORIZATION_HEADER = 'authorization';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // this is a dummy guard
    // todo: it is possible to define a more sophisticated auth check (e.g. JWT access token)
    //  - at the moment it's out of the scope for the challenge
    return Boolean(request.headers[AUTHORIZATION_HEADER]);
  }
}
