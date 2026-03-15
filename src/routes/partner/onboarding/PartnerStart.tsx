import Background from "@assets/start_back.svg";
import * as L from "./PartnerStartStyle";
import { useNavigate } from "react-router-dom";
import MainButton from "@components/MainButton";

const PartnerStart = () => {
	const navigate = useNavigate();

	return (
		<L.Container>
			<L.Back src={Background} alt="배경" />

			<MainButton
				title="파트너 등록 시작하기"
				onClick={() => navigate("/login")}
			/>

			<L.Title>
				<h1>{`재활용이\n쉬워지는\n똑똑한 한 컷`}</h1>
				<p>{`분리특공대와 함께하는 업사이클링 파트너십으로\n쿠폰 관리와 친환경 캠페인을 한 곳에서!`}</p>
			</L.Title>
		</L.Container>
	);
};
export default PartnerStart;
