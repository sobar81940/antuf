// Insert 5 demo Nepali articles
import mongoose from "mongoose";
require("dotenv").config();

const demoArticles = [
  {
    title: 'भ्रष्टाचार अन्त्य गर्ने र युवाको भावना अनुसार अघि बढ्ने शक्ति माओवादी नै हो',
    slug: 'bhrashtaachar-antya-garne-ra-yuwako-bhawana-anusar-aghi-badhne-shakti-maowadii-nai-ho',
    subtitle: 'संयोजक प्रचण्डको विचार',
    excerpt: 'माओवादी केन्द्रका संयोजक प्रचण्डले भ्रष्टाचार विरुद्धको लडाईमा युवाहरुको भूमिका महत्वपूर्ण रहेको बताउनुभएको छ।',
    content: `काठमाडौं, पुस २२ । नेकपा माओवादी केन्द्रका संयोजक पुष्पकमल दाहाल प्रचण्डले भ्रष्टाचार अन्त्य गर्ने र युवाको भावना अनुसार अघि बढ्ने शक्ति माओवादी नै रहेको बताउनुभएको छ।

आइतबार राजधानीमा आयोजित कार्यक्रममा बोल्दै संयोजक प्रचण्डले युवाहरुको आन्दोलनलाई सकारात्मक रुपमा लिनुपर्ने बताउनुभयो। उहाँले भन्नुभयो, "जेनेरेसन जेडको आवाज हाम्रो पनि आवाज हो। माओवादी मुलधारको पार्टी बन्छ।"

संयोजक प्रचण्डले भ्रष्टाचार विरुद्धको लडाईमा युवाहरुको सहयोग आवश्यक रहेको टिप्पणी गर्नुभयो।`,
    featureImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    imageAlt: 'माओवादी संयोजक प्रचण्ड',
    metaTitle: 'भ्रष्टाचार अन्त्य र युवाको भावना - प्रचण्ड',
    metaDescription: 'माओवादी संयोजक प्रचण्डले भ्रष्टाचार अन्त्य गर्ने र युवाको भावना अनुसार अघि बढ्ने शक्ति माओवादी नै हो भन्नुभयो।',
    metaKeywords: ['प्रचण्ड', 'माओवादी', 'भ्रष्टाचार', 'युवा'],
    status: 'published',
    difficulty: 'beginner',
    contentLanguage: 'ne',
    tags: ['राजनीति', 'समाचार', 'युवा'],
    isFeatured: true,
    publishedAt: new Date()
  },
  {
    title: 'नेपालमा शिक्षाको अवस्था र सुधारका उपायहरू',
    slug: 'nepalma-shikchhako-awastha-ra-sudharaka-upaayaharu',
    subtitle: 'शैक्षिक प्रणालीमा सुधारको आवश्यकता',
    excerpt: 'नेपालको शिक्षा क्षेत्रमा विभिन्न चुनौतीहरू रहेका छन्। गुणस्तरीय शिक्षाका लागि सुधार आवश्यक छ।',
    content: `काठमाडौं । नेपालको शिक्षा प्रणालीमा महत्वपूर्ण सुधारको आवश्यकता रहेको विशेषज्ञहरूले बताएका छन्।

हालको शैक्षिक प्रणालीमा पूर्वाधार, शिक्षकको गुणस्तर र पाठ्यक्रमको आधुनिकीकरण जस्ता विषयमा ध्यान दिनुपर्ने बताइएको छ।

विशेषज्ञहरूका अनुसार प्राविधिक शिक्षामा जोड दिनुपर्ने, शिक्षकहरूको तालिमको व्यवस्था गर्नुपर्ने र विद्यार्थीकेन्द्रित शिक्षा प्रणाली विकास गर्नुपर्ने आवश्यकता छ।`,
    featureImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    imageAlt: 'नेपालको शिक्षा प्रणाली',
    metaTitle: 'नेपालमा शिक्षाको अवस्था र सुधारका उपाय',
    metaDescription: 'नेपालको शिक्षा क्षेत्रमा रहेका चुनौतीहरू र गुणस्तरीय शिक्षाका लागि आवश्यक सुधारका उपायहरू।',
    metaKeywords: ['शिक्षा', 'नेपाल', 'सुधार', 'गुणस्तर'],
    status: 'published',
    difficulty: 'intermediate',
    contentLanguage: 'ne',
    tags: ['शिक्षा', 'समाज'],
    isFeatured: false,
    publishedAt: new Date()
  },
  {
    title: 'किसानहरूको समस्या र समाधान',
    slug: 'kisanaharu-ko-samasya-ra-samadhan',
    subtitle: 'कृषि क्षेत्रमा सुधारको आवश्यकता',
    excerpt: 'नेपाली किसानहरूले सामना गर्नुपरेका समस्याहरू र तिनको दिगो समाधानका उपायहरू।',
    content: `काठमाडौं । नेपाली किसानहरूले विभिन्न समस्याहरूको सामना गरिरहेका छन्।

मलखाद, बीउबिजन, सिँचाइको अभाव र उत्पादनको उचित मूल्य नपाउने समस्या प्रमुख रूपमा देखिएको छ।

विशेषज्ञहरूले आधुनिक प्रविधिको प्रयोग, बजार सुविधाको विकास र सहकारी खेती प्रवर्द्धन गर्न सुझाव दिएका छन्। सरकारले किसानमैत्री नीति बनाउनुपर्ने र उचित मूल्य सुनिश्चित गर्नुपर्ने माग गरिएको छ।`,
    featureImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    imageAlt: 'नेपाली किसान',
    metaTitle: 'किसानहरूको समस्या र समाधान',
    metaDescription: 'नेपाली किसानहरूले सामना गर्नुपरेका समस्याहरू र दिगो समाधानका उपायहरूको विवरण।',
    metaKeywords: ['किसान', 'कृषि', 'समस्या', 'समाधान'],
    status: 'published',
    difficulty: 'beginner',
    contentLanguage: 'ne',
    tags: ['कृषि', 'किसान', 'अर्थतन्त्र'],
    isFeatured: false,
    publishedAt: new Date()
  },
  {
    title: 'श्रमिक अधिकार र सामाजिक सुरक्षा',
    slug: 'shramik-adhikaar-ra-samajik-surakchha',
    subtitle: 'श्रमिकहरूको हक र हितको संरक्षण',
    excerpt: 'नेपालमा श्रमिकहरूको अधिकार र सामाजिक सुरक्षाको अवस्था तथा सुधारका उपायहरू।',
    content: `काठमाडौं । नेपालमा श्रमिकहरूको अधिकार र सामाजिक सुरक्षाको विषय महत्वपूर्ण भएको छ।

श्रम कानुनको कार्यान्वयन, न्यूनतम पारिश्रमिक, स्वास्थ्य बीमा र सामाजिक सुरक्षा कोषको विस्तार आवश्यक रहेको ट्रेड युनियनहरूले बताएका छन्।

श्रमिक संगठनहरूले सबै श्रमिकहरूको लागि सुरक्षित कामको वातावरण, उचित ज्याला र सामाजिक सुरक्षाको व्यवस्था गर्न सरकारसँग माग गरेका छन्। विशेष गरी अनौपचारिक क्षेत्रमा काम गर्ने श्रमिकहरूलाई पनि सुरक्षा दायरामा ल्याउनुपर्ने बताइएको छ।`,
    featureImage: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800',
    imageAlt: 'श्रमिक अधिकार',
    metaTitle: 'श्रमिक अधिकार र सामाजिक सुरक्षा',
    metaDescription: 'नेपालमा श्रमिकहरूको अधिकार, सामाजिक सुरक्षा र सुधारका उपायहरूको विस्तृत जानकारी।',
    metaKeywords: ['श्रमिक', 'अधिकार', 'सामाजिक सुरक्षा', 'ट्रेड युनियन'],
    status: 'published',
    difficulty: 'intermediate',
    contentLanguage: 'ne',
    tags: ['श्रमिक', 'अधिकार', 'समाज'],
    isFeatured: true,
    publishedAt: new Date()
  },
  {
    title: 'युवा रोजगारी र उद्यमशीलता विकास',
    slug: 'yuwa-rojgaarii-ra-udyamshiilta-vikas',
    subtitle: 'युवाहरूका लागि अवसर सिर्जना',
    excerpt: 'नेपालमा युवा रोजगारी र उद्यमशीलता विकासका चुनौती र अवसरहरू।',
    content: `काठमाडौं । नेपालमा युवा रोजगारी र उद्यमशीलता विकास महत्वपूर्ण विषय बनेको छ।

बढ्दो युवा जनसंख्यालाई रोजगारीको अवसर प्रदान गर्न सरकार र निजी क्षेत्रको सहकार्य आवश्यक रहेको विशेषज्ञहरूले बताएका छन्।

उद्यमशीलता विकासका लागि सहज कर्जा, प्राविधिक तालिम र बजार पहुँचको व्यवस्था गर्नुपर्ने बताइएको छ। विशेष गरी कृषि, पर्यटन र प्रविधि क्षेत्रमा युवाहरूलाई आकर्षित गर्न आवश्यक नीति र कार्यक्रम ल्याउनुपर्ने सुझाव दिइएको छ।

विदेश पलायन रोक्न स्वदेशमै रोजगारीका अवसर सिर्जना गर्नु जरुरी रहेको छ।`,
    featureImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    imageAlt: 'युवा उद्यमी',
    metaTitle: 'युवा रोजगारी र उद्यमशीलता विकास',
    metaDescription: 'नेपालमा युवा रोजगारी र उद्यमशीलता विकासका चुनौती, अवसर र समाधानका उपायहरू।',
    metaKeywords: ['युवा', 'रोजगारी', 'उद्यमशीलता', 'विकास'],
    status: 'published',
    difficulty: 'beginner',
    contentLanguage: 'ne',
    tags: ['युवा', 'रोजगारी', 'उद्यमशीलता'],
    isFeatured: false,
    publishedAt: new Date()
  }
];

async function insertDemoArticles() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const dbUri = process.env.MONGODB_URI;
    
    if (!dbUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(dbUri);
    console.log('✅ Connected successfully\n');

    // Define Articles schema
    const ArticlesSchema = new mongoose.Schema({}, { strict: false });
    const Articles = mongoose.models.Articles || mongoose.model('Articles', ArticlesSchema);

    // Get a valid category ID from existing categories
    const db = mongoose.connection.db;
    const categories = await db.collection('subcategories').find({}).limit(1).toArray();
    
    if (categories.length === 0) {
      console.error('❌ No categories found. Please create a category first.');
      process.exit(1);
    }

    const categoryId = categories[0]._id;
    console.log(`📁 Using category: ${categories[0].name} (${categoryId})\n`);

    // Insert articles
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < demoArticles.length; i++) {
      const articleData = {
        ...demoArticles[i],
        category: categoryId,
        authorName: 'ANTUF Admin',
        sections: [],
        viewCount: Math.floor(Math.random() * 1000),
        likeCount: Math.floor(Math.random() * 100),
        shareCount: Math.floor(Math.random() * 50),
        commentCount: 0,
        allowComments: true,
        isPinned: false,
        readTime: Math.floor(Math.random() * 10) + 3,
        contributors: []
      };

      try {
        await Articles.create(articleData);
        console.log(`✅ [${i + 1}/5] Created: ${articleData.title.substring(0, 50)}...`);
        successCount++;
      } catch (error) {
        console.error(`❌ [${i + 1}/5] Failed: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully created: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📝 Total: 5`);

    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

insertDemoArticles();
