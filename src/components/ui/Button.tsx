import React from 'react';

type PrimaryButtonProps = {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onClick,
  icon,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`black-btn mx-auto leading-none  ${className}`}
    >
      {label}
      {icon}
    </button>
  );
};

export default PrimaryButton;
