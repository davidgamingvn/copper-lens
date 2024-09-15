import {
  Share,
  RefreshCw,
  Sparkles,
  SendHorizonal,
  Paperclip,
} from "lucide-react";
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
import { formatFileSize } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useStore } from "~/app/store";
import ChatBox from "./ChatBox";
import { useChatQuery } from "~/app/hooks/news";
import { type ChatMessage } from "../lib/index";

const ChatbotInterface: React.FC = () => {
  const { chatMessages, addMessage, clearMessages } = useStore();
  const [inputMessage, setInputMessage] = useState("");
  const { theme } = useTheme();
  const logo =
    theme === "dark"
      ? "/assets/brand/logoWhite.svg"
      : "/assets/brand/logoBlack.svg";
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatQuery = useChatQuery();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      addMessage({ from: "user", text: inputMessage } as ChatMessage);
      chatQuery.mutate(inputMessage);
      setInputMessage("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addMessage({
        text: `File uploaded: ${file.name} (${formatFileSize(file.size)})`,
      } as ChatMessage);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-800">
      <div className="mt-2 flex items-center justify-between p-2">
        <div className="flex items-center space-x-2">
          <h2 className="ml-2 text-lg font-semibold">LensBot</h2>
          <Sparkles className="h-6 w-6" />
        </div>
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
                <TooltipTrigger onClick={clearMessages}>
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
        <div className="flex flex-col space-y-4">
          {chatMessages.map((message, index) => (
            <ChatBox
              from={message.from}
              key={index}
              message={message.text}
              image64={message.image64}
              index={index}
              scrollRef={scrollRef}
            />
          ))}
          {chatQuery.isPending && (
            <ChatBox
              from="bot"
              message="Thinking..."
              index={chatMessages.length}
              scrollRef={scrollRef}
            />
          )}
          {chatQuery.isError && (
            <ChatBox
              from="bot"
              message="Error occurred. Please try again."
              index={chatMessages.length + 1}
              scrollRef={scrollRef}
            />
          )}
          <div ref={scrollRef} />
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:bg-background hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
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
