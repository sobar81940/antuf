"use client";

import { useEffect, useState } from "react";
import { Box, Container, IconButton, Link, Typography } from "@mui/material";
import { Facebook, Instagram, LinkedIn, LocationOn, MailOutline, PhoneOutlined, YouTube } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const quickLinks = [["About ANTUF", "/pages/about"], ["Activities", "/pages/activities"], ["Representatives", "/representatives"], ["Documents", "/pages/documents"], ["Events", "/events"], ["Contact us", "/contact"]];
const legalLinks = [["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy"], ["Refund Policy", "/refund"]];

export default function Footer() {
  const router = useRouter();
  const [sections, setSections] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/homepage/catewithsubcate").then((response) => response.ok ? response.json() : []).then((items) => {
      const grouped = (Array.isArray(items) ? items : []).reduce((all: any[], item: any) => {
        const category = item?.categoryId; const subcategory = item?.subcategoryId;
        if (!category || !subcategory) return all;
        const group = all.find((entry) => entry.slug === category.slug);
        if (group) group.subcategories.push(subcategory); else all.push({ name: category.name, slug: category.slug, subcategories: [subcategory] });
        return all;
      }, []);
      setSections(grouped.slice(0, 2));
    }).catch(() => setSections([]));
  }, []);

  const navigate = (path: string) => () => router.push(path);
  const footerHeading = { color: "#fff", fontWeight: 800, fontSize: "1rem", mb: 1.75 };
  const footerLink = { color: "rgba(226,232,240,.72)", fontSize: ".9rem", cursor: "pointer", transition: "color .2s", "&:hover": { color: "#6ee7b7" } };
  return <Box component="footer" sx={{ mt: "auto", color: "#e2e8f0", background: "radial-gradient(circle at 12% 0%, #164e63 0%, #0f172a 38%, #020617 100%)", borderTop: "1px solid rgba(148,163,184,.18)" }}>
    <Container maxWidth="xl" sx={{ pt: { xs: 6, md: 8 }, pb: 4 }}><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "1.45fr .8fr .8fr 1fr" }, gap: { xs: 4, md: 5 } }}>
      <Box><Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}><Box component="img" src="/antuf-final-logo-5.png" alt="ANTUF" sx={{ width: 46, height: 46, objectFit: "contain", bgcolor: "white", borderRadius: 2, p: .4 }} /><Box><Typography fontWeight={900} letterSpacing={.5} sx={{ color: "#fff" }}>ANTUF</Typography><Typography variant="caption" sx={{ color: "#6ee7b7" }}>All Nepal Federation of Trade Unions</Typography></Box></Box><Typography sx={{ color: "rgba(226,232,240,.72)", fontSize: ".92rem", lineHeight: 1.75, maxWidth: 390 }}>Promoting and protecting the rights, dignity, and welfare of workers in Nepal and beyond.</Typography><Box sx={{ display: "flex", gap: 1, mt: 2.5 }}>{[[Facebook, "Facebook"], [Instagram, "Instagram"], [LinkedIn, "LinkedIn"], [YouTube, "YouTube"]].map(([Icon, label]: any) => <IconButton key={label} aria-label={label} sx={{ color: "#cbd5e1", border: "1px solid rgba(203,213,225,.22)", "&:hover": { color: "#fff", bgcolor: "#0f766e", borderColor: "#0f766e" } }}><Icon fontSize="small" /></IconButton>)}</Box></Box>
      <Box><Typography sx={footerHeading}>Explore</Typography><Box sx={{ display: "grid", gap: 1.1 }}>{quickLinks.map(([label, path]) => <Link key={path} component="button" underline="none" onClick={navigate(path)} sx={{ ...footerLink, textAlign: "left", bgcolor: "transparent", border: 0, p: 0 }}>{label}</Link>)}</Box></Box>
      <Box><Typography sx={footerHeading}>Information</Typography><Box sx={{ display: "grid", gap: 1.1 }}>{legalLinks.map(([label, path]) => <Link key={path} component="button" underline="none" onClick={navigate(path)} sx={{ ...footerLink, textAlign: "left", bgcolor: "transparent", border: 0, p: 0 }}>{label}</Link>)}{sections.map((section) => <Link key={section.slug} component="button" underline="none" onClick={navigate(`/${section.slug}`)} sx={{ ...footerLink, textAlign: "left", bgcolor: "transparent", border: 0, p: 0 }}>{section.name}</Link>)}</Box></Box>
      <Box><Typography sx={footerHeading}>Get in touch</Typography><Box sx={{ display: "grid", gap: 1.4 }}><Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}><LocationOn sx={{ color: "#5eead4", fontSize: 20, mt: .15 }} /><Typography sx={{ color: "rgba(226,232,240,.72)", fontSize: ".9rem" }}>Paris Danda, Koteswor-32, Kathmandu, Nepal</Typography></Box><Box sx={{ display: "flex", gap: 1, alignItems: "center" }}><PhoneOutlined sx={{ color: "#5eead4", fontSize: 19 }} /><Typography sx={{ color: "rgba(226,232,240,.72)", fontSize: ".9rem" }}>+977-01-4602758</Typography></Box><Box sx={{ display: "flex", gap: 1, alignItems: "center" }}><MailOutline sx={{ color: "#5eead4", fontSize: 19 }} /><Link href="mailto:info@antuf.org" underline="hover" sx={footerLink}>info@antuf.org</Link></Box></Box></Box>
    </Box><Box sx={{ mt: { xs: 5, md: 6 }, pt: 3, borderTop: "1px solid rgba(148,163,184,.18)" }}><Typography sx={footerHeading}>Our location / हाम्रो स्थान</Typography><Box sx={{ overflow: "hidden", borderRadius: 3, border: "1px solid rgba(148,163,184,.22)", height: { xs: 240, sm: 300 }, boxShadow: "0 16px 40px rgba(0,0,0,.25)" }}><Box component="iframe" title="ANTUF Location Map" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56525.06391095446!2d85.334246!3d27.692066!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19f2dc69b5b5%3A0x458dbd5c96ec655e!2sALL%20NEPAL%20FEDERATION%20OF%20TRADE%20UNIONS!5e0!3m2!1sen!2sus!4v1762664560747!5m2!1sen!2sus" sx={{ width: "100%", height: "100%", border: 0, display: "block", filter: "saturate(.85) contrast(1.05)" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></Box></Box><Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mt: { xs: 5, md: 7 }, pt: 2.5, borderTop: "1px solid rgba(148,163,184,.18)" }}><Typography variant="body2" sx={{ color: "rgba(226,232,240,.55)" }}>© {new Date().getFullYear()} ANTUF. All rights reserved.</Typography><Typography variant="body2" sx={{ color: "rgba(226,232,240,.55)" }}>Solidarity · Dignity · Justice</Typography></Box></Container>
  </Box>;
}
