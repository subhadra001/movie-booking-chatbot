// Message Types
export interface MessageType {
  text: string;
  sender: 'user' | 'agent';
  type: string;
  data?: any;
}

// API Data Types
export interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: string;
  genres: string;
  duration: string;
  description: string;
  releaseYear: number;
  formats: string[];
}

export interface Theater {
  id: number;
  name: string;
  address: string;
  image: string;
  phone: string;
}

export interface Showtime {
  id: number;
  movieId: number;
  theaterId: number;
  time: string;
  date: string;
}

export interface Seat {
  id: number;
  showtimeId: number;
  row: string;
  number: number;
  isAvailable: boolean;
}

export interface Booking {
  id: number;
  userId?: number;
  showtimeId: number;
  seatIds: string[];
  totalPrice: number;
  createdAt: Date;
}
