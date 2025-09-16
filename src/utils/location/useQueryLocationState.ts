import type { LocationState } from "@types";
import { useLocation } from "react-router-dom";

export function useQueryLocationState() {
  const { state } = useLocation() as { state: LocationState };
  const isFromSearch: boolean = state?.source === "location_search";
  return {
    isFromSearch,
    setup: isFromSearch && !!state?.setup,
    selectedTitleFromQuery: isFromSearch ? state?.selected : undefined,
    sigCodeFromQuery: isFromSearch ? state?.sigCode : undefined,
    districtIdFromQuery: isFromSearch ? state?.districtId : undefined,
  } as const;
}
