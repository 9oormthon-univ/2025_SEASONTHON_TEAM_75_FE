import React from "react";
import {
  createChatBotMessage as _createChatBotMessage,
  createClientMessage as _makeClientMessage,
} from "react-chatbot-kit";

// 공용 타입
type BotMessage = ReturnType<typeof _createChatBotMessage>;
type UserMessage = ReturnType<typeof _makeClientMessage>;
type ChatMessage = BotMessage | UserMessage;

type SearchMode = "word" | "category";

export type ChatState = {
  messages: ChatMessage[];
  selectedMode?: SearchMode | null;
};

type PossiblyWidgetMessage = {
  widget?: unknown;
  payload?: unknown;
  props?: Record<string, unknown>;
};

export type Actions = {
  selectSearchMode: (mode: SearchMode, title: string) => void;
  setSelectedMode: (mode: SearchMode | null) => void;

  // STT
  beginSTT: () => void;
  updateSTT: (text: string) => void;
  endSTT: (finalText?: string) => void;
};

export type ActionProviderProps = {
  createChatBotMessage: typeof _createChatBotMessage;
  createClientMessage?: typeof _makeClientMessage;
  setState: React.Dispatch<React.SetStateAction<ChatState>>;
  children: React.ReactNode;

  setSelectedMode: React.Dispatch<React.SetStateAction<SearchMode | null>>;

  // STT
  onExpose?: (actions: Actions) => void;
};

function isPossiblyWidgetMessage(
  m: unknown
): m is PossiblyWidgetMessage & ChatMessage {
  return typeof m === "object" && m !== null;
}

type MessageWithId = { id?: string; messageId?: string };
type MessageWithText = { message?: string };

const STT_MESSAGE_ID = "STT_MESSAGE_ID";

function getMsgId(m: ChatMessage): string | undefined {
  const maybe = m as unknown as MessageWithId;
  return maybe.id ?? maybe.messageId;
}

function getMsgText(m: ChatMessage): string | undefined {
  return (m as MessageWithText).message;
}

const ActionProvider: React.FC<ActionProviderProps> = ({
  createChatBotMessage,
  createClientMessage,
  setState,
  children,
  setSelectedMode,
  onExpose,
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
              "멋진 선택이야, 000요원! \n이제 목표 쓰레기를 알려 줘.",
              {}
            )
          : createChatBotMessage(
              "멋진 선택이야, 000요원! \n먼저 작전 구역을 선택해 줘.",
              {}
            );

      setState((prev) => {
        const msgs = [...prev.messages];

        // 위젯 제거
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

        return {
          ...prev,
          messages: [...msgs, userMsg, next],
          selectedMode: mode,
        };
      });

      setSelectedMode(mode);
    },

    setSelectedMode: (mode) => {
      setState((prev) => ({ ...prev, selectedMode: mode }));
      setSelectedMode(mode);
    },

    // STT
    beginSTT: () => {
      setState((prev) => {
        const exists = prev.messages.some(
          (m) => getMsgId(m) === STT_MESSAGE_ID
        );
        if (exists) return prev;

        const msg = clientMsg("듣는 중...", { withAvatar: false });
        (msg as unknown as MessageWithId).id = STT_MESSAGE_ID;
        return { ...prev, messages: [...prev.messages, msg] };
      });
    },

    updateSTT: (text: string) => {
      setState((prev) => {
        const msgs = [...prev.messages];
        const idx = msgs.findIndex((m) => getMsgId(m) === STT_MESSAGE_ID);
        if (idx === -1) return prev;

        const prevMsg = msgs[idx];
        msgs[idx] = { ...prevMsg, message: text } as ChatMessage;
        return { ...prev, messages: msgs };
      });
    },

    endSTT: (finalText?: string) => {
      setState((prev) => {
        const msgs = [...prev.messages];
        const idx = msgs.findIndex((m) => getMsgId(m) === STT_MESSAGE_ID);
        if (idx === -1) return prev;

        const last = msgs[idx];
        const text = (finalText ?? getMsgText(last) ?? "").trim();

        const finalized: ChatMessage = {
          ...(last as object),
          message: text,
        } as ChatMessage;

        const withId = finalized as unknown as MessageWithId;
        delete withId.id;

        msgs[idx] = finalized;
        return { ...prev, messages: msgs };
      });
    },
  };

  React.useEffect(() => {
    onExpose?.(actions);
  }, [onExpose]);

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
