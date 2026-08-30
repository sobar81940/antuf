import mongoose from "mongoose";

const HistoryPageSchema = new mongoose.Schema(
    {
        headerTitle: { type: String, default: "हाम्रो इतिहास" },
        headerTitleEn: { type: String, default: "Our History & Journey" },
        headerSubtitle: {
            type: String,
            default: "श्रमिक एकता, अधिकार र सामाजिक न्यायको यात्रामा ANTUF",
        },
        intro: {
            type: String,
            default:
                "नेपालका श्रमिकहरूको आवाजलाई संगठित गर्दै ANTUF ले दशकौंदेखि अधिकार, सम्मान र समानताको अभियान अघि बढाउँदै आएको छ।",
        },
        stats: {
            type: [
            {
                value: { type: String, required: true },
                label: { type: String, required: true },
                description: { type: String, default: "" },
            },
            ],
            default: [
                { value: "50,000+", label: "सदस्य संख्या", description: "देशभरका सक्रिय सदस्यहरू" },
                { value: "100+", label: "सफल आन्दोलनहरू", description: "श्रमिक अधिकारका लागि" },
                { value: "5,00,000+", label: "प्रभावित श्रमिकहरू", description: "प्रत्यक्ष लाभान्वित" },
                { value: "77", label: "जिल्ला समितिहरू", description: "सबै जिल्लामा उपस्थिति" },
            ],
        },
        milestones: {
            type: [
            {
                year: { type: String, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true },
            },
            ],
            default: [
                { year: "२०४५ (1988)", title: "संगठनको स्थापना / Organization Founded", description: "नेपाल ट्रेड युनियन फेडरेशन (ANTUF) को स्थापना भएको थियो।" },
                { year: "२०५० (1993)", title: "राष्ट्रिय सम्मेलन / National Convention", description: "पहिलो राष्ट्रिय सम्मेलन सफलतापूर्वक सम्पन्न भयो।" },
                { year: "२०५८ (2001)", title: "श्रमिक अधिकार संरक्षण / Workers Rights Protection", description: "श्रमिक अधिकारका लागि ठूलो आन्दोलन सफल भयो।" },
                { year: "२०६३ (2006)", title: "जनआन्दोलन सहभागिता / People's Movement Participation", description: "ऐतिहासिक जनआन्दोलनमा महत्वपूर्ण भूमिका खेलेको।" },
                { year: "२०७२ (2015)", title: "भूकम्प राहत कार्य / Earthquake Relief", description: "विनाशकारी भूकम्पपछि श्रमिकहरूको राहत र पुनर्स्थापना।" },
                { year: "२०७८ (2021)", title: "डिजिटल युग / Digital Era", description: "डिजिटल प्रणालीमार्फत सेवा विस्तार र आधुनिकीकरण।" },
            ],
        },
        visionTitle: { type: String, default: "हाम्रो दृष्टिकोण" },
        vision: {
            type: String,
            default:
                "नेपालका सबै श्रमिकहरूको अधिकार सुरक्षित गर्दै सामाजिक न्याय र समानताको स्थापना गर्ने हाम्रो दृष्टिकोण रहेको छ।",
        },
        isActive: { type: Boolean, default: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default (mongoose.models.HistoryPage ||
    mongoose.model("HistoryPage", HistoryPageSchema)) as mongoose.Model<any>;