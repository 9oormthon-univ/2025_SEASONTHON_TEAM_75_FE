import MainButton from "@components/MainButton";
import * as P from "./ProfileCompleteStyle";

const ProfileComplete = () => {
  return (
    <P.Page>
      <P.Image>임시</P.Image>

      <P.Title>프로필 설정이 완료되었어요</P.Title>
      <P.SubTitle>{`우리 동네에 딱 맞춘 분리수거 가이드,\n지금 시작해볼까요?`}</P.SubTitle>
      <P.ButtonGroup>
        <MainButton title="동네 설정하기" />
        <P.Button>건너뛰기</P.Button>
      </P.ButtonGroup>
    </P.Page>
  );
};
export default ProfileComplete;
