import axios from "axios";
import { type Post } from "~/lib/news";
import { BACKEND_URL, LINK_PREVIEW_API } from "~/lib/utils";

export const fetchPosts = async () => {
  const response = await fetch(`${BACKEND_URL}/bullet_points`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const json = await response.json() as string

  const parsedJSON = JSON.parse(json) as { bullets: { id: number; name: string; type: string, url?: string, text: string[] }[] };

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
      image64?: string;
    };
    image64?: string;
    relevant_image?: {
      caption: string;
      filename: string;
    };
    question: string;
  };

  const data = {
    question: json.question,
    answer: json.answer.answer,
    image64: json.answer.image64 ?? null,
    relevant_image: json.relevant_image ?? null,
  };

  return data;
}

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file, file.name);

  try {
    const response = await axios.post(`${BACKEND_URL}/upload_file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/pdf',
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error uploading file: ${error.response?.status} - ${error.response?.data}`);
    }
  }
};

export const uploadArticle = async (url: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/scrape_web`, { url });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error uploading article: ${error.response?.status} - ${error.response?.data}`);
    }
  }
}

export const downloadFile = async (filename: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/get_pdf?filename=${filename}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const blob = await response.blob();
    const urll = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urll;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
};

export const fetchLinkPreview = async (url: string) => {
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