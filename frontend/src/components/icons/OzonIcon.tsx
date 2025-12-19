const OzonIcon = ({ className = "", width = 80, height = 24 }: { className?: string; width?: number; height?: number }) => {
  return (
    <svg 
      className={className}
      width={width} 
      height={height} 
      viewBox="0 0 500 150" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M249.5 0C111.7 0 0 33.6 0 75s111.7 75 249.5 75S499 116.4 499 75 387.3 0 249.5 0zm0 128.2c-119.3 0-216-23.8-216-53.2s96.7-53.2 216-53.2 216 23.8 216 53.2-96.7 53.2-216 53.2z" 
        fill="#005BFF"
      />
      <path 
        d="M249.5 98.8c70.1 0 126.9-10.6 126.9-23.8S319.6 51.2 249.5 51.2 122.6 61.8 122.6 75s56.8 23.8 126.9 23.8z" 
        fill="#005BFF"
      />
    </svg>
  );
};

export default OzonIcon;

