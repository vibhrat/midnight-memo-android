
interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

const FloatingActionButton = ({ onClick, className = '' }: FloatingActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 right-6 w-16 h-16 rounded-full shadow-lg z-50 ${className}`}
      style={{ background: 'none', border: 'none' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
        <foreignObject x="-5" y="-5" width="66" height="66">
          <div style={{backdropFilter:'blur(2.5px)', clipPath:'url(#bgblur_0_14367_58_clip_path)', height:'100%', width:'100%'}}></div>
        </foreignObject>
        <rect data-figma-bg-blur-radius="5" x="0.5" y="0.5" width="55" height="55" rx="27.5" fill="url(#paint0_linear_14367_58)" stroke="url(#paint1_linear_14367_58)"/>
        <g filter="url(#filter1_d_14367_58)">
          <path d="M29.833 31.2471V37.166C29.833 37.6522 29.6397 38.1191 29.2959 38.4629C28.9522 38.8065 28.486 38.999 28 38.999C27.5138 38.999 27.0469 38.8067 26.7031 38.4629C26.3593 38.1191 26.167 37.6522 26.167 37.166V31.3652L28.1484 29.5625L29.833 31.2471ZM26.7324 28.1465L24.8789 29.833H18.834C18.3478 29.833 17.8809 29.6397 17.5371 29.2959C17.1935 28.9521 17 28.4861 17 28C17 27.5139 17.1935 27.0479 17.5371 26.7041C17.8809 26.3603 18.3478 26.167 18.834 26.167H24.7529L26.7324 28.1465ZM37.166 26.167C37.6522 26.167 38.1191 26.3603 38.4629 26.7041C38.8064 27.0479 38.999 27.514 38.999 28C38.999 28.486 38.8064 28.9521 38.4629 29.2959C38.1191 29.6397 37.6522 29.833 37.166 29.833H31.2471L29.6299 28.2158L31.8848 26.167H37.166ZM28 17C28.486 17 28.9522 17.1935 29.2959 17.5371C29.6397 17.8809 29.833 18.3478 29.833 18.834V25.3281L28.2139 26.7998L26.167 24.7529V18.834C26.167 18.3478 26.3594 17.8809 26.7031 17.5371C27.0469 17.1933 27.5138 17 28 17Z" fill="url(#paint2_linear_14367_58)"/>
        </g>
        <defs>
          <clipPath id="bgblur_0_14367_58_clip_path" transform="translate(5 5)">
            <rect x="0.5" y="0.5" width="55" height="55" rx="27.5"/>
          </clipPath>
          <filter id="filter1_d_14367_58" x="17" y="17" width="23.999" height="23.999" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="1" dy="1"/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14367_58"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14367_58" result="shape"/>
          </filter>
          <linearGradient id="paint0_linear_14367_58" x1="28" y1="0" x2="28" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7B7B7B" stopOpacity="0.43"/>
            <stop offset="0.5" stopColor="#7B7B7B" stopOpacity="0.49"/>
            <stop offset="1" stopColor="#3C3C3C" stopOpacity="0.26"/>
          </linearGradient>
          <linearGradient id="paint1_linear_14367_58" x1="28" y1="0" x2="28" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#202020"/>
            <stop offset="1" stopColor="#363636"/>
          </linearGradient>
          <linearGradient id="paint2_linear_14367_58" x1="27.9992" y1="9.66712" x2="27.9992" y2="46.3312" gradientUnits="userSpaceOnUse">
            <stop offset="0.0835342" stopColor="#848484"/>
            <stop offset="0.513416" stopColor="#E0E0E0"/>
            <stop offset="0.957326" stopColor="#595959"/>
          </linearGradient>
        </defs>
      </svg>
    </button>
  );
};

export default FloatingActionButton;
