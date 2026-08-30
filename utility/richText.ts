// Plain-text extractor for HTML produced by rich-text editors (e.g. Tiptap).
// Used where only a text preview can be shown (sliders, cards, snippets).
export const stripHtml = (html?: string | null): string => {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>/g, " ") // remove tags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
};