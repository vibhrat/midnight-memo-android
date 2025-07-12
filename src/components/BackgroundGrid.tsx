
const BackgroundGrid = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="154" height="141" viewBox="0 0 154 141" fill="none" className="absolute top-0 left-0">
        <line x1="11.5" y1="2.18557e-08" x2="11.5" y2="141" stroke="#0D0D0D"/>
        <line x1="54.5" y1="2.18557e-08" x2="54.5" y2="109" stroke="#0D0D0D"/>
        <line x1="98.5" y1="2.18557e-08" x2="98.5" y2="130" stroke="#0D0D0D"/>
        <line x1="141.5" y1="2.18557e-08" x2="141.5" y2="91" stroke="#0D0D0D"/>
        <line y1="28.5" x2="154" y2="28.5" stroke="#0D0D0D"/>
        <line y1="70.5" x2="118" y2="70.5" stroke="#0D0D0D"/>
      </svg>
    </div>
  );
};

export default BackgroundGrid;
