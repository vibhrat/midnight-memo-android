
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface BadgeProps {
  onBack: () => void;
}

const Badge = ({ onBack }: BadgeProps) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleImageClick = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col">
      <div className="max-w-2xl mx-auto p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 border border-[#9B9B9B] rounded-lg hover:bg-[#181818]"
          >
            <ArrowLeft size={22} className="text-[#9B9B9B]" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-8">
            <img
              src="/lovable-uploads/82dcef1b-e903-414d-99f0-318902d1ad2a.png"
              alt="Cipher Badge"
              className={`w-[100px] h-[100px] cursor-pointer transition-transform duration-1000 ${
                isRotating ? 'animate-spin' : ''
              }`}
              onClick={handleImageClick}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))',
                transformStyle: 'preserve-3d',
              }}
            />
          </div>
          
          <h2 className="text-2xl font-bold text-[#DBDBDB] mb-4 text-center">
            Cipher Master
          </h2>
          
          <p className="text-[#9B9B9B] text-center max-w-md">
            You have mastered the art of digital security. Your secrets are safe in the vault.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Badge;
