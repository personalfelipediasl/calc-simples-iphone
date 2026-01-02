
import React from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'utility';
  isActive?: boolean;
  isWide?: boolean;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  onClick,
  variant = 'number',
  isActive = false,
  isWide = false
}) => {
  const getStyles = () => {
    const base = "flex items-center justify-center rounded-full text-3xl font-medium transition-all active:scale-95 active:brightness-110 duration-75 no-select relative overflow-hidden";
    const sizes = isWide ? "w-[160px] h-[75px] sm:w-[180px] sm:h-[85px]" : "w-[75px] h-[75px] sm:w-[85px] sm:h-[85px]";
    
    // 3D Shadow and Gradient logic
    let styleClasses = "";
    let inlineStyles: React.CSSProperties = {};

    if (variant === 'number') {
      styleClasses = "text-white shadow-[0_4px_0_rgb(30,30,30),0_8px_15px_rgba(0,0,0,0.5)]";
      inlineStyles = {
        background: 'linear-gradient(180deg, #444444 0%, #2a2a2a 100%)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      };
    } else if (variant === 'operator') {
      if (isActive) {
        styleClasses = "text-[#FF9F0A] shadow-inner";
        inlineStyles = {
          background: '#ffffff',
          boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.2)',
        };
      } else {
        styleClasses = "text-white shadow-[0_4px_0_rgb(180,110,0),0_8px_15px_rgba(255,159,10,0.3)]";
        inlineStyles = {
          background: 'linear-gradient(180deg, #FFB347 0%, #FF9F0A 100%)',
          borderTop: '1px solid rgba(255,255,255,0.3)',
        };
      }
    } else if (variant === 'utility') {
      styleClasses = "text-black shadow-[0_4px_0_rgb(120,120,120),0_8px_15px_rgba(0,0,0,0.3)]";
      inlineStyles = {
        background: 'linear-gradient(180deg, #D4D4D2 0%, #A5A5A5 100%)',
        borderTop: '1px solid rgba(255,255,255,0.5)',
      };
    }

    return { 
      className: `${base} ${sizes} ${styleClasses} ${isWide ? 'rounded-[40px] px-8 justify-start' : ''}`,
      style: inlineStyles
    };
  };

  const { className, style } = getStyles();

  return (
    <button className={className} style={style} onClick={onClick}>
      {/* Glossy overlay effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 pointer-events-none"></div>
      <span className="relative z-10">{label}</span>
    </button>
  );
};

export default CalculatorButton;
