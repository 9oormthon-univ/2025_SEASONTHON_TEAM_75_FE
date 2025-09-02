import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "../../styles/chatbot.css";
import * as C from "./ChatStyle";
import config from "../../bot/config";
import MessageParser from "../../bot/MessageParser";
import ActionProvider from "../../bot/ActionProvider";
import ChatMicButton from "@components/chat/ChatMicButton";

const Chat = () => {
  return (
    <C.Page>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        placeholderText="옵션을 선택하세요"
      />
      <ChatMicButton />
    </C.Page>
  );
};
export default Chat;
