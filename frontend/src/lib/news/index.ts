export type NewsItem = {
  id: number;
  title: string;
  image: string;
  summary: string[];
};

export type Post = {
  id : number;
  type: string;
  url?: string;
  name: string;
  text: string[];
}