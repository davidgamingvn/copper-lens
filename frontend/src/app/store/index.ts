import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mockNews } from "~/lib/mocks";
import { type AppState } from "~/lib";

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      chatMessages: [],
      news: mockNews,
      addMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      setNews: (news) => set({ news }),
      clearMessages: () => set({ chatMessages: [] }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
