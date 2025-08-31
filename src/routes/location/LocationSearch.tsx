import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "./LocationSearchStyle";
import Header from "@components/Header";
import SearchIcon from "@/assets/search.svg";
import XIcon from "@/assets/search_x.svg";
import LocationSearchItem from "@components/location/LocationSearchItem";

const LocationSearch = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handlePick = (title: string) => {
    navigate("/location", {
      state: {
        source: "location_search",
        setup: true,
        selected: title,
      },
    });
  };

  return (
    <L.Page>
      <Header title={"내 동네 설정"} onBack={() => console.log("뒤로가기")} />

      <L.SearchBox>
        <img src={SearchIcon} alt="검색" />
        <input
          type="text"
          placeholder="내 동네를 검색하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button onClick={() => setKeyword("")}>
            <img src={XIcon} alt="취소" />
          </button>
        )}
      </L.SearchBox>

      <L.SearchList>
        <LocationSearchItem
          title="서울시 마포구 성산동"
          onClick={() => handlePick("서울시 마포구 성산동")}
        />
        <LocationSearchItem
          title="서울시 마포구 망원동"
          onClick={() => handlePick("서울시 마포구 망원동")}
        />
        <LocationSearchItem
          title="서울시 마포구 서교동"
          onClick={() => handlePick("서울시 마포구 서교동")}
        />
      </L.SearchList>
    </L.Page>
  );
};
export default LocationSearch;
