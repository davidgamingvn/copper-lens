import Image from "next/image";
import React from "react";
import { usePreviewImage } from "~/app/hooks/news";
import {
  Card,
  CardDescription,
  CardHeader,
} from "./ui/card";

const ArticlePreview: React.FC<{ url: string }> = ({ url }) => {
  const { data: linkPreview, isLoading, isError } = usePreviewImage(url);

  if (isLoading) return <p>Loading preview...</p>;
  if (isError) return <p>Failed to load preview</p>;

  return (
    <Card className="flex w-[350px] rounded-lg">
      {linkPreview && (
        <>
          <CardHeader>
            <CardDescription>{linkPreview.description}</CardDescription>
            <CardDescription>
              <Image
                src={linkPreview.image}
                alt="Article preview image"
                width={1200} // Adjust the width as needed
                height={1200} // Adjust the height as needed
                className="object-contain"
              />
            </CardDescription>
          </CardHeader>
        </>
      )}
    </Card>
  );
};

export default ArticlePreview;