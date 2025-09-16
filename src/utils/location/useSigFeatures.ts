import { useEffect, useMemo, useState } from "react";
import type { GeoJSON, GeoJSONFeature, Sigungu } from "@types";

// 시군구 GeoJSON 로딩 훅
export function useSigFeatures() {
  const [features, setFeatures] = useState<GeoJSONFeature[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch("/sig.json")
      .then((r) => r.json())
      .then((json: GeoJSON) => {
        if (alive) setFeatures(json.features);
      })
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const sigunguList: Sigungu[] = useMemo(() => {
    if (!features) return [];
    return features.map((f) => ({
      code: f.properties.SIG_CD,
      name: f.properties.SIG_KOR_NM,
    }));
  }, [features]);

  return { features, sigunguList, loading, error } as const;
}
