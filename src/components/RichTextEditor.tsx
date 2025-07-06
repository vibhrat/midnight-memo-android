import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, List, CheckSquare, Strikethrough, Underline as UnderlineIcon } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 text-[#DBDBDB]',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-[#1C1C1C] rounded-lg overflow-hidden bg-[#181818]">
      {/* Editor */}
      <EditorContent
        editor={editor}
        className="bg-[#181818] text-[#DBDBDB] min-h-[200px]"
        placeholder={placeholder}
      />

      {/* Toolbar - moved below */}
      <div className="flex items-center gap-2 p-2 border-t border-[#1C1C1C] bg-[#000000]">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-[#181818] ${
            editor.isActive('bold') ? 'bg-[#181818] text-[#DBDBDB]' : 'text-[#9B9B9B]'
          }`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-[#181818] ${
            editor.isActive('italic') ? 'bg-[#181818] text-[#DBDBDB]' : 'text-[#9B9B9B]'
          }`}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-[#181818] ${
            editor.isActive('underline') ? 'bg-[#181818] text-[#DBDBDB]' : 'text-[#9B9B9B]'
          }`}
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-[#181818] ${
            editor.isActive('strike') ? 'bg-[#181818] text-[#DBDBDB]' : 'text-[#9B9B9B]'
          }`}
        >
          <Strikethrough size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-[#181818] ${
            editor.isActive('bulletList') ? 'bg-[#181818] text-[#DBDBDB]' : 'text-[#9B9B9B]'
          }`}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded hover:bg-[#181818] ${
            editor.isActive('taskList') ? 'bg-[#181818] text-[#DBDBDB]' : 'text-[#9B9B9B]'
          }`}
        >
          <CheckSquare size={16} />
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;
