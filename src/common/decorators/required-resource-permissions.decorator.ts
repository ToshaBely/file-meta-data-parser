import { Reflector } from '@nestjs/core';

import type { ResourcePermission } from '../types/resource-permission.types';

export const RequiredResourcePermissions =
  Reflector.createDecorator<ResourcePermission[]>();
