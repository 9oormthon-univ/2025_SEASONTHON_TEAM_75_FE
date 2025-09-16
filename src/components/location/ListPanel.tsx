import * as L from "../../routes/location/LocationStyle";
import LocationList from "@components/location/LocationList";
import PlusIcon from "@assets/plus.svg";
import type { MyLocationItem } from "@types";

interface ListPanelProps {
  items: MyLocationItem[];
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
  onRemove: (id: string | number) => void;
  onAdd: () => void;
}

export default function ListPanel({
  items,
  selectedId,
  onSelect,
  onRemove,
  onAdd,
}: ListPanelProps) {
  return (
    <L.Bottom>
      <p>내 동네</p>
      <L.ButtonGroup>
        {items.map((loc) => (
          <LocationList
            key={loc.id}
            id={loc.id}
            title={loc.title}
            selected={selectedId === loc.id}
            onClick={() => onSelect(loc.id)}
            onRemove={onRemove}
          />
        ))}
        {items.length < 2 && (
          <L.AddButton onClick={onAdd}>
            <img src={PlusIcon} alt="추가" />
            <p>동네 추가하기</p>
          </L.AddButton>
        )}
      </L.ButtonGroup>
    </L.Bottom>
  );
}
