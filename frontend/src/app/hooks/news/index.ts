import { useQuery } from "@tanstack/react-query";
import { type Post } from "~/lib/news";
import { BACKEND_URL } from "~/lib/utils";

export const fetchPosts = async () => {
  const response = await fetch(`${BACKEND_URL}/bullet_points`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const json = await response.json() as string
  
  const parsedJSON = JSON.parse(json) as { bullets: { id: number; name: string; text: string[] }[] };

  const data: Post[] = parsedJSON.bullets.map((bullet: Post) => ({
    id: bullet.id,
    name: bullet.name,
    text: bullet.text,
  }));
  return data;
}

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};