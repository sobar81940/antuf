"use client";

import { useState } from "react";
import {
  AccessTime, ArrowOutward, Email, ExpandMore, Facebook, Language,
  LinkedIn, LocationOn, Phone, Send, Twitter,
} from "@mui/icons-material";
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button,
  Container, Divider, FormControl, Grid, IconButton, MenuItem,
  Paper, Select, Snackbar, Stack, TextField, Typography,
} from "@mui/material";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

type LanguageKey = "en" | "ne";

const copy = {
  en: {
    eyebrow: "ANTUF / CONTACT DESK", title: "Let's keep the movement connected.",
    intro: "Whether you are a member, partner, journalist, or ally, our team is ready to hear from you.",
    switchLabel: "Language", messageTitle: "Send a message",
    messageIntro: "Tell us what you need and the right team will follow up within 48 business hours.",
    reason: "What can we help with?", choose: "Choose a topic", name: "Full name",
    email: "Email address", phone: "Phone number (optional)", message: "Your message",
    messageHint: "Share your question or request", send: "Send message",
    success: "Thank you. Our team will get back to you within 48 hours.", office: "Visit the office",
    officeIntro: "Drop in during office hours or call ahead so we can make time for you.",
    address: "Paris Danda, Koteswor-32, Kathmandu, Nepal", hours: "Monday - Friday, 10:00 AM - 5:00 PM NPT",
    direct: "Direct channels", general: "General enquiries", support: "Membership & support",
    partnership: "Partnerships", faq: "Questions, answered", faqIntro: "A few useful starting points before you write.",
    faqs: [
      ["How can I become a member of ANTUF?", "Complete the membership registration form on our website. Our team will review your application and contact you with the next steps."],
      ["What does ANTUF organise?", "We organise cultural, educational, and community events throughout the year. Visit the events section for upcoming programmes."],
      ["Can I partner with ANTUF?", "Yes. Send us a message or email partnerships@antuf.org with a short outline of your idea and we will be in touch."],
    ],
  },
  ne: {
    eyebrow: "ANTUF / सम्पर्क डेस्क", title: "आन्दोलनलाई जोडिराखौं।",
    intro: "तपाईं सदस्य, साझेदार, सञ्चारकर्मी वा सहयात्री हुनुहुन्छ भने, हाम्रो टोली तपाईंको कुरा सुन्न तयार छ।",
    switchLabel: "भाषा", messageTitle: "सन्देश पठाउनुहोस्",
    messageIntro: "तपाईंलाई चाहिएको कुरा लेख्नुहोस्। सही टोलीले ४८ व्यापारिक घण्टाभित्र सम्पर्क गर्नेछ।",
    reason: "हामी कसरी सहयोग गर्न सक्छौं?", choose: "विषय छान्नुहोस्", name: "पूरा नाम",
    email: "इमेल ठेगाना", phone: "फोन नम्बर (वैकल्पिक)", message: "तपाईंको सन्देश",
    messageHint: "आफ्नो प्रश्न वा अनुरोध लेख्नुहोस्", send: "सन्देश पठाउनुहोस्",
    success: "धन्यवाद। हाम्रो टोलीले ४८ घण्टाभित्र सम्पर्क गर्नेछ।", office: "कार्यालयमा आउनुहोस्",
    officeIntro: "कार्यालय समयमा आउनुहोस् वा पहिले फोन गरेर भेटको समय मिलाउनुहोस्।",
    address: "पेरिस डाँडा, कोटेश्वर-३२, काठमाडौं, नेपाल", hours: "सोमबार - शुक्रबार, बिहान १० - साँझ ५ NPT",
    direct: "प्रत्यक्ष सम्पर्क", general: "सामान्य सोधपुछ", support: "सदस्यता र सहयोग",
    partnership: "साझेदारी", faq: "तपाईंका प्रश्न, हाम्रो उत्तर", faqIntro: "सन्देश पठाउनुअघि उपयोगी जानकारी।",
    faqs: [
      ["ANTUF को सदस्य कसरी बन्ने?", "वेबसाइटमा रहेको सदस्यता दर्ता फारम भर्नुहोस्। हाम्रो टोलीले आवेदन समीक्षा गरेर अर्को चरणका लागि सम्पर्क गर्नेछ।"],
      ["ANTUF ले कस्ता कार्यक्रम आयोजना गर्छ?", "हामी वर्षभरि सांस्कृतिक, शैक्षिक र सामुदायिक कार्यक्रम आयोजना गर्छौं। आगामी कार्यक्रमका लागि कार्यक्रम खण्ड हेर्नुहोस्।"],
      ["के म ANTUF सँग साझेदारी गर्न सक्छु?", "सक्नुहुन्छ। आफ्नो योजनाको छोटो विवरणसहित सन्देश पठाउनुहोस् वा partnerships@antuf.org मा इमेल गर्नुहोस्।"],
    ],
  },
};

const topics = ["Membership inquiry", "Event information", "Donation & support", "Partnership opportunity", "General inquiry", "Other"];
const nepaliTopics = ["सदस्यता सोधपुछ", "कार्यक्रम जानकारी", "दान र सहयोग", "साझेदारी अवसर", "सामान्य सोधपुछ", "अन्य"];

export default function ContactRedesign() {
  const [language, setLanguage] = useState<LanguageKey>("en");
  const [form, setForm] = useState({ reason: "", name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const t = copy[language];
  const update = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.reason) nextErrors.reason = language === "en" ? "Choose a topic" : "विषय छान्नुहोस्";
    if (!form.name.trim()) nextErrors.name = language === "en" ? "Name is required" : "नाम आवश्यक छ";
    if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = language === "en" ? "Enter a valid email" : "मान्य इमेल लेख्नुहोस्";
    if (form.message.trim().length < 10) nextErrors.message = language === "en" ? "Please write at least 10 characters" : "कम्तीमा १० वर्ण लेख्नुहोस्";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: form.reason,
          name: form.name,
          email: form.email,
          contactNumber: form.phone,
          message: form.message,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setFailed(true);
        return;
      }
      setSent(true);
      setForm({ reason: "", name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };
  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "#fff" } };
  const contactChannels: Array<[React.ComponentType, string, string, string]> = [
    [Email, t.general, "info@antuf.org", "mailto:info@antuf.org"],
    [Phone, t.support, "+977-01-4602761", "tel:+977014602758"],
    [LocationOn, t.office, "Koteswor, Kathmandu", "#office"],
  ];

  return <Box sx={{ bgcolor: "#f5f7f4", color: "#14231f" }}>
    <Navbar />
    <Box component="main">
      <Box sx={{ bgcolor: "#123b35", color: "#fff", position: "relative", overflow: "hidden", "&::after": { content: '""', position: "absolute", width: 420, height: 420, border: "1px solid rgba(255,255,255,.14)", borderRadius: "50%", right: { xs: -220, md: -80 }, top: -200 } }}>
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 }, position: "relative", zIndex: 1 }}>
          <Grid container spacing={5} alignItems="end"><Grid size={{ xs: 12, md: 8 }}><Typography sx={{ color: "#8fe1bf", fontSize: ".78rem", fontWeight: 800, letterSpacing: 2, mb: 2 }}>{t.eyebrow}</Typography><Typography component="h1" sx={{ fontSize: { xs: "2.7rem", md: "5rem" }, lineHeight: .98, fontWeight: 900, maxWidth: 760 }}>{t.title}</Typography><Typography sx={{ color: "#c9ddd5", fontSize: { xs: "1.05rem", md: "1.2rem" }, lineHeight: 1.7, maxWidth: 650, mt: 3 }}>{t.intro}</Typography></Grid><Grid size={{ xs: 12, md: 4 }}><Paper elevation={0} sx={{ p: 2, bgcolor: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.2)", color: "#fff" }}><Typography sx={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: 1.4, mb: 1.25, color: "#a9dcca" }}>{t.switchLabel}</Typography><Stack direction="row" spacing={1}>{[{ key: "en", label: "English" }, { key: "ne", label: "नेपाली" }].map((item) => <Button key={item.key} onClick={() => setLanguage(item.key as LanguageKey)} startIcon={<Language />} sx={{ flex: 1, color: language === item.key ? "#123b35" : "#fff", bgcolor: language === item.key ? "#8fe1bf" : "transparent", border: "1px solid rgba(255,255,255,.25)", borderRadius: 1, textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#b7efd6" } }}>{item.label}</Button>)}</Stack></Paper></Grid></Grid>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={2} sx={{ mb: { xs: 6, md: 9 } }}>{contactChannels.map(([Icon, label, value, href]) => <Grid key={label as string} size={{ xs: 12, md: 4 }}><Paper component="a" href={href as string} elevation={0} sx={{ p: 2.5, minHeight: 128, display: "flex", alignItems: "center", gap: 2, textDecoration: "none", color: "inherit", border: "1px solid #dce5df", borderRadius: 1, bgcolor: "#fff", transition: "transform .2s, border-color .2s", "&:hover": { transform: "translateY(-4px)", borderColor: "#16866d" } }}><Box sx={{ width: 48, height: 48, display: "grid", placeItems: "center", bgcolor: "#e3f5ed", color: "#08745d", borderRadius: 1 }}><Icon /></Box><Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: 1.2, color: "#668078", fontWeight: 800 }}>{label}</Typography><Typography sx={{ fontWeight: 800, mt: .5, overflowWrap: "anywhere" }}>{value}</Typography><ArrowOutward sx={{ fontSize: 16, color: "#16866d", mt: .5 }} /></Box></Paper></Grid>)}</Grid>
        <Grid container spacing={{ xs: 5, md: 8 }} alignItems="start"><Grid size={{ xs: 12, md: 7 }}><Box sx={{ mb: 3 }}><Typography component="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" }, fontWeight: 900 }}>{t.messageTitle}</Typography><Typography sx={{ color: "#5c716a", mt: 1, lineHeight: 1.7 }}>{t.messageIntro}</Typography></Box><Paper component="form" onSubmit={submit} elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: "1px solid #dce5df", borderRadius: 1, bgcolor: "#fff" }}><Grid container spacing={2.25}><Grid size={12}><Typography sx={{ fontSize: ".82rem", fontWeight: 800, mb: .8 }}>{t.reason}</Typography><FormControl fullWidth error={!!errors.reason}><Select displayEmpty value={form.reason} onChange={(event) => update("reason", event.target.value)} sx={{ borderRadius: 1.5 }}><MenuItem value="" disabled>{t.choose}</MenuItem>{topics.map((topic, index) => <MenuItem key={topic} value={topic}>{language === "en" ? topic : nepaliTopics[index]}</MenuItem>)}</Select>{errors.reason && <Typography variant="caption" color="error">{errors.reason}</Typography>}</FormControl></Grid><Grid size={{ xs: 12, sm: 6 }}><TextField label={t.name} value={form.name} onChange={(event) => update("name", event.target.value)} error={!!errors.name} helperText={errors.name} fullWidth sx={fieldSx} /></Grid><Grid size={{ xs: 12, sm: 6 }}><TextField label={t.email} type="email" value={form.email} onChange={(event) => update("email", event.target.value)} error={!!errors.email} helperText={errors.email} fullWidth sx={fieldSx} /></Grid><Grid size={12}><TextField label={t.phone} value={form.phone} onChange={(event) => update("phone", event.target.value)} fullWidth sx={fieldSx} /></Grid><Grid size={12}><TextField label={t.message} placeholder={t.messageHint} value={form.message} onChange={(event) => update("message", event.target.value)} error={!!errors.message} helperText={errors.message || `${form.message.length}/300`} multiline minRows={5} inputProps={{ maxLength: 300 }} fullWidth sx={fieldSx} /></Grid><Grid size={12}><Button type="submit" variant="contained" endIcon={<Send />} disabled={sending} sx={{ bgcolor: "#08745d", borderRadius: 1, py: 1.5, px: 3, textTransform: "none", fontWeight: 800, "&:hover": { bgcolor: "#055946" }, "&.Mui-disabled": { bgcolor: "#67a998", color: "#fff" } }}>{sending ? (language === "en" ? "Sending..." : "पठाउँदै...") : t.send}</Button></Grid></Grid></Paper></Grid>
          <Grid size={{ xs: 12, md: 5 }} id="office"><Paper elevation={0} sx={{ bgcolor: "#e3f5ed", border: "1px solid #c5e5d7", borderRadius: 1, p: { xs: 3, md: 4 } }}><Typography sx={{ color: "#08745d", fontSize: ".75rem", letterSpacing: 1.3, fontWeight: 900, textTransform: "uppercase" }}>{t.direct}</Typography><Typography component="h2" sx={{ fontSize: "2rem", fontWeight: 900, mt: 1 }}>{t.office}</Typography><Typography sx={{ color: "#4c6b61", lineHeight: 1.7, mt: 1 }}>{t.officeIntro}</Typography><Divider sx={{ my: 3, borderColor: "#b9dccc" }} /><Stack spacing={2.2}><Box sx={{ display: "flex", gap: 1.5 }}><LocationOn sx={{ color: "#08745d" }} /><Typography>{t.address}</Typography></Box><Box sx={{ display: "flex", gap: 1.5 }}><AccessTime sx={{ color: "#08745d" }} /><Typography>{t.hours}</Typography></Box><Box sx={{ display: "flex", gap: 1.5 }}><Email sx={{ color: "#08745d" }} /><Typography><a href="mailto:info@antuf.org" style={{ color: "inherit" }}>info@antuf.org</a></Typography></Box></Stack><Stack direction="row" spacing={1} sx={{ mt: 4 }}><IconButton aria-label="Facebook" sx={{ bgcolor: "#fff", color: "#08745d" }}><Facebook /></IconButton><IconButton aria-label="Twitter" sx={{ bgcolor: "#fff", color: "#08745d" }}><Twitter /></IconButton><IconButton aria-label="LinkedIn" sx={{ bgcolor: "#fff", color: "#08745d" }}><LinkedIn /></IconButton></Stack></Paper><Box sx={{ mt: 2, height: 235, overflow: "hidden", borderRadius: 1, border: "1px solid #dce5df" }}><Box component="iframe" title="ANTUF office location" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56525.06391095446!2d85.334246!3d27.692066!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19f2dc69b5b5%3A0x458dbd5c96ec655e!2sALL%20NEPAL%20FEDERATION%20OF%20TRADE%20UNIONS!5e0!3m2!1sen!2sus!4v1762664560747!5m2!1sen!2sus" sx={{ width: "100%", height: "100%", border: 0 }} loading="lazy" /></Box></Grid></Grid>
        <Box sx={{ mt: { xs: 7, md: 10 }, maxWidth: 800 }}><Typography component="h2" sx={{ fontSize: { xs: "2rem", md: "2.8rem" }, fontWeight: 900 }}>{t.faq}</Typography><Typography sx={{ color: "#5c716a", mt: 1, mb: 3 }}>{t.faqIntro}</Typography>{t.faqs.map(([question, answer]) => <Accordion key={question} elevation={0} disableGutters sx={{ bgcolor: "transparent", borderTop: "1px solid #cddbd4", "&:last-child": { borderBottom: "1px solid #cddbd4" }, "&::before": { display: "none" } }}><AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 0, py: 1, fontWeight: 800 }}>{question}</AccordionSummary><AccordionDetails sx={{ px: 0, color: "#5c716a", lineHeight: 1.7 }}>{answer}</AccordionDetails></Accordion>)}</Box>
      </Container>
    </Box>
    <Footer /><Snackbar open={sent} autoHideDuration={6000} onClose={() => setSent(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}><Alert severity="success" onClose={() => setSent(false)}>{t.success}</Alert></Snackbar><Snackbar open={failed} autoHideDuration={6000} onClose={() => setFailed(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}><Alert severity="error" onClose={() => setFailed(false)}>{language === "en" ? "Sorry, we could not send your message. Please try again." : "माफ गर्नुहोस्, हामी तपाईंको सन्देश पठाउन सकेनौं। कृपया फेरि प्रयास गर्नुहोस्।"}</Alert></Snackbar>
  </Box>;
}
