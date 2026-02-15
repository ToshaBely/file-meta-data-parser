import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { RequiredResourcePermissions } from '../decorators/required-resource-permissions.decorator';
import { matchPermissions } from '../helpers/match-permissions.helper';

const FAKE_RESOURCE_PERMISSIONS_HEADER = 'x-resource-permissions';

@Injectable()
export class RequiredResourcePermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredResourcePermissions = this.reflector.get(
      RequiredResourcePermissions,
      context.getHandler(),
    );

    if (!requiredResourcePermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // this is a dummy guard logic
    // todo: it is possible to define a more sophisticated permissions check
    //  - at the moment it's out of the scope for the challenge
    return matchPermissions(
      requiredResourcePermissions,
      request.headers[FAKE_RESOURCE_PERMISSIONS_HEADER],
    );
  }
}
