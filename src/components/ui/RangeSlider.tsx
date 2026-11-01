import type { InputHTMLAttributes } from 'react';

export function RangeSlider({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <input type="range" aria-label={label} {...props} />;
}
