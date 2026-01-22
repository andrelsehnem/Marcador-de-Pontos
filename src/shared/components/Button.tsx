import React from 'react';

interface ButtonProps {
  text: string;
  backgroundColor: string;
  textColor: string;
  onClick?: () => void;
  className?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

const Button: React.FC<ButtonProps> = ({
  text,
  backgroundColor,
  textColor,
  onClick,
  className = '',
  borderColor,
  borderWidth = 0,
  borderRadius = 8,
}) => {
  const style: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    border: borderColor && borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
    borderRadius,
  };

  return (
    <button
      className={`button ${className}`}
      style={style}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
