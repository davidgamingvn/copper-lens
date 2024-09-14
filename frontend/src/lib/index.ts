import { type NewsItem } from "./news";
import { type Post } from "./news";

export interface AppState {
  chatMessages: string[];
  news: NewsItem[];
  posts: Post[];
  addMessage: (message: string) => void;
  setNews: (news: NewsItem[]) => void;
  setPosts: (posts: Post[]) => void;
  clearMessages: () => void;
  initializeNews: (news: NewsItem[]) => void;
  initializePosts: (posts: Post[]) => void;
}
