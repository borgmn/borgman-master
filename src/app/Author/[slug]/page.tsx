import { Fragment, Suspense } from "react";
import Borgman from "@/misc/logos/borgman";
import Link from "next/link";
import AuthorIntro from "@/components/author/author-intro";
import AuthorIntroSkeleton from "@/components/author/skeleton/author-intro-skeleton";
import AuthorStories from "@/components/author/author-stories";
import AuthorStroySkeleton from "@/components/author/skeleton/author-story-skeleton";
import SiteFooter from "@/components/ui/site-footer";
import { getAllAuthors } from "@/lib/author/get-all-authors";
import { constructMetadata } from "@/lib/global/metadata-constructor";
import { Metadata, ResolvingMetadata } from "next";
import { getAuthorProfile } from "@/lib/author/get-author-profiles";
import { AuthorProfileInterface } from "@/utils/interfaces";
import { Viewport } from "next";

export async function generateStaticParams() {
  const authors = await getAllAuthors();

  return authors.map(({ Slug }: { Slug: string }) => ({
    author: Slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { author: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const author = await getAuthorProfile(params.author);
  const { Name, Designation }: AuthorProfileInterface = author.AuthorProfile;

  const metadata = constructMetadata({
    title: `${Name} - Author's borgman`,
    description: `Meet ${Name}, ${Designation}, one of our talented author behind borgman. Explore ${
      Name.split(" ")[0]
    }'s diverse perspectives and contributions to borgman.`,
    imgTitle: `Meet ${Name}, ${Designation}, one of our talented author behind borgman.`,
    imgDesc: `Explore ${
      Name.split(" ")[0]
    }'s diverse perspectives and contributions to borgman.`,
    imgUrl:
      "https://cdn.sanity.io/images/aftdl3p2/production/87387d5bdc7235f33c05a4e5e4ec60602248a6bb-1200x630.jpg",
    site: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/Author/${Name.split(" ").join(
      ""
    )}`,
    // theme: '#5200ff'
  });

  return metadata;
}

export const viewport: Viewport = {
  themeColor: "#5200ff",
};

const Author = async ({ params }: { params: { author: string } }) => {
  return (
    <Fragment>
      <section className="relative pt-[60px] md:pt-[150px] lg:pt-[174px] z-30">
        <div className="absolute top-0 bg-purple-100 w-full pb-[30px]">
          <Link
            href="/"
            aria-label="home button for borgman"
            title="borgman Home"
          >
            <Borgman className="fill-purple-400 z-40 pl-[9px] h-[50px] w-[270px] md:w-[645.6px] lg:w-[781.5px] md:h-[120px] lg:h-[145px]" />
          </Link>
        </div>

        <section className="w-full flex flex-center justify-center">
          <div className="w-full">
            <Suspense fallback={<AuthorIntroSkeleton />}>
              <AuthorIntro author={params.author} />
            </Suspense>
          </div>
        </section>

        <section className="w-full pt-[28px] lg:pt-[40px] flex flex-row justify-center">
          <div className="max-w-[1100px] mx-[10px] lg:m-0 w-full">
            <Suspense fallback={<AuthorStroySkeleton />}>
              <AuthorStories author={params.author} />
            </Suspense>
          </div>
        </section>
      </section>
      <SiteFooter />
    </Fragment>
  );
};

export default Author;
