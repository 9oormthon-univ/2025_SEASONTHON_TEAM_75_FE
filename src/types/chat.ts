import {
  createChatBotMessage as _createChatBotMessage,
  createClientMessage as _makeClientMessage,
} from "react-chatbot-kit";

// 공용
export type SearchMode = "word" | "category";

// 응답 타입
export interface SearchResponse {
  httpCode: number;
  httpStatus: string;
  message: string;
  data: {
    trashDescriptionId: number;
    guideSteps: string[];
    cautionNote: string;
    typeName: string;
  };
}

// 상위 카테고리 타입
type TrashType = {
  trashTypeId: number;
  typeCode: string;
  typeName: string;
};
export interface TrashTypesResponse {
  httpCode: number;
  httpStatus: string;
  message: string;
  data: TrashType[];
}

// 하위 카테고리 타입
type TrashItem = {
  trashItemId: number;
  itemName: string;
  typeName: string;
};
export interface TrashItemsResponse {
  httpCode: number;
  httpStatus: string;
  message: string;
  data: TrashItem[];
}

// Chatbot
export type BotMessage = ReturnType<typeof _createChatBotMessage>;
export type UserMessage = ReturnType<typeof _makeClientMessage>;
export type ChatMessage = BotMessage | UserMessage;

export interface ChatState {
  messages: ChatMessage[];
  selectedMode?: SearchMode | null;
}

export interface Actions {
  selectSearchMode: (mode: SearchMode, title: string) => void;
  setSelectedMode: (mode: SearchMode | null) => void;

  // STT
  beginSTT: () => void;
  updateSTT: (text: string) => void;
  endSTT: (finalText?: string) => void;

  // 단어 검색 API
  searchKeyword: (raw: string) => Promise<void>;

  // 카테고리 API
  fetchTrashTypes: (introText?: string) => Promise<void>;
  selectTrashCategory: (category: {
    id: number;
    name: string;
    code?: string;
  }) => void;
  fetchTrashItemsByTypeId: (trashTypeId: number) => Promise<void>;
  selectTrashItem: (item: { id: number; name: string }) => void;
}

// 위젯
export const WidgetNames = {
  Search: "searchWidgets",
  TrashType: "trashTypeWidgets",
  TrashItem: "trashItemWidgets",
} as const;
export type WidgetName = (typeof WidgetNames)[keyof typeof WidgetNames];

export type TrashTypePayload = Array<{
  id: number;
  code?: string;
  name: string;
}>;
export type TrashItemPayload = Array<{ id: number; name: string }>;

// 음성
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
export interface SpeechRecognitionEvent extends Event {
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
export type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
