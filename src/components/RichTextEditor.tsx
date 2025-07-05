
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Bold, Italic, List, CheckSquare } from 'lucide-react';

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
    <div className="border border-[#9B9B9B] rounded-lg overflow-hidden bg-[#181818]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-[#9B9B9B] bg-[#000000]">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-[#181818] ${
            editor.isActive('bold') ? 'bg-[#181818]' : ''
          }`}
        >
          <Bold size={16} className="text-[#9B9B9B]" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-[#181818] ${
            editor.isActive('italic') ? 'bg-[#181818]' : ''
          }`}
        >
          <Italic size={16} className="text-[#9B9B9B]" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-[#181818] ${
            editor.isActive('bulletList') ? 'bg-[#181818]' : ''
          }`}
        >
          <List size={16} className="text-[#9B9B9B]" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded hover:bg-[#181818] ${
            editor.isActive('taskList') ? 'bg-[#181818]' : ''
          }`}
        >
          <CheckSquare size={16} className="text-[#9B9B9B]" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="bg-[#181818] text-[#DBDBDB] min-h-[200px]"
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
