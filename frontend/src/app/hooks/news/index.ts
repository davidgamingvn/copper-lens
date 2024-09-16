import { useQuery, useMutation } from "@tanstack/react-query";
import { type Post } from "~/lib/news";
import { fetchChatMessages, fetchPosts, fetchLinkPreview, uploadFile, downloadFile, uploadArticle } from "~/app/api";
import { useStore } from "~/app/store";

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};

export const usePreviewImage = (url: string) => {
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
      addMessage({ from: "bot", text: data.answer, image64: data.image64 ?? undefined });
    },
    onError: (error) => {
      console.error("Error fetching chat messages:", error);
    },
  });
}

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file: File) => uploadFile(file),
    onSuccess: (data) => {
      console.log("File uploaded successfully:", data);
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
    }
  });
}

export const useUploadArticle = () => {
  return useMutation({
    mutationFn: (url: string) => uploadArticle(url),
    onSuccess: (data) => {
      console.log("Article uploaded successfully:", data);
    },
    onError: (error) => {
      console.error("Error uploading article:", error);
    }
  });
}

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: ({ filename }: { filename: string }) => downloadFile(filename),
    onSuccess: (data) => {
      console.log("File downloaded successfully:", data);
    },
    onError: (error) => {
      console.error("Error downloading file:", error);
    }
  });
}