import { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicesData } from "@/data/servicesData";
import { getPublicServiceBySlug } from "@/lib/data/services";
import { ServiceDetailView } from "@/sections/ServiceDetailView";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicServiceBySlug(slug);
  const service = data?.service || servicesData.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title.ar} | ${service.title.en} — MULTI CREATIVES`,
    description: service.shortDescription.ar,
    openGraph: {
      title: `${service.title.ar} — MULTI CREATIVES`,
      description: service.shortDescription.ar,
      images: [service.gallery[0]?.image || "/images/logo-gold.png"],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const result = await getPublicServiceBySlug(slug);

  if (!result || !result.service) {
    notFound();
  }

  return (
    <ServiceDetailView
      slug={slug}
      service={result.service}
      prevService={result.prevService}
      nextService={result.nextService}
      relatedProjects={result.relatedProjects}
    />
  );
}
