
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
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bold') ? 'bg-gray-300' : ''
          }`}
        >
          <Bold size={16} className="text-gray-700" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('italic') ? 'bg-gray-300' : ''
          }`}
        >
          <Italic size={16} className="text-gray-700" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bulletList') ? 'bg-gray-300' : ''
          }`}
        >
          <List size={16} className="text-gray-700" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('taskList') ? 'bg-gray-300' : ''
          }`}
        >
          <CheckSquare size={16} className="text-gray-700" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="bg-white text-black min-h-[200px]"
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
