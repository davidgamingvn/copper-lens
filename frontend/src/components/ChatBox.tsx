import React from "react";

interface ChatBoxProps {
  message: string;
  index: number;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ message, index, scrollRef }) => {
  return (
    <div
      className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[75%] rounded-2xl p-3 ${
          index % 2 === 0
            ? "bg-accent dark:bg-slate-700"
            : "bg-primary text-white dark:bg-primary-700"
        }`}
        ref={scrollRef}
      >
        <p className="break-words">{message}</p>
      </div>
    </div>
  );
};

export default ChatBox;
