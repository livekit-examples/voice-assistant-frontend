import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const THEME_STORAGE_KEY = "theme-mode";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
