"use client";

import { ArrowRight, Menu, MessageCircle, Send, X } from "lucide-react";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import ChatInterface from "~/components/ChatbotInterface";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { ThemeToggle } from "~/components/theme-toggle";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(200); // Small default size for the chatbot interface
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, inputMessage]);
      setInputMessage("");
    }
  };

  const onResize = useCallback((_, { size }) => {
    setChatWidth(size.width);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-primary">
      <header className="flex h-16 items-center justify-between px-4 text-white">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-wide">CopperLens</h1>
        </div>
        <p className="absolute left-1/2 hidden -translate-x-1/2 transform text-sm italic lg:block">
          &quot;Seeing through copper&quot;
        </p>
        <ThemeToggle />
      </header>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 overflow-hidden"
      >
        <ResizablePanel>
          <div className="flex-1 overflow-y-auto bg-yellow-50 p-4 dark:bg-slate-700">
            <h2 className="mb-4 text-xl font-semibold">Help us stay update!</h2>
            <Card className="mb-6 dark:bg-zinc-800">
              <CardContent className="p-4">
                <p className="mb-2 text-center">
                  Upload a file or drag and drop it here
                </p>
                <p className="mb-4 text-center text-sm text-gray-500">
                  OR with
                </p>
                <div className="flex">
                  <Input
                    placeholder="Paste link here"
                    className="mr-2 flex-1 dark:border-muted-foreground"
                  />
                  <Button size="icon">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <h2 className="mb-4 text-xl font-semibold">Latest News</h2>
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="mb-4 bg-accent text-black dark:border-none"
              >
                <CardContent className="flex items-center space-x-4 p-4">
                  <div className="flex-1">
                    <h3 className="mb-2 font-semibold">
                      Arizona Residents Fear What the State&apos;s Mining Boom
                      Will Do to Their Water
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        className="bg-primary text-white"
                      >
                        View Insight
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-secondary text-white"
                      >
                        Visit site
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        {isLargeScreen ? (
          <ResizablePanel defaultSize={20}>
            <ChatInterface
              chatMessages={chatMessages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
            />
          </ResizablePanel>
        ) : (
          <Popover open={isChatOpen} onOpenChange={setIsChatOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg border-none hover:text-primary"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0"
              side="top"
              align="end"
              alignOffset={-60}
            >
              <div className="h-[80vh]">
                <ChatInterface
                  chatMessages={chatMessages}
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  handleSendMessage={handleSendMessage}
                />
              </div>
            </PopoverContent>
          </Popover>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
