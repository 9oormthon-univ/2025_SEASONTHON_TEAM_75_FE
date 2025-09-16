import React, { useRef, useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "../../styles/chatbot.css";
import * as C from "./ChatStyle";
import config from "../../utils/bot/config";
import MessageParser from "../../utils/bot/MessageParser";
import ActionProvider, {
  type ActionProviderProps,
  type Actions,
} from "../../utils/bot/ActionProvider";
import ChatMicButton from "@components/chat/ChatMicButton";

type SearchMode = "word" | "category";

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
  isFinal?: boolean;
}
interface SpeechRecognitionEvent extends Event {
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop?: () => void;
  abort?: () => void;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function resolveSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  const w = window as unknown as {
    SpeechRecognition?: unknown;
    webkitSpeechRecognition?: unknown;
  };

  const c1 = w.SpeechRecognition;
  const c2 = w.webkitSpeechRecognition;

  const ctor =
    typeof c1 === "function" ? c1 : typeof c2 === "function" ? c2 : null;

  return (ctor as unknown as SpeechRecognitionConstructor) ?? null;
}

const Chat: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [selectedMode, setSelectedMode] = useState<SearchMode | null>(null);

  const isInputDisabled = isListening || selectedMode !== "word";

  const lastTranscriptRef = useRef("");
  const sttEndedRef = useRef(false);

  const actionsRef = useRef<Actions | null>(null);

  // 입력값 비어있는지, 단어검색 모드인지
  const validator = (input: string) => {
    const canInput = !isListening && selectedMode === "word";
    const hasText = input.trim().length > 0;

    return canInput && hasText;
  };

  const startListening = () => {
    const SpeechRecognitionCtor = resolveSpeechRecognitionCtor();

    if (!SpeechRecognitionCtor) {
      alert("이 브라우저는 STT를 지원하지 않아요!");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "ko-KR";
    recognition.continuous = false; // 말 끝나면 종료
    recognition.interimResults = true; // 중간 결과 실시간

    lastTranscriptRef.current = "";
    sttEndedRef.current = false;

    const finalize = () => {
      if (sttEndedRef.current) return;
      sttEndedRef.current = true;
      const finalText = (lastTranscriptRef.current || "").trim();
      actionsRef.current?.endSTT(finalText);
      setIsListening(false);
    };

    // STT 시작
    actionsRef.current?.beginSTT();
    setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const text = result?.[0]?.transcript ?? "";

      // 실시간 반영
      actionsRef.current?.updateSTT(text);

      if (result?.isFinal) {
        actionsRef.current?.endSTT(text);
        setIsListening(false);
      }
    };

    recognition.onerror = () => finalize();
    recognition.onend = () => finalize();

    recognition.start();
  };

  return (
    <C.Page>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={(props: ActionProviderProps) => (
          <ActionProvider
            {...props}
            setSelectedMode={setSelectedMode}
            onExpose={(acts) => {
              actionsRef.current = acts;
            }}
          />
        )}
        placeholderText={
          isListening
            ? "단어형태로 말씀해주세요"
            : selectedMode === "word"
            ? "메시지를 입력해주세요"
            : "옵션을 선택하세요"
        }
        validator={validator}
      />

      <C.BottomTouchBlocker $disabled={isInputDisabled}>
        <ChatMicButton
          active={selectedMode === "word"}
          onClick={startListening}
        />
      </C.BottomTouchBlocker>
    </C.Page>
  );
};

export default Chat;
