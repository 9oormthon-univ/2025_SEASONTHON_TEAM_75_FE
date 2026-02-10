import styled from "styled-components";

export const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: white;
	position: relative;

	button {
		position: absolute;
		bottom: 50px;
	}
`;
