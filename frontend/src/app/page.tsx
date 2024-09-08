"use client";

import { Menu, MessageCircle, Send, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

export default function Home() {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, inputMessage]);
      setInputMessage("");
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-4 hover:bg-primary-foreground hover:text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <nav className="flex flex-col space-y-4 pt-6">
              <Link href="#" className="text-lg font-semibold">
                Dashboard
              </Link>
              <Link href="#" className="text-lg font-semibold">
                Articles
              </Link>
              <Link href="#" className="text-lg font-semibold">
                Pages
              </Link>
              <Link href="#" className="text-lg font-semibold">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-2xl font-bold">Home</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* TODO: Add content to the grid layout */}
        </div>
      </main>
      <Popover open={isChatOpen} onOpenChange={setIsChatOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg hover:text-white"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Open chat</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0"
          side="top"
          align="end"
          alignOffset={-60}
          sideOffset={20}
        >
          <div className="flex h-[calc(100vh-10rem)] flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">Chatbot</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-accent-foreground hover:text-white"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close chat</span>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {chatMessages.map((message, index) => (
                <div key={index} className="mb-2 rounded bg-muted p-2">
                  {message}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button type="submit" size="icon" className="hover:bg-accent-foreground hover:text-white">
                  <Send className="h-4 w-4 text-white" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
