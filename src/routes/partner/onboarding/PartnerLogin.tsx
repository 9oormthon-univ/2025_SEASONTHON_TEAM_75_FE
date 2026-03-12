import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as L from "./PartnerLoginStyle";
import MainButton from "@components/MainButton";
import { useAuthActions } from "@stores/authStore";
import BackIcon from "@assets/back.svg";
import PartnerLogo from "@assets/partner_logo.svg";
import CheckEmpty from "@assets/check_empty.svg";
import CheckFill from "@assets/check_fill.svg";

const PartnerLogin = () => {
	const navigate = useNavigate();
	const { loginAsPartner } = useAuthActions();

	const [id, setId] = useState("");
	const [pw, setPw] = useState("");
	const [keepLoggedIn, setKeepLoggedIn] = useState(false);

	const handleLogin = async () => {
		try {
			await loginAsPartner(id, pw);
			navigate("/partner/login/complete");
		} catch {
			alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
		}
	};

	return (
		<L.Page>
			<L.BackBtn onClick={() => navigate(-1)}>
				<img src={BackIcon} alt="뒤로가기" />
			</L.BackBtn>

			<L.Logo src={PartnerLogo} alt="파트너 로고" />

			<L.Form>
				<L.InputBox>
					<input
						type="text"
						value={id}
						onChange={(e) => setId(e.target.value)}
						placeholder="아이디를 입력하세요"
						autoComplete="username"
					/>
				</L.InputBox>

				<L.InputBox>
					<input
						type="password"
						value={pw}
						onChange={(e) => setPw(e.target.value)}
						placeholder="비밀번호를 입력하세요"
						autoComplete="current-password"
					/>
				</L.InputBox>
			</L.Form>

			<L.KeepLogin>
				<img
					src={keepLoggedIn ? CheckFill : CheckEmpty}
					alt="로그인 상태 유지"
					onClick={() => setKeepLoggedIn((v) => !v)}
				/>
				로그인 상태 유지
			</L.KeepLogin>

			<L.ButtonWrapper>
				<MainButton
					title="로그인"
					onClick={handleLogin}
					disabled={!id || !pw}
				/>
			</L.ButtonWrapper>
		</L.Page>
	);
};

export default PartnerLogin;
