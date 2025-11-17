import { getGrantedPermissions, requestPermission } from 'react-native-health-connect';

export const READ_STEPS_PERMISSION = [
  { accessType: 'read', recordType: 'Steps' },
] as const;

export const WRITE_STEPS_PERMISSION = [
  { accessType: 'write', recordType: 'Steps' },
] as const;

export const hasReadStepsPermission = (
  permissions: Array<{ accessType: string; recordType: string }> | null | undefined
) => {
  if (!permissions) return false;
  return permissions.some(
    (permission) =>
      'recordType' in permission &&
      permission.recordType === 'Steps' &&
      permission.accessType === 'read'
  );
};

export const requestStepsPermission = async () => {
  const result = await requestPermission(READ_STEPS_PERMISSION as any);
  return hasReadStepsPermission(result);
};

export const fetchGrantedStepsPermission = async () => {
  const granted = await getGrantedPermissions();
  return hasReadStepsPermission(granted);
};
