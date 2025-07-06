
interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

const FloatingActionButton = ({ onClick, className = '' }: FloatingActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-lg z-50 ${className}`}
      style={{ background: 'none', border: 'none' }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <foreignObject x="-5" y="-5" width="66" height="66">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{backdropFilter:'blur(2.5px)', clipPath:'url(#bgblur_0_4422_1050_clip_path)', height:'100%', width:'100%'}}></div>
        </foreignObject>
        <rect data-figma-bg-blur-radius="5" width="56" height="56" rx="28" fill="url(#paint0_linear_4422_1050)"/>
        <g filter="url(#filter1_d_4422_1050)">
          <path d="M28 38C22.477 38 18 33.523 18 28C18 22.477 22.477 18 28 18C33.523 18 38 22.477 38 28C38 33.523 33.523 38 28 38ZM28 36C30.1217 36 32.1566 35.1571 33.6569 33.6569C35.1571 32.1566 36 30.1217 36 28C36 25.8783 35.1571 23.8434 33.6569 22.3431C32.1566 20.8429 30.1217 20 28 20C25.8783 20 23.8434 20.8429 22.3431 22.3431C20.8429 23.8434 20 25.8783 20 28C20 30.1217 20.8429 32.1566 22.3431 33.6569C23.8434 35.1571 25.8783 36 28 36ZM29 29V33C29 33.2652 28.8946 33.5196 28.7071 33.7071C28.5196 33.8946 28.2652 34 28 34C27.7348 34 27.4804 33.8946 27.2929 33.7071C27.1054 33.5196 27 33.2652 27 33V29H23C22.7348 29 22.4804 28.8946 22.2929 28.7071C22.1054 28.5196 22 28.2652 22 28C22 27.7348 22.1054 27.4804 22.2929 27.2929C22.4804 27.1054 22.7348 27 23 27H27V23C27 22.7348 27.1054 22.4804 27.2929 22.2929C27.4804 22.1054 27.7348 22 28 22C28.2652 22 28.5196 22.1054 28.7071 22.2929C28.8946 22.4804 29 22.7348 29 23V27H33C33.2652 27 33.5196 27.1054 33.7071 27.2929C33.8946 27.4804 34 27.7348 34 28C34 28.2652 33.8946 28.5196 33.7071 28.7071C33.5196 28.8946 33.2652 29 33 29H29Z" fill="url(#paint1_linear_4422_1050)"/>
        </g>
        <defs>
          <clipPath id="bgblur_0_4422_1050_clip_path" transform="translate(5 5)">
            <rect width="56" height="56" rx="28"/>
          </clipPath>
          <filter id="filter1_d_4422_1050" x="17.5" y="17.5" width="22" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="0.5" dy="0.5"/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4422_1050"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4422_1050" result="shape"/>
          </filter>
          <linearGradient id="paint0_linear_4422_1050" x1="28" y1="0" x2="28" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B9B9B9" stopOpacity="0.43"/>
            <stop offset="0.5" stopColor="#7B7B7B" stopOpacity="0.49"/>
            <stop offset="1" stopColor="#3C3C3C" stopOpacity="0.26"/>
          </linearGradient>
          <linearGradient id="paint1_linear_4422_1050" x1="28" y1="18" x2="28" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9F9F9F"/>
            <stop offset="0.513416" stopColor="#DFDFDF"/>
            <stop offset="1" stopColor="#686868"/>
          </linearGradient>
        </defs>
      </svg>
    </button>
  );
};

export default FloatingActionButton;
