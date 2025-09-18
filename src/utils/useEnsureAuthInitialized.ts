import { useEffect } from "react";
import { useAuthActions, useAuthStatus } from "@stores/authStore";
import { useDistrictActions } from "@stores/userDistrictStore";

export default function useEnsureAuthInitialized() {
  const status = useAuthStatus();
  const { checkAuth } = useAuthActions();
  const { fetchDistricts } = useDistrictActions();

  useEffect(() => {
    if (status === "loading") {
      void checkAuth();
    }

    if (status === "member") {
      fetchDistricts();
    }
  }, [status, checkAuth, fetchDistricts]);

  return status;
}
