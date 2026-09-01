import mongoose from "mongoose";

const DonationPageSchema = new mongoose.Schema(
    {
        headerTitle: {
            type: String,
            default: "दान गर्नुहोस्",
        },
        headerTitleEn: {
            type: String,
            default: "Support Our Cause",
        },
        headerSubtitle: {
            type: String,
            default: "तपाईंको सहयोगले नेपालका श्रमिकहरूको जीवनमा सकारात्मक परिवर्तन ल्याउन मद्दत गर्छ",
        },
        impactItems: [
            {
                amount: {
                    type: Number,
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
            },
        ],
        bankDetails: {
            bankName: {
                type: String,
                default: "Nepal Bank Limited",
            },
            accountName: {
                type: String,
                default: "ANTUF Nepal",
            },
            accountNumber: {
                type: String,
                default: "01234612758",
            },
            branch: {
                type: String,
                default: "Kathmandu, Nepal",
            },
        },
        paymentDetails: {
            qrCode: {
                type: String,
                default: "",
            },
            esewa: {
                type: String,
                default: "",
            },
            khalti: {
                type: String,
                default: "",
            },
        },
        contactEmail: {
            type: String,
            default: "donate@antuf.org.np",
        },
        contactPhone: {
            type: String,
            default: "+977-1-4612758",
        },
        helpText: {
            type: String,
            default: "दानसम्बन्धी कुनै प्रश्न भए हामीलाई सम्पर्क गर्नुहोस्:",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const existingDonationPageModel = mongoose.models.DonationPage;
if (existingDonationPageModel && !existingDonationPageModel.schema.path("paymentDetails")) {
    delete mongoose.models.DonationPage;
}

export default (mongoose.models.DonationPage ||
    mongoose.model("DonationPage", DonationPageSchema)) as mongoose.Model<any>;
