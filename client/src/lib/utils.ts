import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add delay utility for simulating network requests or typing
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple NLP utilities for text matching
export const intentMatchers = {
  movieSearch: [
    'watch', 'movie', 'film', 'see', 'showing', 'playing', 'cinema', 'theater'
  ],
  showtime: [
    'time', 'showtime', 'showing', 'when', 'schedule', 'playing'
  ],
  booking: [
    'book', 'ticket', 'seat', 'reserve', 'buy'
  ],
  confirmation: [
    'confirm', 'yes', 'ok', 'okay', 'sure', 'great', 'perfect'
  ]
};

export const matchIntent = (text: string, intents: string[]) => {
  const lowerText = text.toLowerCase();
  return intents.some(intent => lowerText.includes(intent));
};

export const extractMovieTitle = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Try to extract title after common phrases
  const watchRegex = /(?:want to |like to |to )?(watch|see) (?:the |a |an )?(.+?)(?:\s|$|\.|\?)/i;
  const watchMatch = text.match(watchRegex);
  
  if (watchMatch && watchMatch[2]) {
    return watchMatch[2].trim();
  }
  
  // Try to extract after "movie"
  const movieRegex = /(?:the |a |an )?(movie|film) (?:called |titled |named )?(.+?)(?:\s|$|\.|\?)/i;
  const movieMatch = text.match(movieRegex);
  
  if (movieMatch && movieMatch[2]) {
    return movieMatch[2].trim();
  }
  
  return '';
};

// Format price as currency
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};
