import Image from "next/image";
import React from "react";
import { usePreviewImage } from "~/app/hooks/news";
const ArticlePreview: React.FC<{ url: string }> = ({ url }) => {
  const { data: linkPreview, isLoading, isError } = usePreviewImage(url);

  if (isLoading) return <p>Loading preview...</p>;
  if (isError) return <p>Failed to load preview</p>;

  return (
    <div>
      {linkPreview && (
        <div>
          <Image
            src={linkPreview.image}
            alt="Link preview"
            width={300}
            height={300}
          />
          <h3>{linkPreview.title}</h3>
          <p>{linkPreview.description}</p>
        </div>
      )}
    </div>
  );
};

export default ArticlePreview;
