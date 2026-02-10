import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./PartnerSignupStyle";
import MainButton from "@components/MainButton";
import { useAuthActions } from "@stores/authStore";

const PartnerSignup = () => {
	const navigate = useNavigate();
	const { signupAsPartner } = useAuthActions();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [partnerName, setPartnerName] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState<File | null>(null);

	const isValid = partnerName && email && address && image;

	const handleSubmit = async () => {
		if (!image) {
			alert("업체 이미지를 선택해주세요.");
			return;
		}

		try {
			const metadata = {
				partnerName,
				email,
				address,
				...(description ? { description } : {}),
			};

			const password = await signupAsPartner(metadata, image);
			if (password) {
				alert(`회원가입 완료!\n임시 비밀번호: ${password}`);
			}

			navigate("/partner/login");
		} catch {
			alert("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
		}
	};

	return (
		<S.Container>
			<div>
				<label htmlFor="partnerName">파트너명</label>
				<input
					id="partnerName"
					type="text"
					value={partnerName}
					onChange={(e) => setPartnerName(e.target.value)}
				/>
			</div>

			<div>
				<label htmlFor="email">이메일</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					autoComplete="email"
				/>
			</div>

			<div>
				<label htmlFor="address">주소</label>
				<input
					id="address"
					type="text"
					value={address}
					onChange={(e) => setAddress(e.target.value)}
				/>
			</div>

			<div>
				<label htmlFor="description">소개</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>

			<div>
				<label>업체 이미지</label>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={(e) => setImage(e.target.files?.[0] ?? null)}
				/>
			</div>

			<MainButton
				title="회원가입"
				onClick={handleSubmit}
				disabled={!isValid}
			/>
		</S.Container>
	);
};

export default PartnerSignup;
