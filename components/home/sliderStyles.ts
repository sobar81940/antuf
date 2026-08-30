// Brand palette used across the site (also used on the representatives page)
const BRAND = {
  navy: "#102c3b",
  navyDark: "#0b2130",
  green: "#16866d",
  greenDark: "#0f5e4c",
  cream: "#f4f1eb",
};

export const sliderStyles = {
  mainContainer: {
    position: "relative",
    backgroundColor: BRAND.navy,
    backgroundImage: 'url("/images/bg_1.jpeg")',
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  slideBox: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "78vh",
    minHeight: "480px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    "@media (max-width: 768px)": {
      height: "62vh",
      minHeight: "420px",
    },
    "@media (max-width: 480px)": {
      height: "60vh",
      minHeight: "400px",
    },
  },
  // Readability scrim so the title/text always stays legible over any image
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
    color: "#ffffff",
    padding: { xs: "24px 20px", sm: "36px 40px", md: "48px 64px" },
    background:
      "linear-gradient(90deg, rgba(16,44,59,0.95) 0%, rgba(16,44,59,0.82) 30%, rgba(16,44,59,0.45) 58%, rgba(16,44,59,0.14) 82%, rgba(16,44,59,0.02) 100%), linear-gradient(180deg, rgba(16,44,59,0) 62%, rgba(16,44,59,0.92) 100%)",
    zIndex: 2,
  },
  contentBox: {
    maxWidth: "720px",
    width: "100%",
  },
  // Row that holds the date + category pills side by side
  metaRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    mb: { xs: 1.5, sm: 2 },
  },
  // Date pill badge (e.g. "📅 12 Aug, 2025")
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(22,134,109,0.96)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: { xs: "0.78rem", sm: "0.85rem" },
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    padding: { xs: "5px 12px", sm: "7px 16px" },
    borderRadius: "999px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.28)",
  },
  // Category pill badge (e.g. "शैक्षिक / Education")
  categoryBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.5)",
    backdropFilter: "blur(4px)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: { xs: "0.78rem", sm: "0.85rem" },
    letterSpacing: "0.03em",
    padding: { xs: "5px 12px", sm: "7px 16px" },
    borderRadius: "999px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.22)",
  },
  // Small green accent line above the title
  accentBar: {
    width: "56px",
    height: "4px",
    borderRadius: "2px",
    backgroundColor: BRAND.green,
    mb: { xs: 2, sm: 3 },
  },
  titleText: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: 800,
    fontSize: { xs: "1.9rem", sm: "2.7rem", md: "3.4rem" },
    lineHeight: 1.15,
    color: "#ffffff",
    textShadow: "0 2px 10px rgba(0,0,0,0.35)",
    mb: { xs: 2.5, sm: 3 },
  },
  // Detail / view-more button under the title
  detailButton: {
    backgroundColor: BRAND.green,
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "0.95rem",
    textTransform: "none",
    px: { xs: 3, sm: 4 },
    py: { xs: 0.9, sm: 1.1 },
    borderRadius: "999px",
    boxShadow: "0 8px 18px rgba(22,134,109,0.4)",
    transition: "all 0.25s ease-in-out",
    "&:hover": {
      backgroundColor: BRAND.greenDark,
      transform: "translateY(-2px)",
      boxShadow: "0 12px 24px rgba(22,134,109,0.45)",
    },
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    py: 10,
  },
  errorContainer: {
    textAlign: "center",
    py: 4,
  },
};