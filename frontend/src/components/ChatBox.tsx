import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ChatBoxProps {
  from: string;
  message: string;
  image64?: string;
  index: number;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  from,
  message,
  image64,
}) => {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messageRef = useRef(message);
  const messageContentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messageRef.current = message;
    if (from === "bot") {
      setIsStreaming(true);
      setDisplayedMessage("");
      streamMessage();
    } else {
      setDisplayedMessage(message);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [from, message]);

  const streamMessage = () => {
    setDisplayedMessage((prev) => {
      if (prev.length < messageRef.current.length) {
        const nextChar = messageRef.current[prev.length];
        timeoutRef.current = setTimeout(() => {
          streamMessage();
        }, 80);
        return prev + nextChar;
      } else {
        setIsStreaming(false);
        return prev;
      }
    });
  };

  useEffect(() => {
    if (messageContentRef.current) {
      messageContentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <div className={`flex ${from === "bot" ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[75%] rounded-2xl p-3 ${
          from === "user"
            ? "bg-accent dark:bg-slate-700"
            : "bg-primary text-white dark:bg-primary-700"
        }`}
      >
        <p className="whitespace-pre-wrap break-words" ref={messageContentRef}>
          {displayedMessage}
          {isStreaming && <span className="animate-pulse">▋</span>}
        </p>
        {image64 && (
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src={`data:image/png;base64,${image64}`}
                alt="Chat Image"
                width={200}
                height={200}
                className="mt-2 cursor-pointer rounded-md"
              />
            </DialogTrigger>
            <DialogContent>
              <div className="flex justify-center">
                <Image
                  src={`data:image/png;base64,${image64}`}
                  alt="Chat Image"
                  width={500}
                  height={500}
                  className="rounded-md p-4"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
