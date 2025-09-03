import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";
import Header from "@components/Header";
import ChatBox from "@components/chat/ChatBox";
import SearchWidgetGroup from "@components/chat/SearchWidgetGroup";

type SearchMode = "word" | "category";

type WidgetProps = {
  actions: {
    selectSearchMode: (mode: SearchMode, title: string) => void;
    setSelectedMode: (mode: SearchMode | null) => void;
  };
};

type WidgetConfig = {
  widgetName: string;
  widgetFunc: (props: WidgetProps) => React.ReactElement;
  props: Record<string, unknown>;
  mapStateToProps: string[];
};

type MinimalChatbotConfig = {
  botName?: string;
  initialMessages: ReturnType<typeof createChatBotMessage>[];
  customComponents?: {
    header?: () => React.ReactElement;
    botAvatar?: () => React.ReactElement;
    botChatMessage?: (
      props: React.ComponentProps<typeof ChatBox>
    ) => React.ReactElement;
    userAvatar?: () => React.ReactElement;
    userChatMessage?: (
      props: React.ComponentProps<typeof ChatBox>
    ) => React.ReactElement;
  };
  widgets?: WidgetConfig[];
};

const config: MinimalChatbotConfig = {
  botName: "에코사령관",
  initialMessages: [
    createChatBotMessage(
      `여기는 분리특공대 본부. 나는 이 작전을 총괄하는 AI 지휘관, 에코사령관이야.
지구는 지금 쓰레기 위기로 위태로워. 우리의 임무는 단 하나― 올바른 분리수거로 행성을 지켜내는 것!`,
      {}
    ),
    createChatBotMessage(
      `자, 목표 쓰레기를 알려줘. 내가 바로 분석해서 정확한 분리수거 공략을 알려줄게. 이 미션, 무조건 클리어 확정이야!`,
      { widget: "searchWidgets" }
    ),
  ],
  customComponents: {
    header: () => <Header title="챗봇" />,
    botAvatar: () => <div />,
    botChatMessage: (props) => <ChatBox {...props} bot />,
    userAvatar: () => <div />,
    userChatMessage: (props) => <ChatBox {...props} />,
  },
  widgets: [
    {
      widgetName: "searchWidgets",
      widgetFunc: (props: WidgetProps) => <SearchWidgetGroup {...props} />,
      props: {},
      mapStateToProps: [],
    },
  ],
};

export default config;
