import type { MetadataRoute } from "next";

const publicRoutes = [
  "",
  "/donation",
  "/events",
  "/pages/contact",
  "/privacy",
  "/terms",
  "/refund",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://antuf.org";

  return publicRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}