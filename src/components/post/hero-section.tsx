import LinkTree from "@/misc/logos/author/link-tree";
import Borgman from "@/misc/logos/borgman";
import In from "@/misc/logos/author/linkedin";
import X from "@/misc/logos/author/twitter";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LinkPostDataInterface, SinglePostInterface } from "@/utils/interfaces";
import { convertDate } from "@/lib/global";
import CopyPostLink from "../home/post-link-copy";
import { getSinglePost } from "@/lib/post";

const StoryHeroSection = async ({
  postLinkData,
}: {
  postLinkData: LinkPostDataInterface;
}) => {
  const { category, color, colorName, format, slug, params } = postLinkData;

  const postData = await getSinglePost(params[0], params[1], params[2]);

  if (!postData) {
    return null;
  }

  const {
    AuthorName,
    AuthorSlug,
    CreatedAt,
    ThumbDescription,
    ThumbImageDescription,
    Reads,
    Tag,
    ThumbTitle,
    ThumbImage,
  } = postData;

  return (
    <div
      style={{ backgroundColor: color }}
      className="relative w-full flex flex-row justify-center"
    >
      <div className="absolute top-0 w-full pb-[30px]">
        <Link
          href="/"
          aria-label="home button for borgman"
          title="borgman Home"
          className="z-[100] w-fit block"
        >
          <Borgman className="h-[50px] w-[270px] md:w-[645.6px] lg:w-[781.5px] md:h-[120px] lg:h-[145px] fill-white md:fill-white/50 pl-[9px]" />
        </Link>
      </div>

      <section className="pt-[70px] md:pt-[159px] lg:pt-[174px] px-[20px] md:px-0 max-w-[700px] lg:max-w-[1100px] w-full mx-auto flex flex-col pb-[30px] md:pb-[60px] lg:pb-[80px] lg:flex-row">
        <div className="lg:w-1/2 mb-[24px] lg:mb-0 lg:pr-[40px] h-auto flex flex-col text-black">
          <section className="mb-[18px] md:mb-[24px]">
            <div className="lg:px-0 leading-none mb-[8px]">
              <p className="font-mono uppercase inline text-[14.25px] font-bold tracking-[0.05em]">
                {Tag}
              </p>
            </div>
            <div className="mb-[8px]">
              <h1 className="pb-[8px] font-poly text-[45.5px] font-bold leading-[1.04] -tracking-[0.02em] lg:text-[66px] bg-repeating-lines-dark">
                {ThumbTitle}
              </h1>
            </div>
            <h2 className="font-gen word-spacing-single-post text-[21px] font-[450] leading-[1.1] lg:text-[24.9px]">
              {ThumbDescription}
            </h2>
          </section>
          <section>
            <p className="mb-[4px] font-gen text-[13px] font-medium leading-[1.25] text-[#131313]">
              By{" "}
              <span className="font-semibold hover:underline underline-offset-[1.5px] text-black">
                <Link
                  href={`/Author/${AuthorSlug}`}
                  aria-label={`Link to the Profile Page of Author : ${AuthorName}`}
                >
                  {AuthorName}
                </Link>
              </span>
            </p>
            <div className="flex flex-row space-x-[10px] mb-[13px]">
              <p className="font-gen text-[12.75px] font-medium leading-[1.3] text-black word-spacing-single-post">
                {convertDate(CreatedAt)}
              </p>
              <p className="font-gen text-[12.75px] font-medium leading-[1.3] text-black">
                {`${Reads} Reads`}
              </p>
            </div>
            <div className="flex flex-row space-x-[8px]">
              <CopyPostLink
                height="30px"
                width="30px"
                className="fill-black group-hover:fill-white"
                buttonClasses="group flex flex-row justify-center items-center transition-all ease-linear duration-100 rounded-full text-black bg-white hover:bg-black"
                text={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/Story/${category}/${format}/${slug}/${colorName}`}
              />
            </div>
          </section>
        </div>
        <div className="lg:w-1/2">
          <div className="w-full h-auto md:h-[700px] md:w-[700px] lg:w-[550px] lg:h-[550px] overflow-hidden">
            <Image
              src={ThumbImage}
              height={700}
              width={700}
              alt={ThumbImageDescription}
              className="object-cover object-center"
              priority
            />
          </div>
          <p className="pt-[6px] font-gen text-[14.5px] font-medium leading-[1.28] text-[#131313]/90">
            {ThumbImageDescription}
          </p>
        </div>
      </section>
    </div>
  );
};

export default StoryHeroSection;
