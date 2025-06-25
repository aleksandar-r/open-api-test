interface RoleProps {
  role: string;
  match: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Role({ children, fallback = null, role, match }: RoleProps) {
  const isAuthorized = match.includes(role);
  return <>{isAuthorized ? children : fallback}</>;
}
