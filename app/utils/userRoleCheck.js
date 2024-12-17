import { useEffect, useState } from "react";

export const useRoleCheck = (requiredRole) => {
  const [role, setRole] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Ensure this only runs on the client
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("role");
      setRole(storedRole);
      setIsAuthorized(storedRole === requiredRole);
    }
  }, [requiredRole]);

  return { isAuthorized, role };
};
