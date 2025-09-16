import { useReducer, useMemo } from "react";
import type { MyLocationItem } from "@types";

interface State {
  items: MyLocationItem[];
  selectedId: string | number | null;
}

type Action =
  | { type: "SELECT"; id: string | number }
  | { type: "REMOVE"; id: string | number }
  | { type: "ADD"; item: MyLocationItem }
  | { type: "REPLACE"; items: MyLocationItem[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SELECT":
      return state.selectedId === action.id
        ? state
        : { ...state, selectedId: action.id };
    case "REMOVE": {
      const nextItems = state.items.filter((i) => i.id !== action.id);
      const nextSelected =
        state.selectedId === action.id
          ? nextItems[0]?.id ?? null
          : state.selectedId;
      return { items: nextItems, selectedId: nextSelected };
    }
    case "ADD": {
      const nextItems = [...state.items, action.item];
      return {
        items: nextItems,
        selectedId: state.selectedId ?? action.item.id,
      };
    }
    case "REPLACE":
      return {
        items: action.items,
        selectedId: action.items.length ? action.items[0].id : null,
      };
    default:
      return state;
  }
}

export function useMyLocationList(initialItems: MyLocationItem[] = []) {
  const initialState = useMemo<State>(
    () => ({
      items: initialItems,
      selectedId: initialItems.length > 0 ? initialItems[0].id : null,
    }),
    [initialItems]
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      select: (id: string | number) => dispatch({ type: "SELECT", id }),
      remove: (id: string | number) => dispatch({ type: "REMOVE", id }),
      add: (item: MyLocationItem) => dispatch({ type: "ADD", item }),
      replace: (items: MyLocationItem[]) =>
        dispatch({ type: "REPLACE", items }),
    }),
    []
  );

  return { ...state, actions };
}
