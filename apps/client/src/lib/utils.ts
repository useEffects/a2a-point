import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shortDate = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).replace(/-/g, ' ');
