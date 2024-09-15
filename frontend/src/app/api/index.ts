import axios from "axios";
import { type Post } from "~/lib/news";
import { BACKEND_URL, LINK_PREVIEW_API } from "~/lib/utils";

export const fetchPosts = async () => {
  const response = await fetch(`${BACKEND_URL}/bullet_points`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const json = await response.json() as string

  const parsedJSON = JSON.parse(json) as { bullets: { id: number; name: string; type: string, url?: string,  text: string[] }[] };

  const data: Post[] = parsedJSON.bullets.map((bullet: Post) => ({
    id: bullet.id,
    type: bullet.type,
    name: bullet.name,
    url: bullet.url,
    text: bullet.text.map((textItem) => textItem.replace(/^- /, "")),
  }));
  return data;
}

export const fetchChatMessages = async (question: string) => {
  const response = await axios.post(`${BACKEND_URL}/ask_question`, { question });

  const json = response.data as {
    answer: {
      answer: string;
      image64: string;
    };
    image64: string;
    relevant_image: {
      caption: string;
      filename: string;
    };
    question: string;
  };

  const data = {
    question: json.question,
    answer: json.answer.answer,
    image64: json.answer.image64,
    relevant_image: json.relevant_image,
  };

  return data;
}

export const fetchLinkPreview = async (url : string) => {
  const response = await fetch(`https://api.linkpreview.net/?q=${url}`, {
    headers: {
      "X-Linkpreview-Api-Key": LINK_PREVIEW_API,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch link preview");
  }
  const result = await response.json() as { title: string, description: string, image: string; };
  return result;
}