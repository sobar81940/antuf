import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";
import SubCategory from "@/models/subcategory";

export async function GET(request) {
  await dbConnect();
  
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get('title') || '';
    const category = url.searchParams.get('category') || '';
    const currentSlug = url.searchParams.get('slug') || '';

    // Build the query
    const query: Record<string, any> = {
      slug: { $ne: currentSlug } // Exclude the current article
    };

    if (category) {
      query.category = category; // Match articles from the same category if provided
    }

    // Find similar articles using text search if title is provided
    if (title) {
      query.$text = { $search: title }; // This requires a text index on relevant fields
    }

    // Fetch articles with the query
    const articles = await Articles.find(query)
      .select('title slug content category createdAt') // Select only needed fields
      .sort(title ? { score: { $meta: "textScore" } } : { createdAt: -1 }) // Sort by relevance if title search is used
      .limit(5); // Limit to 5 articles

    // If not enough articles found with text search, supplement with recent articles
    if (articles.length < 2) {
      const recentArticles = await Articles.find({
        slug: { $ne: currentSlug },
        ...(category && { category })
      })
        .select('title slug content category createdAt')
        .sort({ createdAt: -1 })
        .limit(5 - articles.length);

      articles.push(...recentArticles);
    }

    // Process articles to include only necessary data and truncate content
    const processedArticles = articles.map(article => ({
      title: article.title,
      slug: article.slug,
      description: article.content?.substring(0, 150) + '...',
      category: article.category
    }));

    return NextResponse.json({
      articles: processedArticles
    });

  } catch (err) {
    console.error('Error fetching similar articles:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
