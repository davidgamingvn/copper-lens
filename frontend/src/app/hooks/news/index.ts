import { useQuery } from "@tanstack/react-query";
import { type Post } from "~/lib/news";

const fetchPosts = async () : Promise<Post[]> => {
  const response = await fetch("http://localhost:5000/bullet_points");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.map((item: { id: number, name: string; text: string }) => ({
    id : item.id,
    name: item.name,
    text: item.text,
  })) as Post[];
}

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};