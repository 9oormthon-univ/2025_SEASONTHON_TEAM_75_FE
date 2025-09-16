import { useCallback, useState } from "react";
import type { Location } from "@types";
import apiClient from "@utils/apiClient";

// 자치구 검색 상태/액션 훅
export function useDistrictSearch() {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<Location | null>(null); // 선택된 자치구
  const [results, setResults] = useState<Location[]>([]); // api 응답
  const [hasSearched, setHasSearched] = useState(false); // 검색 완료 여부
  const [searching, setSearching] = useState(false); // 검색 중 여부 추가

  const reset = useCallback(() => {
    setKeyword("");
    setResults([]);
    setSelected(null);
    setHasSearched(false);
  }, []);

  const search = useCallback(async () => {
    const parts = keyword.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return;

    setSelected(null);
    setSearching(true); // 검색 시작
    setHasSearched(false);

    try {
      if (parts.length >= 2) {
        const { data } = await apiClient.get("/api/v1/districts", {
          params: { sido: parts[0], sigungu: parts.slice(1).join(" ") },
        });
        setResults(data?.data ?? []);
        return;
      }

      // 한 단어
      const q = parts[0];
      const [bySido, bySigungu] = await Promise.all([
        apiClient.get("/api/v1/districts", { params: { sido: q } }),
        apiClient.get("/api/v1/districts", { params: { sigungu: q } }),
      ]);

      const merged: Location[] = [
        ...(bySido.data?.data ?? []),
        ...(bySigungu.data?.data ?? []),
      ];

      // 중복 제거
      const unique = Object.values(
        merged.reduce(
          (acc, d) => ((acc[d.districtId] = d), acc),
          {} as Record<string, Location>
        )
      );

      setResults(unique);
    } catch (e) {
      console.error("검색 실패:", e);
      setResults([]);
    } finally {
      setSearching(false); // 검색 종료
      setHasSearched(true); // 판정 -> 항상 종료 후
    }
  }, [keyword]);

  return {
    keyword,
    setKeyword,
    results,
    selected,
    setSelected,
    searching,
    hasSearched,
    search,
    reset,
  } as const;
}
