type ResourceType = 'documents' | 'something-else';
type ResourceAccessType = 'read' | 'admin'; // 'admin' === 'read' + 'write'

export type ResourcePermission = `${ResourceType}:${ResourceAccessType}`;

const RESOURCE_PERMISSIONS_REGEX = /^([a-z]+):([a-z]+)$/i;

export function isResourcePermission(
  maybeResourcePermission: string,
): maybeResourcePermission is ResourcePermission {
  return RESOURCE_PERMISSIONS_REGEX.test(maybeResourcePermission);
}
