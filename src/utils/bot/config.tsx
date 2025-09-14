import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";
import Header from "@components/Header";
import ChatBox from "@components/chat/ChatBox";
import SearchWidgetGroup from "@components/chat/SearchWidgetGroup";
import TrashWidgetGroup from "@components/chat/TrashWidgetGroup";
import Chatbot from "react-chatbot-kit";
import TrashItemWidgetGroup from "@components/chat/TrashItemWidgetGroup";

type SearchMode = "word" | "category";

export type SearchWidgetProps = {
  actions: {
    selectSearchMode: (mode: SearchMode, title: string) => void;
    setSelectedMode: (mode: SearchMode | null) => void;
  };
};

export type TrashWidgetProps = {
  actions: {
    selectTrashCategory: (category: {
      id: number;
      name: string;
      code?: string;
    }) => void;
  };
  payload?: Array<{ id: number; code: string; name: string }>;
};

export type TrashItemWidgetProps = {
  actions: { selectTrashItem: (item: { id: number; name: string }) => void };
  payload?: Array<{ id: number; name: string }>;
};

type WidgetConfig<T> = {
  widgetName: string;
  widgetFunc: (props: T) => React.ReactElement;
  props?: Partial<T>;
  mapStateToProps?: string[];
};

type WidgetEntry =
  | WidgetConfig<SearchWidgetProps>
  | WidgetConfig<TrashWidgetProps>
  | WidgetConfig<TrashItemWidgetProps>;

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
  widgets?: WidgetEntry[];
};

const rawConfig: MinimalChatbotConfig = {
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
    header: () => <Header title="챗봇" isBorder={true} isBackButton={true} />,
    botAvatar: () => <div />,
    botChatMessage: (props) => <ChatBox {...props} bot />,
    userAvatar: () => <div />,
    userChatMessage: (props) => <ChatBox {...props} />,
  },
  widgets: [
    {
      widgetName: "searchWidgets",
      widgetFunc: (props: SearchWidgetProps) => (
        <SearchWidgetGroup {...props} />
      ),
      props: {},
      mapStateToProps: [],
    },
    {
      widgetName: "trashTypeWidgets",
      widgetFunc: (props: TrashWidgetProps) => <TrashWidgetGroup {...props} />,
      props: {},
      mapStateToProps: [],
    },
    {
      widgetName: "trashItemWidgets",
      widgetFunc: (props: TrashItemWidgetProps) => (
        <TrashItemWidgetGroup {...props} />
      ),
      props: {},
      mapStateToProps: [],
    },
  ],
};

// Chat.tsx에서 타입 오류 나는 거 막는 용도...
type ChatbotProps = React.ComponentProps<typeof Chatbot>;
type LibConfig = ChatbotProps["config"];
type LibWidget = NonNullable<LibConfig["widgets"]>[number];

function adaptConfig(cfg: MinimalChatbotConfig): LibConfig {
  const widgets: LibWidget[] = (cfg.widgets ?? []).map<LibWidget>((w) => ({
    widgetName: w.widgetName,
    widgetFunc: w.widgetFunc as (props: unknown) => React.ReactElement,
    props: (w.props ?? {}) as Record<string, unknown>,
    mapStateToProps: w.mapStateToProps ?? [],
  }));

  return {
    botName: cfg.botName,
    initialMessages: cfg.initialMessages,
    customComponents: cfg.customComponents,
    widgets,
  };
}

const config = adaptConfig(rawConfig);
export default config;
