"use client";

import { StoriesInterface } from "@/utils/interfaces";
import React, { Fragment, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import StroriesContainer from "./stories-container";
// import { getStoriesLength } from "@/lib/Home/get-length";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import SiteFooter from "../ui/site-footer";
import LoadingSpinner from "./loading-spinner";
import { useParams } from "next/navigation";
// import { getLoadMoreStories } from "@/lib/global/get-load-more-stories";
import StoriesWrapperSkeleton from "./skeleton/stories-wrapper-skeleton";

const LoadMore = () => {
  const [stories, setStories] = useState<StoriesInterface[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(0);

  // Use Convex to get the stories length for the current category
  const { category } = useParams();
  const ifCategory = `${category ? category : ""}`;
  const storiesLength = useQuery(api.home.getStoriesLength, { category: ifCategory }) ?? 0;

  const { ref, inView } = useInView();

  // Use Convex to get paginated stories
  const loadMoreStories = async () => {
    // You should implement a Convex query for loading more stories (pagination)
    // Example: const newStories = useQuery(api.post.getLoadMoreStories, { skip: pagesLoaded, category: ifCategory });
    // For now, this is a placeholder for your Convex logic.
    // setStories((prevStories) => [...prevStories, ...newStories]);
    setPagesLoaded((prev) => prev + 1);
  };

  useEffect(() => {
    if (inView) {
      loadMoreStories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // Adjust these limits based on your Convex data shape
  const mainLimit = storiesLength && Math.floor(storiesLength / 2) - 1;

  return (
    <Fragment>
      {stories.map(({ mainThumb, sideThumb, feedThumb }) => (
        <StroriesContainer
          key={mainThumb[0].Slug}
          mainThumb={mainThumb}
          sideThumb={sideThumb}
          feedThumb={feedThumb!}
        />
      ))}

      {pagesLoaded !== mainLimit && pagesLoaded !== sideLimit ? (
        <div
          ref={ref}
          className="primary-container flex flex-row justify-center items-center h-[10rem]"
        >
          <LoadingSpinner />
        </div>
      ) : (
        <SiteFooter />
      )}
    </Fragment>
  );
};

export default LoadMore;
