import { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolioData } from "@/data/portfolioData";
import { getPublicProjectBySlug } from "@/lib/data/projects";
import { PortfolioDetailView } from "@/sections/PortfolioDetailView";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return portfolioData.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicProjectBySlug(slug);

  if (!item) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${item.title.ar} | ${item.title.en} — MULTI CREATIVES`,
    description: item.summary.ar,
    openGraph: {
      title: `${item.title.ar} — MULTI CREATIVES`,
      description: item.summary.ar,
      images: [item.coverImage],
    },
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublicProjectBySlug(slug);

  if (!item) {
    notFound();
  }

  return <PortfolioDetailView slug={slug} project={item} />;
}
