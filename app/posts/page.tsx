"use client";

import ArticlesGrid from "@/components/Article/Article";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function PostsPage() {
  return (
    <>
      <Navbar />
      <ArticlesGrid />
      <Footer />
    </>
  );
}
