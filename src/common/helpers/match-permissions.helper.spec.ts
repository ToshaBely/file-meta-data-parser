import { matchPermissions } from './match-permissions.helper';
import type { ResourcePermission } from '../types/resource-permission.types';

describe('matchPermissions helper', () => {
  describe('argument validation', () => {
    const requiredResourcePermissions: ResourcePermission[] = [
      'documents:read',
    ];

    it('should return false when "actorPermissionsString" is undefined', () => {
      expect(matchPermissions(requiredResourcePermissions, undefined)).toBe(
        false,
      );
    });

    it('should return false when "actorPermissionsString" is an empty array', () => {
      expect(matchPermissions(requiredResourcePermissions, [])).toBe(false);
    });

    it('should return false when "actorPermissionsString" is an array', () => {
      // array is not supported yet
      expect(
        matchPermissions(requiredResourcePermissions, ['documents:read']),
      ).toBe(false);
    });

    it('should return false when "actorPermissionsString" is not a ResourcePermission string', () => {
      expect(
        matchPermissions(requiredResourcePermissions, 'random:string'),
      ).toBe(false);
    });
  });

  it('should return true when "actorPermissionsString" is exactly the same what is required', () => {
    const requiredResourcePermissions: ResourcePermission[] = [
      'documents:read',
    ];

    expect(
      matchPermissions(requiredResourcePermissions, 'documents:read'),
    ).toBe(true);
  });

  it('should return true when "actorPermissionsString" is one of the required permissions', () => {
    const requiredResourcePermissions: ResourcePermission[] = [
      'documents:admin',
      'documents:read',
    ];

    expect(
      matchPermissions(requiredResourcePermissions, 'documents:read'),
    ).toBe(true);
  });

  it('should return true when "actorPermissionsString" is stronger than the required permissions', () => {
    const requiredResourcePermissions: ResourcePermission[] = [
      'documents:read',
    ];

    expect(
      matchPermissions(requiredResourcePermissions, 'documents:admin'),
    ).toBe(true);
  });

  it('should return false when "actorPermissionsString" does not match the required permissions', () => {
    const requiredResourcePermissions: ResourcePermission[] = [
      'documents:read',
    ];

    expect(
      matchPermissions(requiredResourcePermissions, 'other-resource:read'),
    ).toBe(false);
  });
});
