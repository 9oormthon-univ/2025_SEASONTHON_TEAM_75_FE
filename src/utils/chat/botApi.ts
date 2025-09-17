import type {
  SearchResponse,
  TrashItemsResponse,
  TrashTypesResponse,
  UserResponse,
} from "@types";
import apiClient from "@utils/apiClient";

export const BotApi = {
  me: () => apiClient.get<UserResponse>("/api/v1/users/me"),
  searchByKeyword: (keyword: string) =>
    apiClient.get<SearchResponse>("/api/v1/questions/search", {
      params: { keyword },
    }),
  fetchTrashTypes: () =>
    apiClient.get<TrashTypesResponse>("/api/v1/questions/trash-types"),
  fetchTrashItemsByTypeId: (trashTypeId: number) =>
    apiClient.get<TrashItemsResponse>(
      `/api/v1/questions/trash-types/${trashTypeId}`
    ),
};
