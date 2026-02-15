const resourceTypes = ['documents', 'other-resource'] as const;
type ResourceType = (typeof resourceTypes)[number];

// 'admin' === 'read' + 'write'
const resourceAccessTypes = ['read', 'admin'] as const;
type ResourceAccessType = (typeof resourceAccessTypes)[number];

export type ResourcePermission = `${ResourceType}:${ResourceAccessType}`;

const RESOURCE_PERMISSIONS_REGEX = new RegExp(
  `^(${resourceTypes.join('|')}):(${resourceAccessTypes.join('|')})$`,
);

export function isResourcePermission(
  maybeResourcePermission: string,
): maybeResourcePermission is ResourcePermission {
  return RESOURCE_PERMISSIONS_REGEX.test(maybeResourcePermission);
}

export const VERBOSE_RESOURCE_PERMISSIONS_MAP: Record<
  ResourcePermission,
  Set<ResourcePermission>
> = resourceTypes
  .map((resource) => {
    return resourceAccessTypes.map<
      [ResourcePermission, Set<ResourcePermission>]
    >((accessType) => {
      switch (accessType) {
        case 'admin': {
          return [
            `${resource}:${accessType}`,
            new Set<ResourcePermission>([
              `${resource}:admin`,
              `${resource}:read`,
            ]),
          ];
        }
        case 'read': {
          return [
            `${resource}:${accessType}`,
            new Set<ResourcePermission>([`${resource}:read`]),
          ];
        }
        default: {
          throw new Error('Unsupported resource permission access type');
        }
      }
    });
  })
  .flat()
  .reduce(
    (acc, [mappingKey, mappingValue]) => {
      acc[mappingKey] = mappingValue;
      return acc;
    },
    {} as Record<ResourcePermission, Set<ResourcePermission>>,
  );
