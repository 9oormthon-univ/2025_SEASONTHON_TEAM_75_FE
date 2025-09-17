import type { ChatMessage } from "@types";

type MessageWithId = { id?: unknown; messageId?: unknown };
type MessageWithText = { message?: string };
type PossiblyWidgetMessage = {
  widget?: unknown;
  payload?: unknown;
  props?: Record<string, unknown>;
};

export type MutableChatMessage = ChatMessage & {
  messageId?: string;
  message?: string;
  widget?: string;
  payload?: unknown;
  props?: Record<string, unknown>;
};

export const STT_MESSAGE_ID = "STT_MESSAGE_ID";

export const getMsgId = (m: ChatMessage): string | undefined => {
  const msg = m as MessageWithId;
  if (typeof msg.messageId === "string") return msg.messageId;
  if (typeof msg.id === "string") return msg.id;
  return undefined;
};

export const getMsgText = (m: ChatMessage): string | undefined =>
  (m as unknown as MessageWithText).message;

export function isPossiblyWidgetMessage(
  m: unknown
): m is PossiblyWidgetMessage & ChatMessage {
  return typeof m === "object" && m !== null;
}

export function stripWidget(m: ChatMessage): ChatMessage {
  const original = m as unknown as PossiblyWidgetMessage &
    Record<string, unknown>;
  const clone: Record<string, unknown> = { ...original };
  delete clone.widget;
  delete clone.payload;

  if ("props" in clone && typeof clone.props === "object" && clone.props) {
    const cp = { ...(clone.props as Record<string, unknown>) };
    delete cp.widget;
    delete cp.payload;
    clone.props = cp;
  }
  return clone as ChatMessage;
}
