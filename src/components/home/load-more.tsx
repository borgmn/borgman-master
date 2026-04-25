"use client";

import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import StroriesContainer from "./stories-container";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import SiteFooter from "../ui/site-footer";
import LoadingSpinner from "./loading-spinner";
import { StoriesInterface } from "@/utils/interfaces";

const LoadMore = () => {
  const [stories, setStories] = useState<StoriesInterface[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Use Convex to get the stories length for the current category
  const { category } = useParams();
  const categoryString = typeof category === "string" ? category : "";
  const storiesLength = useQuery(api.home.getStoriesLength, { category: categoryString }) ?? 0;

  const { ref, inView } = useInView();

  // Calculate limits
  const mainLimit = storiesLength ? Math.floor(storiesLength / 2) - 1 : 0;
  const sideLimit = storiesLength ? Math.floor(storiesLength / 3) : 0;

  useEffect(() => {
    const loadMoreStories = async () => {
      if (isLoading || pagesLoaded >= mainLimit) return;
      
      setIsLoading(true);
      try {
        // Fetch using the Convex API directly
        const response = await fetch(`/api/stories?skip=${pagesLoaded}&category=${categoryString}`);
        if (response.ok) {
          const newStories = await response.json();
          if (newStories) {
            setStories((prevStories) => [...prevStories, newStories]);
            setPagesLoaded((prev) => prev + 1);
          }
        }
      } catch (error) {
        console.error("Error loading more stories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (inView) {
      loadMoreStories();
    }
  }, [inView, pagesLoaded, mainLimit, categoryString, isLoading]);

  const hasMoreStories = pagesLoaded < mainLimit && pagesLoaded < sideLimit;

  return (
    <Fragment>
      {stories.map(({ mainThumb, sideThumb, feedThumb }, index) => (
        <StroriesContainer
          key={mainThumb[0]?.Slug || `story-${index}`}
          mainThumb={mainThumb}
          sideThumb={sideThumb}
          feedThumb={feedThumb!}
        />
      ))}

      {hasMoreStories ? (
        <div
          ref={ref}
          className="primary-container flex flex-row justify-center items-center h-[10rem]"
        >
          {isLoading && <LoadingSpinner />}
        </div>
      ) : (
        <SiteFooter />
      )}
    </Fragment>
  );
};

export default LoadMore;
