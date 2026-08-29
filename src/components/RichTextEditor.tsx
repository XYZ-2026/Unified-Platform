"use client";

import React, { useEffect, useCallback, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle, Color, FontFamily } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
  IconList,
  IconListNumbers,
  IconBlockquote,
  IconTable,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconSuperscript,
  IconSubscript,
  IconMinus,
  IconChevronDown,
  IconRowInsertBottom,
  IconColumnInsertRight,
  IconTrash,
  IconTableOff,
  IconH1,
  IconH2,
  IconH3,
  IconTypography,
  IconHighlight,
  IconPalette,
} from "@tabler/icons-react";

/* ────────────────────────────── types ────────────────────────────── */

interface RichTextEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  doubleSpaced?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}

export interface RichTextEditorRef {
  insertContent: (html: string) => void;
  appendContent: (html: string) => void;
  focus: () => void;
}

/* ──────────────────────── toolbar button ─────────────────────────── */

function TBtn({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-[32px] h-[32px] rounded-lg flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer ${active
          ? "bg-[#690B1B]/10 text-[#690B1B] shadow-sm"
          : disabled
            ? "text-[#CCC] cursor-not-allowed"
            : "text-[#5F5F5F] hover:bg-neutral-100 hover:text-[#111]"
        }`}
    >
      {children}
    </button>
  );
}

/* ──────────────────────── toolbar divider ────────────────────────── */

function TDiv() {
  return <div className="w-px h-5 bg-[#E6DFDA] mx-0.5 shrink-0" />;
}

/* ──────────────────── dropdown wrapper ───────────────────────────── */

function ToolbarDropdown({
  label,
  children,
  width = "w-44",
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen(!open)}
        className="h-[32px] px-2.5 rounded-lg flex items-center gap-1 text-[12px] font-semibold text-[#5F5F5F] hover:bg-neutral-100 hover:text-[#111] transition-all cursor-pointer"
      >
        {label}
        <IconChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className={`absolute top-full left-0 mt-1.5 ${width} bg-white border border-[#E7E2DE] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ──────────────────── dropdown item ──────────────────────────────── */

function DItem({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`w-full px-3.5 py-2 text-left text-[13px] font-medium transition-colors cursor-pointer ${active
          ? "bg-[#690B1B]/[0.06] text-[#690B1B] font-bold"
          : "text-[#444] hover:bg-neutral-50"
        }`}
    >
      {children}
    </button>
  );
}

/* ──────────────────── color picker popup ─────────────────────────── */

function ColorPicker({
  icon,
  title,
  colors,
  currentColor,
  onSelect,
  onClear,
}: {
  icon: React.ReactNode;
  title: string;
  colors: string[];
  currentColor: string | undefined;
  onSelect: (color: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen(!open)}
        title={title}
        className={`w-[32px] h-[32px] rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${currentColor ? "text-[#690B1B]" : "text-[#5F5F5F] hover:bg-neutral-100"
          }`}
      >
        <div className="flex flex-col items-center gap-0">
          {icon}
          {currentColor && (
            <div
              className="w-3.5 h-[3px] rounded-full -mt-0.5"
              style={{ backgroundColor: currentColor }}
            />
          )}
        </div>
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-white border border-[#E7E2DE] rounded-xl shadow-lg p-3 z-50 w-[180px]">
          <div className="text-[10px] text-[#999] font-bold uppercase tracking-wider mb-2">{title}</div>
          <div className="grid grid-cols-6 gap-1.5 mb-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(c);
                  setOpen(false);
                }}
                className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 cursor-pointer ${currentColor === c ? "border-[#690B1B] ring-2 ring-[#690B1B]/20 scale-110" : "border-neutral-200"
                  }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onClear();
              setOpen(false);
            }}
            className="w-full text-[11px] text-[#999] hover:text-[#690B1B] font-semibold py-1 transition cursor-pointer"
          >
            Remove color
          </button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── TOOLBAR ────────────────────────────────── */

function Toolbar({ editor }: { editor: Editor }) {
  const TEXT_COLORS = [
    "#111111", "#690B1B", "#1E40AF", "#065F46", "#92400E",
    "#6B21A8", "#9F1239", "#0369A1", "#166534", "#854D0E",
    "#581C87", "#DC2626",
  ];

  const HIGHLIGHT_COLORS = [
    "#FEF08A", "#FECACA", "#BBF7D0", "#BFDBFE", "#DDD6FE",
    "#FED7AA", "#E9D5FF", "#CFFAFE", "#FEE2E2", "#D1FAE5",
    "#E0E7FF", "#FCE7F3",
  ];

  const currentFontFamily = editor.getAttributes("textStyle").fontFamily || "Default";
  const currentTextColor = editor.getAttributes("textStyle").color;
  const currentHighlight = editor.getAttributes("highlight").color;

  // Determine heading display
  let headingLabel = "Paragraph";
  if (editor.isActive("heading", { level: 1 })) headingLabel = "Heading 1";
  else if (editor.isActive("heading", { level: 2 })) headingLabel = "Heading 2";
  else if (editor.isActive("heading", { level: 3 })) headingLabel = "Heading 3";

  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {/* Heading Selector */}
      <ToolbarDropdown label={<span className="truncate max-w-[80px]">{headingLabel}</span>} width="w-40">
        <DItem
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph") && !editor.isActive("heading")}
        >
          <span className="flex items-center gap-2"><IconTypography size={14} /> Paragraph</span>
        </DItem>
        <DItem
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          <span className="flex items-center gap-2"><IconH1 size={14} /> Heading 1</span>
        </DItem>
        <DItem
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <span className="flex items-center gap-2"><IconH2 size={14} /> Heading 2</span>
        </DItem>
        <DItem
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          <span className="flex items-center gap-2"><IconH3 size={14} /> Heading 3</span>
        </DItem>
      </ToolbarDropdown>

      <TDiv />

      {/* Font Family */}
      <ToolbarDropdown
        label={<span className="truncate max-w-[80px]">{currentFontFamily === "Default" ? "Font" : currentFontFamily.split(",")[0]}</span>}
        width="w-48"
      >
        <DItem
          onClick={() => editor.chain().focus().unsetFontFamily().run()}
          active={!editor.getAttributes("textStyle").fontFamily}
        >
          Default (Serif)
        </DItem>
        <DItem
          onClick={() => editor.chain().focus().setFontFamily("Georgia, serif").run()}
          active={currentFontFamily.includes("Georgia")}
        >
          <span style={{ fontFamily: "Georgia, serif" }}>Georgia</span>
        </DItem>
        <DItem
          onClick={() => editor.chain().focus().setFontFamily("'Times New Roman', serif").run()}
          active={currentFontFamily.includes("Times")}
        >
          <span style={{ fontFamily: "'Times New Roman', serif" }}>Times New Roman</span>
        </DItem>
        <DItem
          onClick={() => editor.chain().focus().setFontFamily("Arial, sans-serif").run()}
          active={currentFontFamily.includes("Arial")}
        >
          <span style={{ fontFamily: "Arial, sans-serif" }}>Arial</span>
        </DItem>
        <DItem
          onClick={() => editor.chain().focus().setFontFamily("Poppins, sans-serif").run()}
          active={currentFontFamily.includes("Poppins")}
        >
          <span style={{ fontFamily: "Poppins, sans-serif" }}>Poppins</span>
        </DItem>
        <DItem
          onClick={() => editor.chain().focus().setFontFamily("'Courier New', monospace").run()}
          active={currentFontFamily.includes("Courier")}
        >
          <span style={{ fontFamily: "'Courier New', monospace" }}>Courier New</span>
        </DItem>
      </ToolbarDropdown>

      <TDiv />

      {/* Basic formatting */}
      <TBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
        <IconBold size={15} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
        <IconItalic size={15} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
        <IconUnderline size={15} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <IconStrikethrough size={15} />
      </TBtn>

      <TDiv />

      {/* Super / Sub */}
      <TBtn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} title="Superscript">
        <IconSuperscript size={15} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} title="Subscript">
        <IconSubscript size={15} />
      </TBtn>

      <TDiv />

      {/* Text Color */}
      <ColorPicker
        icon={<IconPalette size={15} />}
        title="Text Color"
        colors={TEXT_COLORS}
        currentColor={currentTextColor}
        onSelect={(c) => editor.chain().focus().setColor(c).run()}
        onClear={() => editor.chain().focus().unsetColor().run()}
      />

      {/* Highlight Color */}
      <ColorPicker
        icon={<IconHighlight size={15} />}
        title="Highlight"
        colors={HIGHLIGHT_COLORS}
        currentColor={currentHighlight}
        onSelect={(c) => editor.chain().focus().toggleHighlight({ color: c }).run()}
        onClear={() => editor.chain().focus().unsetHighlight().run()}
      />

      <TDiv />

      {/* Alignment */}
      <TBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
        <IconAlignLeft size={15} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
        <IconAlignCenter size={15} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">
        <IconAlignRight size={15} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">
        <IconAlignJustified size={15} />
      </TBtn>

      <TDiv />

      {/* Lists & Quote */}
      <TBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
        <IconList size={15} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
        <IconListNumbers size={15} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
        <IconBlockquote size={15} />
      </TBtn>

      <TDiv />

      {/* Insert Table */}
      <ToolbarDropdown label={<IconTable size={15} />} width="w-44">
        <DItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <span className="flex items-center gap-2"><IconTable size={14} /> Insert 3×3 Table</span>
        </DItem>
        <DItem onClick={() => editor.chain().focus().insertTable({ rows: 4, cols: 4, withHeaderRow: true }).run()}>
          <span className="flex items-center gap-2"><IconTable size={14} /> Insert 4×4 Table</span>
        </DItem>
        {editor.isActive("table") && (
          <>
            <div className="h-px bg-[#E7E2DE] my-1" />
            <DItem onClick={() => editor.chain().focus().addRowAfter().run()}>
              <span className="flex items-center gap-2"><IconRowInsertBottom size={14} /> Add Row Below</span>
            </DItem>
            <DItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
              <span className="flex items-center gap-2"><IconColumnInsertRight size={14} /> Add Column Right</span>
            </DItem>
            <DItem onClick={() => editor.chain().focus().deleteRow().run()}>
              <span className="flex items-center gap-2 text-red-600"><IconTrash size={14} /> Delete Row</span>
            </DItem>
            <DItem onClick={() => editor.chain().focus().deleteColumn().run()}>
              <span className="flex items-center gap-2 text-red-600"><IconTrash size={14} /> Delete Column</span>
            </DItem>
            <DItem onClick={() => editor.chain().focus().deleteTable().run()}>
              <span className="flex items-center gap-2 text-red-600"><IconTableOff size={14} /> Delete Table</span>
            </DItem>
          </>
        )}
      </ToolbarDropdown>

      {/* Horizontal Rule */}
      <TBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
        <IconMinus size={15} />
      </TBtn>

      <TDiv />

      {/* Undo / Redo */}
      <TBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
        <IconArrowBackUp size={15} />
      </TBtn>
      <TBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Shift+Z)">
        <IconArrowForwardUp size={15} />
      </TBtn>
    </div>
  );
}

/* ───────────────────── MAIN EDITOR COMPONENT ────────────────────── */

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (
    {
      content,
      onUpdate,
      doubleSpaced = false,
      placeholder = "Start writing your academic paper...",
      readOnly = false,
    },
    ref
  ) => {
    const isExternalUpdate = useRef(false);

    const rawExtensions = [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        horizontalRule: false,
        underline: false as any,
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Superscript,
      Subscript,
      FontFamily,
      HorizontalRule,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ];

    const deduplicatedExtensions = rawExtensions.reduce((acc: any[], ext) => {
      if (!ext) return acc;
      const name = ext.name;
      if (!acc.some((existing) => existing.name === name)) {
        acc.push(ext);
      }
      return acc;
    }, []);

    const editor = useEditor({
      extensions: deduplicatedExtensions,
      content,
      editable: !readOnly,
      editorProps: {
        attributes: {
          class: `${readOnly ? "tiptap-readonly" : "tiptap"} prose max-w-none focus:outline-none ${doubleSpaced ? "double-spaced" : ""}`,
        },
      },
      onUpdate: ({ editor: ed }) => {
        if (!isExternalUpdate.current) {
          onUpdate(ed.getHTML());
        }
      },
      immediatelyRender: false,
    });

    // Expose editor API via ref
    useImperativeHandle(ref, () => ({
      insertContent: (html: string) => {
        if (editor && !editor.isDestroyed) {
          editor.chain().focus().insertContent(html).run();
        }
      },
      appendContent: (html: string) => {
        if (editor && !editor.isDestroyed) {
          editor.chain().focus().createParagraphNear().insertContent(html).run();
        }
      },
      focus: () => {
        if (editor && !editor.isDestroyed) {
          editor.commands.focus();
        }
      },
    }));

    // Sync external content changes (section switching)
    useEffect(() => {
      if (editor && !editor.isDestroyed) {
        const currentHTML = editor.getHTML();
        if (content !== currentHTML) {
          isExternalUpdate.current = true;
          editor.commands.setContent(content, { emitUpdate: false });
          isExternalUpdate.current = false;
        }
      }
    }, [content, editor]);

    // Sync readOnly property
    useEffect(() => {
      if (editor && !editor.isDestroyed) {
        editor.setEditable(!readOnly);
      }
    }, [readOnly, editor]);

    if (!editor) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#690B1B] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        {!readOnly && (
          <div className="bg-white border border-[#E7E2DE] rounded-t-2xl px-4 py-2.5 shadow-sm shrink-0 relative z-30">
            <Toolbar editor={editor} />
          </div>
        )}

        {/* Editor Surface */}
        <div className={`flex-grow bg-white border border-[#E7E2DE] shadow-sm overflow-y-auto px-10 py-8 focus-within:ring-1 focus-within:ring-[#690B1B]/15 transition-all ${readOnly ? "rounded-2xl" : "border-t-0 rounded-b-2xl"}`}>
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;

/* ─────────────── Exported helper: extract text from editor ──────── */

export function getPlainTextFromHTML(html: string): string {
  if (typeof document === "undefined") return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
