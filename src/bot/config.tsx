import { createChatBotMessage } from "react-chatbot-kit";
import Header from "@components/Header";
import ChatBox from "@components/chat/ChatBox";
import SearchWidgetGroup from "@components/chat/SearchWidgetGroup";

const config = {
  botName: "에코사령관",
  initialMessages: [
    createChatBotMessage(
      `여기는 분리특공대 본부. 우리의 임무는 단 하나―
올바른 분리수거로 행성을 지켜내는 것!
나는 이 작전을 총괄하는 AI 지휘관, 에코사령관이다.`,
      {}
    ),
    createChatBotMessage(
      `자네가 품목을 보고하면 내가 즉시 분석해
정확한 분리수거 지침을 내려주겠다.`,
      { widget: "searchWidgets" }
    ),
  ],
  customComponents: {
    header: () => <Header title="챗봇" />,
    botAvatar: () => <div />,
    botChatMessage: (props: React.ComponentProps<typeof ChatBox>) => (
      <ChatBox {...props} bot />
    ),
    userAvatar: () => <div />,
    userChatMessage: (props: React.ComponentProps<typeof ChatBox>) => (
      <ChatBox {...props} />
    ),
  },
  widgets: [
    {
      widgetName: "searchWidgets",
      widgetFunc: (props: {
        actions: {
          selectSearchMode: (mode: "word" | "category", title: string) => void;
        };
      }) => <SearchWidgetGroup {...props} />,
      props: {},
      mapStateToProps: [],
    },
  ],
};

export default config;
