import { type NewsItem } from "./news";
import { type Post } from "./news";

export interface ChatMessage {
  from : "user" | "bot";
  text: string;
  image64?: string;
}

export interface AppState {
  chatMessages: ChatMessage[];
  news: NewsItem[];
  posts: Post[];
  addMessage: (message: ChatMessage) => void;
  setNews: (news: NewsItem[]) => void;
  setPosts: (posts: Post[]) => void;
  clearMessages: () => void;
  initializeNews: (news: NewsItem[]) => void;
  initializePosts: (posts: Post[]) => void;
}
