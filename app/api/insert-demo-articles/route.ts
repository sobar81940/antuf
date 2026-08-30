import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";
import SubCategory from "@/models/subcategory";

const demoArticles = [
  {
    title: 'भ्रष्टाचार अन्त्य गर्ने र युवाको भावना अनुसार अघि बढ्ने शक्ति माओवादी नै हो',
    slug: 'bhrashtaachar-antya-garne-ra-yuwako-bhawana-anusar-aghi-badhne-shakti-maowadii-nai-ho',
    subtitle: 'संयोजक प्रचण्डको विचार',
    excerpt: 'माओवादी केन्द्रका संयोजक प्रचण्डले भ्रष्टाचार विरुद्धको लडाईमा युवाहरुको भूमिका महत्वपूर्ण रहेको बताउनुभएको छ।',
    content: `काठमाडौं, पुस २२ । नेकपा माओवादी केन्द्रका संयोजक पुष्पकमल दाहाल प्रचण्डले भ्रष्टाचार अन्त्य गर्ने र युवाको भावना अनुसार अघि बढ्ने शक्ति माओवादी नै रहेको बताउनुभएको छ।`,
    featureImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    imageAlt: 'माओवादी संयोजक प्रचण्ड',
    metaTitle: 'भ्रष्टाचार अन्त्य र युवाको भावना - प्रचण्ड',
    metaDescription: 'माओवादी संयोजक प्रचण्डले भ्रष्टाचार अन्त्य गर्ने र युवाको भावना अनुसार अघि बढ्ने शक्ति माओवादी नै हो भन्नुभयो।',
    metaKeywords: ['प्रचण्ड', 'माओवादी', 'भ्रष्टाचार', 'युवा'],
    status: 'published',
    difficulty: 'beginner',
    contentLanguage: 'ne',
    tags: ['राजनीति', 'समाचार', 'युवा'],
    isFeatured: true
  },
  {
    title: 'नेपालमा शिक्षाको अवस्था र सुधारका उपायहरू',
    slug: 'nepalma-shikchhako-awastha-ra-sudharaka-upaayaharu',
    subtitle: 'शैक्षिक प्रणालीमा सुधारको आवश्यकता',
    excerpt: 'नेपालको शिक्षा क्षेत्रमा विभिन्न चुनौतीहरू रहेका छन्। गुणस्तरीय शिक्षाका लागि सुधार आवश्यक छ।',
    content: `काठमाडौं । नेपालको शिक्षा प्रणालीमा महत्वपूर्ण सुधारको आवश्यकता रहेको विशेषज्ञहरूले बताएका छन्।`,
    featureImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    imageAlt: 'नेपालको शिक्षा प्रणाली',
    metaTitle: 'नेपालमा शिक्षाको अवस्था र सुधारका उपाय',
    metaDescription: 'नेपालको शिक्षा क्षेत्रमा रहेका चुनौतीहरू र गुणस्तरीय शिक्षाका लागि आवश्यक सुधारका उपायहरू।',
    metaKeywords: ['शिक्षा', 'नेपाल', 'सुधार', 'गुणस्तर'],
    status: 'published',
    difficulty: 'intermediate',
    contentLanguage: 'ne',
    tags: ['शिक्षा', 'समाज'],
    isFeatured: false
  },
  {
    title: 'किसानहरूको समस्या र समाधान',
    slug: 'kisanaharu-ko-samasya-ra-samadhan',
    subtitle: 'कृषि क्षेत्रमा सुधारको आवश्यकता',
    excerpt: 'नेपाली किसानहरूले सामना गर्नुपरेका समस्याहरू र तिनको दिगो समाधानका उपायहरू।',
    content: `काठमाडौं । नेपाली किसानहरूले विभिन्न समस्याहरूको सामना गरिरहेका छन्।`,
    featureImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    imageAlt: 'नेपाली किसान',
    metaTitle: 'किसानहरूको समस्या र समाधान',
    metaDescription: 'नेपाली किसानहरूले सामना गर्नुपरेका समस्याहरू र दिगो समाधानका उपायहरूको विवरण।',
    metaKeywords: ['किसान', 'कृषि', 'समस्या', 'समाधान'],
    status: 'published',
    difficulty: 'beginner',
    contentLanguage: 'ne',
    tags: ['कृषि', 'किसान', 'अर्थतन्त्र'],
    isFeatured: false
  },
  {
    title: 'श्रमिक अधिकार र सामाजिक सुरक्षा',
    slug: 'shramik-adhikaar-ra-samajik-surakchha',
    subtitle: 'श्रमिकहरूको हक र हितको संरक्षण',
    excerpt: 'नेपालमा श्रमिकहरूको अधिकार र सामाजिक सुरक्षाको अवस्था तथा सुधारका उपायहरू।',
    content: `काठमाडौं । नेपालमा श्रमिकहरूको अधिकार र सामाजिक सुरक्षाको विषय महत्वपूर्ण भएको छ।`,
    featureImage: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800',
    imageAlt: 'श्रमिक अधिकार',
    metaTitle: 'श्रमिक अधिकार र सामाजिक सुरक्षा',
    metaDescription: 'नेपालमा श्रमिकहरूको अधिकार, सामाजिक सुरक्षा र सुधारका उपायहरूको विस्तृत जानकारी।',
    metaKeywords: ['श्रमिक', 'अधिकार', 'सामाजिक सुरक्षा', 'ट्रेड युनियन'],
    status: 'published',
    difficulty: 'intermediate',
    contentLanguage: 'ne',
    tags: ['श्रमिक', 'अधिकार', 'समाज'],
    isFeatured: true
  },
  {
    title: 'युवा रोजगारी र उद्यमशीलता विकास',
    slug: 'yuwa-rojgaarii-ra-udyamshiilta-vikas',
    subtitle: 'युवाहरूका लागि अवसर सिर्जना',
    excerpt: 'नेपालमा युवा रोजगारी र उद्यमशीलता विकासका चुनौती र अवसरहरू।',
    content: `काठमाडौं । नेपालमा युवा रोजगारी र उद्यमशीलता विकास महत्वपूर्ण विषय बनेको छ।`,
    featureImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    imageAlt: 'युवा उद्यमी',
    metaTitle: 'युवा रोजगारी र उद्यमशीलता विकास',
    metaDescription: 'नेपालमा युवा रोजगारी र उद्यमशीलता विकासका चुनौती, अवसर र समाधानका उपायहरू।',
    metaKeywords: ['युवा', 'रोजगारी', 'उद्यमशीलता', 'विकास'],
    status: 'published',
    difficulty: 'beginner',
    contentLanguage: 'ne',
    tags: ['युवा', 'रोजगारी', 'उद्यमशीलता'],
    isFeatured: false
  }
];

export async function GET(req) {
  try {
    await dbConnect();

    // Get a valid category
    const category = await SubCategory.findOne({});
    if (!category) {
      return NextResponse.json(
        { error: "No category found. Please create a category first." },
        { status: 400 }
      );
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const articleData of demoArticles) {
      try {
        const newArticle = await Articles.create({
          ...articleData,
          category: category._id,
          authorName: 'ANTUF Admin',
          sections: [],
          publishedAt: new Date(),
          viewCount: Math.floor(Math.random() * 1000),
          likeCount: Math.floor(Math.random() * 100),
          shareCount: Math.floor(Math.random() * 50),
          commentCount: 0,
          allowComments: true,
          isPinned: false,
          readTime: Math.floor(Math.random() * 10) + 3,
          contributors: []
        });

        results.push({
          success: true,
          title: articleData.title,
          id: newArticle._id
        });
        successCount++;
      } catch (error) {
        results.push({
          success: false,
          title: articleData.title,
          error: error.message
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      message: `Demo data insertion complete`,
      summary: {
        total: demoArticles.length,
        success: successCount,
        failed: errorCount
      },
      results
    });
  } catch (error) {
    console.error("Error inserting demo data:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
