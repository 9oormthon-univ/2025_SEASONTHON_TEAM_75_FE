import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as P from "./PointStoreStyle";
import Header from "@components/Header";
import NoCouponIcon from "@assets/history_zero.svg";
import DropdownIcon from "@assets/dropdown.svg";
import PointStoreCard from "@components/setting/pointstore/PointStoreCard";
import apiClient from "@utils/apiClient";
import type { StoreCoupon } from "@types";

type SortType = "기본순" | "포인트순";
const SORT_OPTIONS: SortType[] = ["기본순", "포인트순"];

const PointStore = () => {
  const [items, setItems] = useState<StoreCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<SortType>("기본순");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const result = await apiClient.get<{ data: StoreCoupon[] }>(
          "/api/v1/store/coupons",
        );
        setItems(result.data?.data ?? []);
      } catch (e) {
        console.error("포인트 상점 가져오기 실패:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SortType) => {
    setSort(option);
    setIsMenuOpen(false);
  };

  const sorted = [...items].sort((a, b) =>
    sort === "포인트순" ? a.pointCost - b.pointCost : a.couponId - b.couponId,
  );

  const itemCount = items.length;

  if (isLoading) {
    return (
      <P.Container>
        <Header title="포인트 상점" isBackButton={true} isBorder={true} />
      </P.Container>
    );
  }

  return (
    <P.Container>
      <Header title="포인트 상점" isBackButton={true} isBorder={true} />
      <P.SubHeader>
        <P.CouponCount>총 {itemCount}장</P.CouponCount>
        <P.SortDropdown ref={dropdownRef}>
          <P.SortTrigger onClick={() => setIsMenuOpen((v) => !v)}>
            {sort}
            <img src={DropdownIcon} alt="정렬" />
          </P.SortTrigger>
          {isMenuOpen && (
            <P.SortMenu>
              {SORT_OPTIONS.map((option) => (
                <P.SortOption
                  key={option}
                  $active={sort === option}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </P.SortOption>
              ))}
            </P.SortMenu>
          )}
        </P.SortDropdown>
      </P.SubHeader>
      {itemCount === 0 ? (
        <P.NoItemBox>
          <img src={NoCouponIcon} alt="상점 없음" />
          등록된 상점이 없어요
        </P.NoItemBox>
      ) : (
        <P.CardWrapper>
          {sorted.map((item) => (
            <PointStoreCard
              key={item.couponId}
              imageUrl={item.partnerResponse.imageUrl}
              isOnline={item.couponType === "ONLINE"}
              title={item.title}
              points={item.pointCost}
              onClick={() => navigate(`/store/${item.couponId}`)}
            />
          ))}
        </P.CardWrapper>
      )}
    </P.Container>
  );
};

export default PointStore;
