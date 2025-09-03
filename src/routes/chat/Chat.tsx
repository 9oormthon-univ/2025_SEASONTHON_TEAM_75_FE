import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "../../styles/chatbot.css";
import * as C from "./ChatStyle";
import config from "../../bot/config";
import MessageParser from "../../bot/MessageParser";
import ActionProvider from "../../bot/ActionProvider";
import type { ActionProviderProps } from "../../bot/ActionProvider";
import ChatMicButton from "@components/chat/ChatMicButton";
import { useState } from "react";

const Chat = () => {
  const [selectedMode, setSelectedMode] = useState<"word" | "category" | null>(
    null
  );

  return (
    <C.Page>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={(props: ActionProviderProps) => (
          <ActionProvider {...props} setSelectedMode={setSelectedMode} />
        )}
        placeholderText="옵션을 선택하세요"
      />

      <ChatMicButton
        active={selectedMode === "word"}
        onClick={() => {
          console.log("print");
        }}
      />
    </C.Page>
  );
};
export default Chat;
