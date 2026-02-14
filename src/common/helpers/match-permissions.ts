import type { ResourcePermission } from '../types/resource-permission';
import {
  isResourcePermission,
  VERBOSE_RESOURCE_PERMISSIONS_MAP,
} from '../types/resource-permission';

export function matchPermissions(
  requiredResourcePermissions: ResourcePermission[],
  actorPermissionsString: string | string[] | undefined,
): boolean {
  if (typeof actorPermissionsString !== 'string') {
    return false;
  }

  if (!isResourcePermission(actorPermissionsString)) {
    return false;
  }

  const verboseActorPermissions =
    VERBOSE_RESOURCE_PERMISSIONS_MAP[actorPermissionsString];

  return requiredResourcePermissions.some((resourcePermission) =>
    verboseActorPermissions.has(resourcePermission),
  );
}
