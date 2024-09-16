"use client";

import { ArrowRight, MessageCircle, ChevronUp, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import ChatInterface from "~/components/ChatbotInterface";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { ThemeToggle } from "~/components/theme-toggle";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useToast } from "~/hooks/use-toast";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "~/components/ui/hover-card";
import {
  Alert,
} from "~/components/ui/alert"
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useStore } from "./store";
import { usePosts, useUploadFile, useDownloadFile, useUploadArticle } from "./hooks/news";
import ArticlePreview from "~/components/ArticlePreview";

export default function Home() {
  const { posts, initializePosts } = useStore();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });
  const [expandedNewsId, setExpandedNewsId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
    const [articleUrl, setArticleUrl] = useState("");


  const {
    data: fetchedPosts,
    isLoading: isLoadingPosts,
  } = usePosts();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (fetchedPosts) {
      initializePosts(fetchedPosts);
    }
  }, [fetchedPosts, initializePosts]);

  const { mutate: uploadFile, isPending: uploadFilePending, isError: uploadFileError } = useUploadFile();
  const { mutate: uploadArticle, isPending: uploadArticlePending, isError: uploadArticleError } = useUploadArticle();
  const { mutate: downloadFile } = useDownloadFile();
  const { toast } = useToast()


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      uploadFile(file, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `File uploaded successfully: ${file.name}`,
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to upload file: ${error.message}`,
          });
        },
      });
    }
  };


  const handleArticleUpload = () => {
    uploadArticle(articleUrl, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: `Article uploaded successfully: ${articleUrl}`,
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to upload article: ${error.message}`,
        });
      },
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      uploadFile(file, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `File uploaded successfully: ${file.name}`,
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to upload file: ${error.message}`,
          });
        },
      });
    }
  };

  const toggleNewsExpansion = (id: number) => {
    setExpandedNewsId(expandedNewsId === id ? null : id);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-primary">
      <header className="flex h-16 items-center justify-between px-4 text-white">
        <div className="flex items-center space-x-2">
          <Image
            src="/assets/brand/logoWhite.svg"
            alt="logo"
            width={30}
            height={30}
          />
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
          <div className="scrollbar-hide h-full flex-1 overflow-y-auto bg-yellow-50 p-4 dark:bg-slate-700">
            <h2 className="mb-4 text-xl font-semibold">Help us stay update!</h2>
            <Card className="mb-6 dark:bg-zinc-800">
              <CardContent className="p-4">
                <div
                  className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, TXT up to 10MB
                      </p>
                    </div>
                  </Label>
                </div>
                {uploadFilePending && (
                  <div className="flex justify-center mt-2 gap-2">
                    <Spinner size="small" />
                    <p> Uploading... </p>
                  </div>
                )}
                {uploadFileError && (
                  <Alert variant="destructive" className="mt-2 text-lg text-red">
                    {uploadFileError}
                  </Alert>
                )}
                {uploadedFile && !uploadFilePending && !uploadFileError && (
                  <p className="mt-2 text-sm text-gray-500">
                    Uploaded file: {uploadedFile.name}
                  </p>
                )}
                <p className="mb-2 mt-4 text-center text-sm text-gray-500">
                  OR with
                </p>
                <div className="flex">
                  <Input
                    placeholder="Paste link here"
                    className="mr-2 flex-1 dark:border-muted-foreground"
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                  />
                  <Button size="icon" onClick={handleArticleUpload}>
                    <ArrowRight className="h-4 w-4 text-white" />
                  </Button>
                </div>
                {uploadArticlePending && (
                  <div className="flex justify-center mt-2 gap-2">
                    <Spinner size="small" />
                    <p> Uploading article... </p>
                  </div>
                )}
                {uploadArticleError && (
                  <Alert variant="destructive" className="mt-2 text-lg text-red">
                    {uploadArticleError}
                  </Alert>
                )}
              </CardContent>
            </Card>
            <h2 className="mb-4 text-xl font-semibold">Latest News</h2>
            <ScrollArea className="h-[50rem] w-full">
              {isLoadingPosts ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner
                    size="large"
                    className="text-primary dark:text-accent"
                  />
                  <Label className="ml-2">Loading...</Label>
                </div>
              ) : (
                posts.map((item) => (
                  <Card key={item.id} className="mb-4 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center space-x-4 bg-accent p-4">
                        <div className="flex-1">
                          <h3 className="mb-2 font-semibold text-black">
                            {item.name}
                          </h3>

                          <div className="flex space-x-2">
                            <Button
                              variant="secondary"
                              className="bg-primary text-white"
                              onClick={() => toggleNewsExpansion(item.id)}
                            >
                              {expandedNewsId === item.id
                                ? "Hide Insight"
                                : "View Insight"}
                            </Button>
                            {item.type === "article" && item.url && (
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    className="bg-secondary text-white"
                                    onClick={() => window.open(item.url, "_blank")}
                                  >
                                    Visit site
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="bg-transparent border-none shadow-none">
                                  <ArticlePreview url={item.url} />
                                </HoverCardContent>
                              </HoverCard>
                            )}
                            {item.type === "pdf" && (
                              <Button
                                variant="secondary"
                                className="bg-secondary text-white"
                                onClick={() => downloadFile({ filename: item.name })}
                              >
                                Download document
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`overflow-hidden bg-white transition-all duration-300 ease-in-out dark:bg-zinc-800 ${expandedNewsId === item.id
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                          }`}
                      >
                        <div className="p-4">
                          <ul className="list-disc space-y-2 pl-5">
                            {item.text.map((point, index) => (
                              <li key={index}>
                                <ReactMarkdown>
                                  {point}
                                </ReactMarkdown></li>
                            ))}
                          </ul>
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              className="mr-2 flex items-center justify-center gap-1 hover:text-primary"
                              onClick={() => toggleNewsExpansion(item.id)}
                            >
                              <ChevronUp />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle className="border-none" />
        {isLargeScreen ? (
          <ResizablePanel defaultSize={25} minSize={20} className="shadow-md">
            <ChatInterface />
          </ResizablePanel>
        ) : (
          <Popover open={isChatOpen} onOpenChange={setIsChatOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="fixed bottom-4 right-4 h-14 w-14 rounded-full border-none shadow-lg hover:text-primary"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" side="top" align="end">
              <div className="h-[80vh]">
                <ChatInterface />
              </div>
            </PopoverContent>
          </Popover>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
