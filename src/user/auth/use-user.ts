import { UserRole } from './constants';

export function useUser() {
  return { role: UserRole.Admin };
  // can be changed to 'viewer'
}
