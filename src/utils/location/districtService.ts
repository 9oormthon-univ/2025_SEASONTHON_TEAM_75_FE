import type { GeoJSONGeometry, LatLng } from "@types";

// 현재 위치 반환
export async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(new Error("Geolocation를 지원하지 않습니다."));
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 0,
    });
  });
}

// 지도 좌표 변환
type LngLat = [number, number];
type LinearRing = LngLat[];
type PolygonCoords = LinearRing[];
type MultiPolygonCoords = PolygonCoords[];

export function toLatLngPaths(geometry: GeoJSONGeometry): LatLng[][] {
  const polygons: MultiPolygonCoords =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

  return polygons.flatMap((rings: PolygonCoords) =>
    rings.map((ring: LinearRing) =>
      ring.map(([lng, lat]: LngLat) => ({ lat, lng }))
    )
  );
}
