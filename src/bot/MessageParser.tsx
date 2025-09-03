import React from "react";
import type { Actions } from "./ActionProvider";

type ParserChildProps = {
  parse: (message: string) => void;
  actions: Actions;
};

type MessageParserProps = {
  children: React.ReactNode;
  actions: Actions;
};

const MessageParser: React.FC<MessageParserProps> = ({ children, actions }) => {
  const parse = (message: string) => {
    console.log(message.trim());
  };

  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<Partial<ParserChildProps>>,
              { parse, actions }
            )
          : child
      )}
    </>
  );
};

export default MessageParser;
