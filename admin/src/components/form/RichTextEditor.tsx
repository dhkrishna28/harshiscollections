import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded text-sm transition
        ${active
          ? "bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        }`}
    >
      {children}
    </button>
  );
}

function TableMenu({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) {
  const [open, setOpen] = useState(false);
  const inTable = editor.isActive("table");

  const actions = inTable
    ? [
        { label: "Add Column Before", fn: () => editor.chain().focus().addColumnBefore().run() },
        { label: "Add Column After", fn: () => editor.chain().focus().addColumnAfter().run() },
        { label: "Delete Column", fn: () => editor.chain().focus().deleteColumn().run() },
        { label: "Add Row Before", fn: () => editor.chain().focus().addRowBefore().run() },
        { label: "Add Row After", fn: () => editor.chain().focus().addRowAfter().run() },
        { label: "Delete Row", fn: () => editor.chain().focus().deleteRow().run() },
        { label: "Toggle Header Row", fn: () => editor.chain().focus().toggleHeaderRow().run() },
        { label: "Merge Cells", fn: () => editor.chain().focus().mergeCells().run() },
        { label: "Split Cell", fn: () => editor.chain().focus().splitCell().run() },
        { label: "Delete Table", fn: () => editor.chain().focus().deleteTable().run() },
      ]
    : [{ label: "Insert Table (3×3)", fn: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() }];

  return (
    <div className="relative">
      <button
        type="button"
        title="Table"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-8 items-center gap-1 rounded px-2 text-xs font-medium transition ${
          inTable
            ? "bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
        Table
        <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
          <path d="M4.79 8.02L10 13.23l5.21-5.21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          onMouseLeave={() => setOpen(false)}
        >
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              className="w-full px-4 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => { a.fn(); setOpen(false); }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = "140px",
}: RichTextEditorProps) {
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none px-4 py-3 text-sm text-gray-800 dark:text-white/90 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-gray-900 [&_h1]:dark:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-gray-900 [&_h2]:dark:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mb-1 [&_h4]:mt-2 [&_h4]:text-gray-900 [&_h4]:dark:text-white [&_p]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2 [&_ol]:space-y-1 [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:dark:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:dark:text-gray-400 [&_blockquote]:my-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through [&_a]:text-brand-500 [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_th]:border [&_th]:border-gray-300 [&_th]:dark:border-gray-600 [&_th]:bg-gray-100 [&_th]:dark:bg-gray-700 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-300 [&_td]:dark:border-gray-600 [&_td]:px-3 [&_td]:py-2 [&_code]:font-mono [&_code]:text-xs [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-pink-600 [&_code]:dark:text-pink-400 [&_pre]:bg-gray-900 [&_pre]:dark:bg-gray-950 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:dark:text-gray-200 [&_pre_code]:p-0 [&_pre_code]:text-xs",
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // Keep editor content in sync when `value` prop changes (e.g., when editing an existing product)
  useEffect(() => {
    if (!editor) return;
    try {
      const current = editor.getHTML();
      if (!sourceMode && value !== current) {
        editor.commands.setContent(value || "");
      }
    } catch (e) {
      // ignore
    }
  }, [value, editor, sourceMode]);

  if (!editor) return null;

  const toggleSource = () => {
    if (!sourceMode) {
      setSourceHtml(editor.getHTML());
    } else {
      editor.commands.setContent(sourceHtml);
      onChange(sourceHtml);
    }
    setSourceMode((v) => !v);
  };

  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-gray-700 dark:bg-gray-800">
        {/* History */}
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 14 5-5-5-5" /><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
          </svg>
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Heading */}
        <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h8M4 6v12M12 6v12" /><path d="M17 10a2 2 0 1 1 4 0c0 1.2-.9 2-2 3h2" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h8M4 6v12M12 6v12" /><path d="M17.5 10a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1 2.6L17.5 14H21" />
          </svg>
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Inline formatting */}
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" y1="20" x2="20" y2="20" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Lists */}
        <ToolbarButton title="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Numbered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
            <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
          </svg>
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Table */}
        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />
        <TableMenu editor={editor} />

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Code */}
        <ToolbarButton title="Inline Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Code Block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" /><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" /><line x1="12" y1="7" x2="12" y2="17" />
          </svg>
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Text align */}
        <ToolbarButton title="Align Left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Align Center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Align Right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="6" y1="18" x2="21" y2="18" />
          </svg>
        </ToolbarButton>

        {/* Source view — pushed to the right */}
        <div className="ml-auto" />
        <button
          type="button"
          title="View HTML Source"
          onClick={toggleSource}
          className={`inline-flex h-8 items-center gap-1 rounded px-2 text-xs font-mono font-medium transition ${
            sourceMode
              ? "bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400"
              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          {sourceMode ? "Visual" : "HTML"}
        </button>
      </div>

      {/* Editor content / Source view */}
      {sourceMode ? (
        <textarea
          value={sourceHtml}
          onChange={(e) => setSourceHtml(e.target.value)}
          className="w-full resize-y bg-gray-950 px-4 py-3 font-mono text-xs text-green-400 focus:outline-none"
          style={{ minHeight }}
          spellCheck={false}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
