import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type AppState } from "~/lib";
import { type NewsItem, type Post } from "~/lib/news";

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      chatMessages: [],
      news: [],
      posts: [],
      addMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      setNews: (news: NewsItem[]) => set({ news }),
      setPosts: (posts: Post[]) => set({ posts }),
      clearMessages: () => set({ chatMessages: [] }),
      initializeNews: (news: NewsItem[]) => set({ news }),
      initializePosts: (posts: Post[]) => set({ posts }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);