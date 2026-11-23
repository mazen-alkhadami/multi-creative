import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogData";
import { BlogDetailView } from "@/sections/BlogDetailView";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${post.title.ar} | ${post.title.en} — MULTI CREATIVES`,
    description: post.summary.ar,
    openGraph: {
      title: `${post.title.ar} — MULTI CREATIVES`,
      description: post.summary.ar,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailView slug={slug} />;
}
