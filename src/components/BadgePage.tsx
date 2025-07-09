
import { ArrowLeft } from 'lucide-react';

interface BadgePageProps {
  onBack: () => void;
}

const BadgePage = ({ onBack }: BadgePageProps) => {
  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
          >
            <ArrowLeft size={22} className="text-[#9B9B9B]" />
          </button>
          <h1 className="text-xl font-bold ml-4 text-[#DBDBDB]">Badge</h1>
        </div>

        <div className="flex items-center justify-center h-64">
          <p className="text-[#9B9B9B] text-lg">Badge content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default BadgePage;
