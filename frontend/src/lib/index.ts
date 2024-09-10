import { type NewsItem } from "./news";

export interface AppState {
  chatMessages: string[];
  news: NewsItem[];
  addMessage: (message: string) => void;
  setNews: (news: NewsItem[]) => void;
  clearMessages: () => void;
}
