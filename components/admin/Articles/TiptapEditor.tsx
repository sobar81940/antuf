"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Box, CircularProgress, Divider, IconButton, Tooltip } from "@mui/material";
import { Code as CodeIcon, FormatBold as BoldIcon, FormatItalic as ItalicIcon, FormatListBulleted as BulletListIcon, FormatListNumbered as OrderedListIcon, FormatQuote as QuoteIcon, Image as ImageIcon, Redo as RedoIcon, Title as HeadingIcon, Undo as UndoIcon } from "@mui/icons-material";

type TiptapEditorProps = { value: string; onChange: (value: string) => void; folder?: string };

const ToolButton = ({ label, active, onClick, children }: any) => (
  <Tooltip title={label}><span><IconButton size="small" color={active ? "primary" : "default"} onClick={onClick} aria-label={label}>{children}</IconButton></span></Tooltip>
);

export default function TiptapEditor({ value, onChange, folder }: TiptapEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: false, allowBase64: false })],
    content: value,
    editorProps: { attributes: { class: "tiptap-content", "aria-label": "Post content editor" } },
    onUpdate: ({ editor: updatedEditor }) => onChange(updatedEditor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML())
      editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return null;
  const action = (callback: () => void) => () => callback();
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder || "antuf/articles");
      const response = await fetch("/api/upload", { method: "POST", body: formData, credentials: "include" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || "Image upload failed");
      editor.chain().focus().setImage({ src: payload.url, alt: file.name }).run();
    } catch (error) {
      console.error("Article image upload failed:", error);
      window.alert("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  return <Box sx={{ border: "1px solid rgba(102,126,234,0.22)", borderRadius: 2, overflow: "hidden", bgcolor: "#fff", "&:focus-within": { borderColor: "#667eea", boxShadow: "0 0 0 3px rgba(102,126,234,0.12)" }, "& .tiptap-content": { minHeight: 220, p: 1.75, outline: "none", color: "#1e293b", lineHeight: 1.7 }, "& .tiptap-content p": { mt: 0, mb: 1 }, "& .tiptap-content h2": { fontSize: "1.35rem", mt: 1, mb: .75 }, "& .tiptap-content ul, & .tiptap-content ol": { pl: 3, my: 1 }, "& .tiptap-content blockquote": { borderLeft: "3px solid #667eea", ml: 0, pl: 1.5, color: "#475569" }, "& .tiptap-content pre": { bgcolor: "#1e293b", color: "#f8fafc", p: 1.5, borderRadius: 1, overflow: "auto" }, "& .tiptap-content img": { display: "block", maxWidth: "100%", height: "auto", borderRadius: 1, my: 2 } }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: .25, p: .5, bgcolor: "#f8fafc", flexWrap: "wrap" }}>
      <ToolButton label="Bold" active={editor.isActive("bold")} onClick={action(() => editor.chain().focus().toggleBold().run())}><BoldIcon fontSize="small" /></ToolButton>
      <ToolButton label="Italic" active={editor.isActive("italic")} onClick={action(() => editor.chain().focus().toggleItalic().run())}><ItalicIcon fontSize="small" /></ToolButton>
      <ToolButton label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={action(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}><HeadingIcon fontSize="small" /></ToolButton>
      <Divider orientation="vertical" flexItem sx={{ mx: .25 }} />
      <ToolButton label="Bullet list" active={editor.isActive("bulletList")} onClick={action(() => editor.chain().focus().toggleBulletList().run())}><BulletListIcon fontSize="small" /></ToolButton>
      <ToolButton label="Numbered list" active={editor.isActive("orderedList")} onClick={action(() => editor.chain().focus().toggleOrderedList().run())}><OrderedListIcon fontSize="small" /></ToolButton>
      <ToolButton label="Quote" active={editor.isActive("blockquote")} onClick={action(() => editor.chain().focus().toggleBlockquote().run())}><QuoteIcon fontSize="small" /></ToolButton>
      <ToolButton label="Code block" active={editor.isActive("codeBlock")} onClick={action(() => editor.chain().focus().toggleCodeBlock().run())}><CodeIcon fontSize="small" /></ToolButton>
      <ToolButton label="Upload image" onClick={() => imageInputRef.current?.click()}><>{uploadingImage ? <CircularProgress size={17} /> : <ImageIcon fontSize="small" />}</></ToolButton>
      <input ref={imageInputRef} type="file" hidden accept="image/*" onChange={uploadImage} />
      <Divider orientation="vertical" flexItem sx={{ mx: .25 }} />
      <ToolButton label="Undo" onClick={action(() => editor.chain().focus().undo().run())}><UndoIcon fontSize="small" /></ToolButton>
      <ToolButton label="Redo" onClick={action(() => editor.chain().focus().redo().run())}><RedoIcon fontSize="small" /></ToolButton>
    </Box>
    <EditorContent editor={editor} />
  </Box>;
}
