import React from "react";
import {
  createChatBotMessage as _createChatBotMessage,
  createClientMessage as _makeClientMessage,
} from "react-chatbot-kit";
import apiClient from "@utils/apiClient";

// 응답 타입
type SearchResponse = {
  httpCode: number;
  httpStatus: string;
  message: string;
  data: {
    trashDescriptionId: number;
    guideSteps: string[];
    cautionNote: string;
    typeName: string;
  };
};

type TrashType = {
  trashTypeId: number;
  typeCode: string;
  typeName: string;
};

type TrashTypesResponse = {
  httpCode: number;
  httpStatus: string;
  message: string;
  data: TrashType[];
};

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

  // 단어 검색 API
  searchKeyword: (raw: string) => Promise<void>;

  // 상위 카테고리 API
  fetchTrashTypes: (introText?: string) => Promise<void>;
  selectTrashCategory: (category: string) => void;
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

  const pushBot = (text: string, options: Record<string, unknown> = {}) =>
    createChatBotMessage(text, options);

  const actions: Actions = {
    selectSearchMode: (mode, title) => {
      const userMsg = clientMsg(title);

      const introText =
        mode === "word"
          ? "멋진 선택이야, 000요원! \n이제 목표 쓰레기를 알려 줘."
          : "멋진 선택이야, 000요원! \n먼저 작전 구역을 선택해 줘.";

      const next = pushBot(introText);

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

      // 카테고리 모드면 카테고리 API 호출
      if (mode === "category") {
        void actions.fetchTrashTypes(introText);
      }
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
      let finalized = (finalText ?? "").trim();

      setState((prev) => {
        const msgs = [...prev.messages];
        const idx = msgs.findIndex((m) => getMsgId(m) === STT_MESSAGE_ID);
        if (idx === -1) {
          return prev;
        }
        const last = msgs[idx];
        // 파라미터 없음 -> 말풍선에 남은 텍스트 사용
        if (!finalized) {
          finalized = (getMsgText(last) ?? "").trim();
        }

        const finalizedMsg: ChatMessage = {
          ...(last as object),
          message: finalized,
        } as ChatMessage;
        const withId = finalizedMsg as unknown as MessageWithId;
        delete withId.id; // STT ID 제거

        msgs[idx] = finalizedMsg;
        return { ...prev, messages: msgs };
      });

      if (finalized) {
        void actions.searchKeyword(finalized);
      }
    },

    // 단어검색 API 호출
    searchKeyword: async (raw: string) => {
      const keyword = raw.trim();
      if (!keyword) return;

      // 로딩
      const loading = pushBot("•••");
      setState((prev) => ({ ...prev, messages: [...prev.messages, loading] }));

      try {
        const { data } = await apiClient.get<SearchResponse>(
          "/api/v1/questions/search",
          {
            params: { keyword },
          }
        );

        if (!data?.data) {
          const fail = pushBot(
            "흠… 지금 보고된 정보는 내가 분석할 수 없는 대상이야.\n미안하지만 다시 한 번만 더 정확히 알려줄 수 있어?"
          );
          setState((prev) => {
            const msgs = prev.messages.slice(0, -1);
            return { ...prev, messages: [...msgs, fail] };
          });
          return;
        }

        const { guideSteps, cautionNote } = data.data;

        // 빈 배열인 경우
        if (!Array.isArray(guideSteps) || guideSteps.length === 0) {
          const fail = pushBot(
            `흠… 지금 보고된 정보는 내가 분석할 수 없는 대상이야.\n미안하지만 다시 한 번만 더 정확히 알려줄 수 있어?`
          );
          setState((prev) => {
            const msgs = prev.messages.slice(0, -1); // '...' 제거
            return { ...prev, messages: [...msgs, fail] };
          });
          return;
        }

        const m0 = pushBot(
          `이번 임무의 코드네임은 '${keyword} 분리수거 작전'이야.\n지금부터 단계별 절차를 안내할게!`
        );

        // 가이드 스텝
        const guideText =
          Array.isArray(guideSteps) && guideSteps.length
            ? guideSteps.map((s, i) => `STEP ${i + 1}. ${s}`).join("\n")
            : "가이드가 아직 준비되지 않았어요.";

        const m1 = pushBot(guideText);

        // 주의사항
        const m2 = pushBot(
          cautionNote?.trim()
            ? `⚠️ 주의사항\n${cautionNote}`
            : "주의사항이 없어요.",
          { widget: "searchWidgets" }
        );

        setState((prev) => {
          const msgs = prev.messages.slice(0, -1);
          return { ...prev, messages: [...msgs, m0, m1, m2] };
        });
      } catch (e) {
        console.error(e);
        const err = pushBot("서버와 통신에 실패했어. 잠시 후 다시 시도해줘!");
        setState((prev) => {
          const msgs = prev.messages.slice(0, -1);
          return { ...prev, messages: [...msgs, err] };
        });
      }
    },

    // 상위 카테고리 API
    fetchTrashTypes: async (introText?: string) => {
      // 로딩
      const loading = pushBot("•••");
      setState((prev) => ({ ...prev, messages: [...prev.messages, loading] }));

      try {
        const { data } = await apiClient.get<TrashTypesResponse>(
          "/api/v1/questions/trash-types"
        );

        const items = Array.isArray(data?.data) ? data.data : [];

        if (items.length === 0) {
          const fail = pushBot(
            "카테고리 정보를 불러오지 못했어. 잠시 후 다시 시도해줘!"
          );
          const msgs = (prev: ChatState) => prev.messages.slice(0, -1);
          setState((prev) => ({ ...prev, messages: [...msgs(prev), fail] }));
          return;
        }

        const payload = items.map((t) => ({
          id: t.trashTypeId,
          code: t.typeCode,
          name: t.typeName,
        }));

        setState((prev) => {
          const msgs = [...prev.messages];
          msgs.pop(); // 마지막 '•••' 제거

          // 뒤에서부터 "인트로 텍스트"인 버블을 찾는다
          const revIdx = [...msgs]
            .reverse()
            .findIndex((m) => getMsgText(m) === introText);
          if (revIdx !== -1) {
            const realIdx = msgs.length - 1 - revIdx;

            // 🟢 같은 텍스트를 유지하면서 위젯/payload만 붙여 '치환'
            msgs[realIdx] = createChatBotMessage(
              introText ?? "카테고리를 선택해 줘!",
              {
                widget: "trashTypeWidgets", // config에 등록한 위젯 이름과 동일
                payload,
              }
            );
          } else {
            // 혹시 못 찾으면 새 버블 하나로 대체
            msgs.push(
              createChatBotMessage("먼저 작전 구역을 선택해 줘!", {
                widget: "trashTypeWidgets",
                payload,
              })
            );
          }
          return { ...prev, messages: msgs };
        });
      } catch (e) {
        console.error(e);
        const err = pushBot("서버와 통신에 실패했어. 잠시 후 다시 시도해줘!");
        setState((prev) => {
          const msgs = prev.messages.slice(0, -1);
          return { ...prev, messages: [...msgs, err] };
        });
      }
    },

    // 상위 카테고리 선택 후
    selectTrashCategory: (category) => {
      const userMsg = clientMsg(category);

      const guide = pushBot(
        `확인 완료! ${category} 구역에 진입했어. 이제 목표물을 조준해 줘!`
      );

      setState((prev) => {
        // 마지막에 붙은 위젯(trashTypeWidgets) 제거/치환
        const msgs = [...prev.messages];

        // 뒤에서부터 위젯 버블 찾기
        const revIdx = [...msgs]
          .reverse()
          .findIndex(
            (m) =>
              m?.widget === "trashTypeWidgets" ||
              (isPossiblyWidgetMessage(m) &&
                (m as PossiblyWidgetMessage).widget === "trashTypeWidgets")
          );

        if (revIdx !== -1) {
          const realIdx = msgs.length - 1 - revIdx;
          const original = msgs[realIdx];

          // 같은 텍스트 유지하면서 widget/payload만 제거
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

        // 입력창을 활성화하려고 모드를 word로 전환
        return {
          ...prev,
          messages: [...msgs, userMsg, guide],
          selectedMode: "word",
        };
      });

      // 외부로도 반영 (Chat.tsx placeholder 제어용)
      setSelectedMode("word");
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
