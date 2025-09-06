import Header from "@components/Header";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Feedback = () => {
  return (
    <Container>
      <Header title="피드백 하기" isBackButton={true} />
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSebnog_YEht_syIMGonR_uJcCXgGY48EaMuyRffWcTcFfQKNQ/viewform?usp=dialog"
        style={{ flex: 1, border: "none" }}
        title="피드백 폼"
      />
    </Container>
  );
};

export default Feedback;
