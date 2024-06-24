import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number) => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "t";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "b";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "m";
  return num.toString();
};
