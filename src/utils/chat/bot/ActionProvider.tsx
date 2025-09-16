import React from "react";
import apiClient from "@utils/apiClient";
import {
  createChatBotMessage as _createChatBotMessage,
  createClientMessage as _makeClientMessage,
} from "react-chatbot-kit";
import {
  WidgetNames,
  type Actions,
  type ChatMessage,
  type ChatState,
  type SearchMode,
  type UserMessage,
  type UserResponse,
} from "@types";
import {
  getMsgId,
  getMsgText,
  stripWidget,
  STT_MESSAGE_ID,
  type MutableChatMessage,
} from "../message";
import { BotApi } from "../botApi";

export type ActionProviderProps = {
  createChatBotMessage: typeof _createChatBotMessage;
  createClientMessage?: typeof _makeClientMessage;
  setState: React.Dispatch<React.SetStateAction<ChatState>>;
  children: React.ReactNode;

  setSelectedMode: React.Dispatch<React.SetStateAction<SearchMode | null>>;

  // STT
  onExpose?: (actions: Actions) => void;
};

const ActionProvider: React.FC<ActionProviderProps> = ({
  createChatBotMessage,
  createClientMessage,
  setState,
  children,
  setSelectedMode,
  onExpose,
}) => {
  // 사용자 이름
  const [userName, setUserName] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.get<UserResponse>("/api/v1/users/me");
        setUserName(data?.data?.nickName?.trim() ?? "");
      } catch (e) {
        console.error("사용자 조회 실패: ", e);
      }
    })();
  }, []);

  // 메시지
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
          ? `멋진 선택이야, ${userName}요원! \n이제 목표 쓰레기를 알려 줘.`
          : `멋진 선택이야, ${userName}요원! \n먼저 작전 구역을 선택해 줘.`;

      const next = pushBot(introText);

      // 위젯 제거
      setState((prev) => {
        const msgs = [...prev.messages];
        const revIdx = [...msgs]
          .reverse()
          .findIndex(
            (m) => (m as MutableChatMessage).widget === WidgetNames.Search
          );
        if (revIdx !== -1) {
          const realIdx = msgs.length - 1 - revIdx;
          msgs[realIdx] = stripWidget(msgs[realIdx]);
        }
        return {
          ...prev,
          messages: [...msgs, userMsg, next],
          selectedMode: mode,
        };
      });

      setSelectedMode(mode);

      // 카테고리 모드면 카테고리 API 호출
      if (mode === "category") void actions.fetchTrashTypes(introText);
    },

    setSelectedMode: (mode) => {
      setState((prev) => ({ ...prev, selectedMode: mode }));
      setSelectedMode(mode);
    },

    // STT
    beginSTT: () => {
      setState((prev) => {
        if (prev.messages.some((m) => getMsgId(m) === STT_MESSAGE_ID))
          return prev;

        const base = clientMsg("듣는 중...", { withAvatar: false }); // UserMessage
        const msg: MutableChatMessage = {
          ...base,
          messageId: STT_MESSAGE_ID,
        };

        return { ...prev, messages: [...prev.messages, msg] };
      });
    },

    updateSTT: (text) => {
      setState((prev) => {
        const msgs = [...prev.messages];
        const idx = msgs.findIndex((m) => getMsgId(m) === STT_MESSAGE_ID);
        if (idx === -1) return prev;

        const prevMsg = msgs[idx] as MutableChatMessage;
        msgs[idx] = { ...prevMsg, message: text } as ChatMessage;
        return { ...prev, messages: msgs };
      });
    },

    endSTT: (finalText) => {
      let finalized = (finalText ?? "").trim();
      setState((prev) => {
        const msgs = [...prev.messages];
        const idx = msgs.findIndex((m) => getMsgId(m) === STT_MESSAGE_ID);
        if (idx === -1) return prev;

        const last = msgs[idx] as MutableChatMessage;
        if (!finalized) finalized = (getMsgText(last) ?? "").trim();

        const done: MutableChatMessage = { ...last, message: finalized };
        delete done.messageId;

        msgs[idx] = done as ChatMessage;
        return { ...prev, messages: msgs };
      });
      if (finalized) void actions.searchKeyword(finalized);
    },

    // 단어검색 API 호출
    searchKeyword: async (raw: string) => {
      const keyword = raw.trim();
      if (!keyword) return;

      // 로딩
      setState((p) => ({ ...p, messages: [...p.messages, pushBot("•••")] }));

      try {
        const { data } = await BotApi.searchByKeyword(keyword);

        // 응답 없음 처리
        if (!data?.data) {
          const fail = pushBot(
            "흠… 지금 보고된 정보는 내가 분석할 수 없는 대상이야.\n미안하지만 다시 한 번만 더 정확히 알려줄 수 있어?"
          );
          setState((prev) => {
            const msgs = prev.messages.slice(0, -1); // 로딩 제거
            return { ...prev, messages: [...msgs, fail] };
          });
          return;
        }

        const { guideSteps, cautionNote, trashDescriptionId } = data.data;

        // 가이드 스텝 없음, 미분류(-1)
        if (
          !Array.isArray(guideSteps) ||
          guideSteps.length === 0 ||
          trashDescriptionId === -1
        ) {
          const fail = pushBot(
            "흠… 지금 보고된 정보는 내가 분석할 수 없는 대상이야.\n미안하지만 다시 한 번만 더 정확히 알려줄 수 있어?"
          );
          setState((prev) => {
            const msgs = prev.messages.slice(0, -1); // 로딩 제거
            return { ...prev, messages: [...msgs, fail] };
          });
          return;
        }

        // 정상 플로우
        const m0 = pushBot(
          `이번 임무의 코드네임은 '${keyword} 분리수거 작전'이야.\n지금부터 단계별 절차를 안내할게!`
        );

        // 가이드 스텝
        const guideText = guideSteps
          .map((s, i) => `STEP ${i + 1}. ${s}`)
          .join("\n");

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

        setSelectedMode(null);
      } catch (e) {
        console.error(e);
        const err = pushBot("서버와 통신에 실패했어. 잠시 후 다시 시도해줘!");
        setState((prev) => {
          const msgs = prev.messages.slice(0, -1);
          return { ...prev, messages: [...msgs, err] };
        });

        setSelectedMode(null);
      }
    },

    // 상위 카테고리 API
    fetchTrashTypes: async (introText?: string) => {
      // 로딩
      setState((p) => ({ ...p, messages: [...p.messages, pushBot("•••")] }));

      try {
        const { data } = await BotApi.fetchTrashTypes();

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
          msgs.pop();

          const revIdx = [...msgs]
            .reverse()
            .findIndex((m) => getMsgText(m) === introText);
          if (revIdx !== -1) {
            const realIdx = msgs.length - 1 - revIdx;

            // 텍스트 유지, 위젯 붙이기
            msgs[realIdx] = createChatBotMessage(
              introText ?? "카테고리를 선택해 줘!",
              {
                widget: "trashTypeWidgets",
                payload,
              }
            );
          } else {
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
    selectTrashCategory: ({ id, name }) => {
      const userMsg = clientMsg(name);
      const anchor = pushBot(
        `확인 완료! ${name} 구역에 진입했어. 이제 목표물을 조준해 줘!`
      );

      setState((p) => {
        const msgs = [...p.messages];
        const revIdx = [...msgs]
          .reverse()
          .findIndex(
            (m) => (m as MutableChatMessage).widget === WidgetNames.TrashType
          );
        if (revIdx !== -1) {
          const realIdx = msgs.length - 1 - revIdx;
          msgs[realIdx] = stripWidget(msgs[realIdx]);
        }
        return {
          ...p,
          messages: [...msgs, userMsg, anchor],
          selectedMode: "category",
        };
      });
      setSelectedMode("category");
      void actions.fetchTrashItemsByTypeId(id);
    },

    // 하위 카테고리 조회
    fetchTrashItemsByTypeId: async (trashTypeId) => {
      // 로딩
      setState((p) => ({ ...p, messages: [...p.messages, pushBot("•••")] }));

      try {
        const { data } = await BotApi.fetchTrashItemsByTypeId(trashTypeId);

        const items = Array.isArray(data?.data) ? data.data : [];
        const payload = items.map((it) => ({
          id: it.trashItemId,
          name: it.itemName,
        }));

        setState((prev) => {
          const msgs = prev.messages.slice(0, -1);

          // 직전 말풍선
          const lastIdx = msgs.length - 1;

          // 텍스트 유지, 위젯 추가
          const anchorText = getMsgText(msgs[lastIdx]) ?? "목표물을 조준해 줘!";
          msgs[lastIdx] = createChatBotMessage(anchorText, {
            widget: "trashItemWidgets",
            payload,
          });

          return { ...prev, messages: msgs };
        });
      } catch (e) {
        console.error(e);
        const err = pushBot(
          "하위 카테고리를 불러오지 못했어. 잠시 후 다시 시도해줘!"
        );
        setState((prev) => {
          const msgs = prev.messages.slice(0, -1); // 로딩 제거
          return { ...prev, messages: [...msgs, err] };
        });
      }
    },

    // 하위 카테고리 선택
    selectTrashItem: ({ name }) => {
      const userMsg = clientMsg(name);
      setState((p) => {
        const msgs = [...p.messages];
        const revIdx = [...msgs]
          .reverse()
          .findIndex(
            (m) => (m as MutableChatMessage).widget === WidgetNames.TrashItem
          );
        if (revIdx !== -1) {
          const realIdx = msgs.length - 1 - revIdx;
          msgs[realIdx] = stripWidget(msgs[realIdx]);
        }
        return { ...p, messages: [...msgs, userMsg] };
      });
      void actions.searchKeyword(name);
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
