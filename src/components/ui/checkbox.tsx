import React from 'react';

export const Checkbox: React.FC<{
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  id?: string;
}> = ({ checked = false, onCheckedChange, id }) => {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      style={{ width: 16, height: 16 }}
    />
  );
};

export default Checkbox;