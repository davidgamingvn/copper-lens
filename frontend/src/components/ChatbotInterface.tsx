import { Share, RefreshCw, ArrowRight, SendHorizonal } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTheme } from "next-themes";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import { useEffect, useRef } from "react";

interface ChatInterfaceProps {
  chatMessages: string[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

const ChatbotInterface: React.FC<ChatInterfaceProps> = ({
  chatMessages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
}) => {
  const { theme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-800">
      <div className="flex items-center justify-between border-b p-4 mt-2">
        <h2 className="text-lg font-semibold">Chatbot</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Share className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-transparent p-2 text-foreground">
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <RefreshCw className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-transparent p-2 text-foreground">
                  <p>Refresh</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="rounded-lg bg-accent p-3 dark:bg-slate-700">
            <p className="font-medium">
              What&apos;s the recent updates about the water consumption in az
              mining industry
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                AI
              </div>
              <div className="flex-1">
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong>Increased focus on water conservation:</strong>{" "}
                    Arizona&apos;s mining industry prioritizes water efficiency.
                  </li>
                  <li>
                    <strong>Technological advancements:</strong> New
                    technologies reduce water consumption.
                  </li>
                  <li>
                    <strong>Regulatory measures:</strong> State regulations
                    ensure sustainable water use.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`rounded-lg p-3 ${
                index % 2 === 0
                  ? "self-start bg-accent dark:bg-slate-700"
                  : "ml-auto self-end bg-primary text-white"
              }`}
              style={{ maxWidth: "75%" }}
              ref={scrollRef}
            >
              {message}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter a prompt here"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <SendHorizonal className="h-4 w-4 text-white" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotInterface;
