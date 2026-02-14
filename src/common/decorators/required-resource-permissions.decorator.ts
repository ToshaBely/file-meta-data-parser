import { Reflector } from '@nestjs/core';

import { ResourcePermission } from '../types/resource-permission';

export const RequiredResourcePermissions =
  Reflector.createDecorator<ResourcePermission[]>();
