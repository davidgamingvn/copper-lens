import { useQuery, useMutation } from "@tanstack/react-query";
import { type Post } from "~/lib/news";
import { fetchChatMessages, fetchPosts, fetchLinkPreview } from "~/app/api";
import { useStore } from "~/app/store";

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};

export const usePreviewImage = (url : string) => {
  return useQuery({
    queryKey: ["linkPreview", url],
    queryFn: () => fetchLinkPreview(url),
    enabled: !!url,
  });
}

export const useChatQuery = () => {
  const { addMessage } = useStore();

  return useMutation({
    mutationFn: fetchChatMessages,
    onSuccess: (data) => {
      addMessage({ from: "bot", text: data.answer, image64: data.image64 });
    },
    onError: (error) => {
      console.error("Error fetching chat messages:", error);
    },
  });
}