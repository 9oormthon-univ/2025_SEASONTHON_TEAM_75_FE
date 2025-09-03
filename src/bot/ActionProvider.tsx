import React from "react";
import {
  createChatBotMessage as _createChatBotMessage,
  createClientMessage as _makeClientMessage,
} from "react-chatbot-kit";

// 타입
type BotMessage = ReturnType<typeof _createChatBotMessage>;
type UserMessage = ReturnType<typeof _makeClientMessage>;
type ChatMessage = BotMessage | UserMessage;

type ChatState = {
  messages: ChatMessage[];
};

type PossiblyWidgetMessage = {
  widget?: unknown;
  payload?: unknown;
};

export type Actions = {
  selectSearchMode: (mode: "word" | "category", title: string) => void;
  setSelectedMode: (mode: "word" | "category" | null) => void;
};

export type ActionProviderProps = {
  createChatBotMessage: typeof _createChatBotMessage;
  createClientMessage?: typeof _makeClientMessage;
  setState: React.Dispatch<React.SetStateAction<ChatState>>;
  children: React.ReactNode;

  setSelectedMode: React.Dispatch<
    React.SetStateAction<"word" | "category" | null>
  >;
};

function isPossiblyWidgetMessage(
  m: unknown
): m is PossiblyWidgetMessage & ChatMessage {
  return typeof m === "object" && m !== null;
}

const ActionProvider: React.FC<ActionProviderProps> = ({
  createChatBotMessage,
  createClientMessage,
  setState,
  children,
  setSelectedMode,
}) => {
  const clientMsg = (
    text: string,
    options: Record<string, unknown> = {}
  ): UserMessage => (createClientMessage ?? _makeClientMessage)(text, options);

  const actions: Actions = {
    selectSearchMode: (mode, title) => {
      const userMsg = clientMsg(title);
      const next: BotMessage =
        mode === "word"
          ? createChatBotMessage(
              "좋은 선택이다, 000요원. 이제 목표 대상을 직접 보고하라.",
              {}
            )
          : createChatBotMessage(
              "좋은 선택이다, 000요원. 먼저 작전 구역을 선택하라.",
              {}
            );

      setState((prev) => {
        const msgs = [...prev.messages];

        const revIdx = [...msgs]
          .reverse()
          .findIndex(
            (m) => isPossiblyWidgetMessage(m) && m.widget === "searchWidgets"
          );

        if (revIdx !== -1) {
          const realIdx = msgs.length - 1 - revIdx;
          const original = msgs[realIdx];

          if (isPossiblyWidgetMessage(original)) {
            const clone: Record<string, unknown> = { ...original };
            delete clone.widget;
            delete clone.payload;

            if (
              "props" in clone &&
              typeof clone.props === "object" &&
              clone.props
            ) {
              const cp = { ...(clone.props as Record<string, unknown>) };
              delete cp.widget;
              delete cp.payload;
              clone.props = cp;
            }
            msgs[realIdx] = clone as ChatMessage;
          }
        }

        return { ...prev, messages: [...msgs, userMsg, next] };
      });

      setSelectedMode(mode);
    },
    setSelectedMode: (mode) => {
      setState((prev) => ({ ...prev, selectedMode: mode }));
    },
  };

  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ actions?: Actions }>,
              { actions }
            )
          : child
      )}
    </>
  );
};

export default ActionProvider;
