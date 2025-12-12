import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthActions, useAuthStatus } from "@stores/authStore";

const AuthInitializer = () => {
  const authStatus = useAuthStatus();
  const { checkAuth } = useAuthActions();

  useEffect(() => {
    if (authStatus === "loading") {
      checkAuth().then((resolvedStatus) => {
        console.log("AuthInitializer: ", resolvedStatus);
      });
    }
  }, [authStatus, checkAuth]);

  return <Outlet />;
};

export default AuthInitializer;
