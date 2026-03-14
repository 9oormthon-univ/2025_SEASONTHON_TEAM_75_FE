import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as P from "./PointStoreStyle";
import Header from "@components/Header";
import NoCouponIcon from "@assets/history_zero.svg";
import DropdownIcon from "@assets/dropdown.svg";
import PointStoreCard from "@components/setting/pointstore/PointStoreCard";

type SortType = "기본순" | "포인트순";
const SORT_OPTIONS: SortType[] = ["기본순", "포인트순"];

interface StoreItem {
	id: number;
	imageUrl: string;
	isOnline: boolean;
	title: string;
	points: number;
}

const MOCK_ITEMS: StoreItem[] = [
	{
		id: 1,
		imageUrl: "https://placehold.co/100x100",
		isOnline: false,
		title: "공방 체험 10% 할인쿠폰",
		points: 1500,
	},
	{
		id: 2,
		imageUrl: "https://placehold.co/100x100",
		isOnline: true,
		title: "에코백 온라인 구매 쿠폰",
		points: 2000,
	},
	{
		id: 3,
		imageUrl: "https://placehold.co/100x100",
		isOnline: false,
		title: "재활용 공방 입장권",
		points: 800,
	},
];

const PointStore = () => {
	const [items, setItems] = useState<StoreItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [sort, setSort] = useState<SortType>("기본순");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		// TODO: API 연동
		setItems(MOCK_ITEMS);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
		sort === "포인트순" ? a.points - b.points : a.id - b.id,
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
					<img src={NoCouponIcon} alt="쿠폰 없음" />
					등록된 쿠폰이 없어요
				</P.NoItemBox>
			) : (
				<P.CardWrapper>
					{sorted.map((item) => (
						<PointStoreCard
							key={item.id}
							imageUrl={item.imageUrl}
							isOnline={item.isOnline}
							title={item.title}
							points={item.points}
							onClick={() => navigate(`/store/${item.id}`)}
						/>
					))}
				</P.CardWrapper>
			)}
		</P.Container>
	);
};

export default PointStore;
