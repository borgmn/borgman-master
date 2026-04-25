import React from "react";
import StoryCard from "./story-card";
import { TopStoryInterface, Category } from "@/utils/interfaces";
import { getTopStories, getTopStoriesForCategory } from "@/lib/home";

const TopStories = async ({ StoryCategory }: { StoryCategory?: Category }) => {
  const topStories: TopStoryInterface[] = !StoryCategory
    ? await getTopStories()
    : await getTopStoriesForCategory(StoryCategory);

  let number = 0;

  return (
    <ol className="flex flex-col">
      {topStories.map(
        ({
          Author,
          CreatedAt,
          Slug,
          ThumbImage,
          ThumbImageDescription,
          ThumbTitle,
          Tag,
          BackgroundColor,
          Category,
        }) => {
          number++;

          return (
            <StoryCard
              key={Slug}
              number={number}
              Author={Author}
              CreatedAt={CreatedAt}
              Slug={Slug}
              ThumbImage={ThumbImage}
              ThumbImageDescription={ThumbImageDescription}
              ThumbTitle={ThumbTitle}
              Tag={Tag}
              BackgroundColor={BackgroundColor}
              Category={Category}
            />
          );
        }
      )}
    </ol>
  );
};

export default TopStories;
