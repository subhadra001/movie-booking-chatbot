import {
  users, 
  movies, 
  theaters, 
  showtimes,
  seats,
  bookings,
  type User, 
  type InsertUser,
  type Movie,
  type InsertMovie,
  type Theater,
  type InsertTheater,
  type Showtime,
  type InsertShowtime,
  type Seat,
  type InsertSeat,
  type Booking,
  type InsertBooking
} from "@shared/schema";

export interface IStorage {
  // User Methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Movie Methods
  getMovies(): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  getMovieByTitle(title: string): Promise<Movie | undefined>;
  searchMovies(query: string): Promise<Movie[]>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  
  // Theater Methods
  getTheaters(): Promise<Theater[]>;
  getTheater(id: number): Promise<Theater | undefined>;
  createTheater(theater: InsertTheater): Promise<Theater>;
  
  // Showtime Methods
  getShowtimes(): Promise<Showtime[]>;
  getShowtimesByMovie(movieId: number): Promise<Showtime[]>;
  getShowtimesByTheater(theaterId: number): Promise<Showtime[]>;
  getShowtime(id: number): Promise<Showtime | undefined>;
  createShowtime(showtime: InsertShowtime): Promise<Showtime>;
  
  // Seat Methods
  getSeats(showtimeId: number): Promise<Seat[]>;
  getSeat(id: number): Promise<Seat | undefined>;
  createSeat(seat: InsertSeat): Promise<Seat>;
  updateSeatAvailability(id: number, isAvailable: boolean): Promise<Seat>;
  
  // Booking Methods
  getBookings(): Promise<Booking[]>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private movies: Map<number, Movie>;
  private theaters: Map<number, Theater>;
  private showtimes: Map<number, Showtime>;
  private seats: Map<number, Seat>;
  private bookings: Map<number, Booking>;
  
  private userCurrentId: number;
  private movieCurrentId: number;
  private theaterCurrentId: number;
  private showtimeCurrentId: number;
  private seatCurrentId: number;
  private bookingCurrentId: number;

  constructor() {
    this.users = new Map();
    this.movies = new Map();
    this.theaters = new Map();
    this.showtimes = new Map();
    this.seats = new Map();
    this.bookings = new Map();
    
    this.userCurrentId = 1;
    this.movieCurrentId = 1;
    this.theaterCurrentId = 1;
    this.showtimeCurrentId = 1;
    this.seatCurrentId = 1;
    this.bookingCurrentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Movie Methods
  async getMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values());
  }
  
  async getMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }
  
  async getMovieByTitle(title: string): Promise<Movie | undefined> {
    return Array.from(this.movies.values()).find(
      (movie) => movie.title.toLowerCase() === title.toLowerCase(),
    );
  }
  
  async searchMovies(query: string): Promise<Movie[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.movies.values()).filter(
      (movie) => movie.title.toLowerCase().includes(lowercaseQuery) || 
                 movie.genres.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = this.movieCurrentId++;
    const movie: Movie = { ...insertMovie, id };
    this.movies.set(id, movie);
    return movie;
  }
  
  // Theater Methods
  async getTheaters(): Promise<Theater[]> {
    return Array.from(this.theaters.values());
  }
  
  async getTheater(id: number): Promise<Theater | undefined> {
    return this.theaters.get(id);
  }
  
  async createTheater(insertTheater: InsertTheater): Promise<Theater> {
    const id = this.theaterCurrentId++;
    const theater: Theater = { ...insertTheater, id };
    this.theaters.set(id, theater);
    return theater;
  }
  
  // Showtime Methods
  async getShowtimes(): Promise<Showtime[]> {
    return Array.from(this.showtimes.values());
  }
  
  async getShowtimesByMovie(movieId: number): Promise<Showtime[]> {
    return Array.from(this.showtimes.values()).filter(
      (showtime) => showtime.movieId === movieId
    );
  }
  
  async getShowtimesByTheater(theaterId: number): Promise<Showtime[]> {
    return Array.from(this.showtimes.values()).filter(
      (showtime) => showtime.theaterId === theaterId
    );
  }
  
  async getShowtime(id: number): Promise<Showtime | undefined> {
    return this.showtimes.get(id);
  }
  
  async createShowtime(insertShowtime: InsertShowtime): Promise<Showtime> {
    const id = this.showtimeCurrentId++;
    const showtime: Showtime = { ...insertShowtime, id };
    this.showtimes.set(id, showtime);
    return showtime;
  }
  
  // Seat Methods
  async getSeats(showtimeId: number): Promise<Seat[]> {
    return Array.from(this.seats.values()).filter(
      (seat) => seat.showtimeId === showtimeId
    );
  }
  
  async getSeat(id: number): Promise<Seat | undefined> {
    return this.seats.get(id);
  }
  
  async createSeat(insertSeat: InsertSeat): Promise<Seat> {
    const id = this.seatCurrentId++;
    const seat: Seat = { ...insertSeat, id };
    this.seats.set(id, seat);
    return seat;
  }
  
  async updateSeatAvailability(id: number, isAvailable: boolean): Promise<Seat> {
    const seat = this.seats.get(id);
    if (!seat) {
      throw new Error(`Seat with id ${id} not found`);
    }
    const updatedSeat = { ...seat, isAvailable };
    this.seats.set(id, updatedSeat);
    return updatedSeat;
  }
  
  // Booking Methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }
  
  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }
  
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingCurrentId++;
    const booking: Booking = { 
      ...insertBooking, 
      id,
      createdAt: new Date() 
    };
    this.bookings.set(id, booking);
    
    // Mark seats as unavailable
    const seatIds = insertBooking.seatIds;
    for (const seatId of seatIds) {
      await this.updateSeatAvailability(parseInt(seatId), false);
    }
    
    return booking;
  }
  
  // Initialize sample data
  private initializeData() {
    // Movies
    const movies: InsertMovie[] = [
      {
        title: "Avengers: The Final Chapter",
        poster: "https://images.unsplash.com/photo-1535666669445-e8c15cd2e7a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300",
        rating: "4.8/5",
        genres: "Action, Adventure",
        duration: "2h 45min",
        description: "The epic conclusion to the Avengers saga as our heroes face their greatest challenge yet.",
        releaseYear: 2023,
        formats: ["IMAX", "3D"]
      },
      {
        title: "The Dark Knight Returns",
        poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300",
        rating: "4.7/5",
        genres: "Action, Crime, Drama",
        duration: "2h 32min",
        description: "Batman comes out of retirement to battle a new threat to Gotham City.",
        releaseYear: 2023,
        formats: ["IMAX", "Dolby"]
      },
      {
        title: "Star Wars: New Horizons",
        poster: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300",
        rating: "4.5/5",
        genres: "Sci-Fi, Adventure",
        duration: "2h 20min",
        description: "A new adventure begins in a galaxy far far away.",
        releaseYear: 2023,
        formats: ["IMAX", "3D", "Dolby"]
      },
      {
        title: "Jurassic World: Extinction",
        poster: "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300",
        rating: "4.3/5",
        genres: "Action, Sci-Fi",
        duration: "2h 15min",
        description: "Dinosaurs face a new extinction event, and humans must decide whether to save them.",
        releaseYear: 2023,
        formats: ["IMAX", "3D"]
      },
      {
        title: "Eternal Sunshine",
        poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300",
        rating: "4.9/5",
        genres: "Romance, Drama",
        duration: "1h 55min",
        description: "A couple undergoes a procedure to erase memories of each other.",
        releaseYear: 2023,
        formats: ["Standard"]
      },
      {
        title: "Fast & Furious: Ultimate Race",
        poster: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300",
        rating: "4.2/5",
        genres: "Action, Crime",
        duration: "2h 10min",
        description: "The final race that will determine the fate of the world.",
        releaseYear: 2023,
        formats: ["IMAX", "4DX"]
      }
    ];
    
    movies.forEach(movie => {
      this.createMovie(movie);
    });
    
    // Theaters
    const theaters: InsertTheater[] = [
      {
        name: "Cineplex IMAX - Downtown",
        address: "123 Main Street, Downtown",
        phone: "(555) 123-4567",
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
      },
      {
        name: "Regal Cinema Plaza",
        address: "456 Broadway, Midtown",
        phone: "(555) 987-6543",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
      },
      {
        name: "AMC Sunset Theaters",
        address: "789 Sunset Blvd, Westside",
        phone: "(555) 456-7890",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
      }
    ];
    
    theaters.forEach(theater => {
      this.createTheater(theater);
    });
    
    // Showtimes
    const showtimes: InsertShowtime[] = [
      { movieId: 1, theaterId: 1, time: "10:30 AM", date: "2023-06-15" },
      { movieId: 1, theaterId: 1, time: "1:15 PM", date: "2023-06-15" },
      { movieId: 1, theaterId: 1, time: "4:45 PM", date: "2023-06-15" },
      { movieId: 1, theaterId: 1, time: "7:30 PM", date: "2023-06-15" },
      { movieId: 1, theaterId: 1, time: "10:15 PM", date: "2023-06-15" },
      { movieId: 2, theaterId: 1, time: "11:00 AM", date: "2023-06-15" },
      { movieId: 2, theaterId: 1, time: "2:30 PM", date: "2023-06-15" },
      { movieId: 2, theaterId: 1, time: "6:00 PM", date: "2023-06-15" },
      { movieId: 3, theaterId: 2, time: "12:15 PM", date: "2023-06-15" },
      { movieId: 3, theaterId: 2, time: "3:30 PM", date: "2023-06-15" },
      { movieId: 3, theaterId: 2, time: "7:00 PM", date: "2023-06-15" },
      { movieId: 4, theaterId: 2, time: "1:45 PM", date: "2023-06-15" },
      { movieId: 4, theaterId: 2, time: "5:15 PM", date: "2023-06-15" },
      { movieId: 4, theaterId: 2, time: "8:45 PM", date: "2023-06-15" },
      { movieId: 5, theaterId: 3, time: "11:30 AM", date: "2023-06-15" },
      { movieId: 5, theaterId: 3, time: "2:00 PM", date: "2023-06-15" },
      { movieId: 5, theaterId: 3, time: "5:45 PM", date: "2023-06-15" },
      { movieId: 6, theaterId: 3, time: "12:45 PM", date: "2023-06-15" },
      { movieId: 6, theaterId: 3, time: "4:00 PM", date: "2023-06-15" },
      { movieId: 6, theaterId: 3, time: "9:15 PM", date: "2023-06-15" }
    ];
    
    showtimes.forEach(showtime => {
      this.createShowtime(showtime);
    });
    
    // Create seats for each showtime
    for (let showtimeId = 1; showtimeId <= showtimes.length; showtimeId++) {
      // Create 4 rows (A-D) with 7 seats each (1-7)
      const rows = ['A', 'B', 'C', 'D'];
      
      rows.forEach(row => {
        for (let number = 1; number <= 7; number++) {
          // Randomly mark some seats as unavailable for realism
          const isAvailable = Math.random() > 0.2;
          
          const seat: InsertSeat = {
            showtimeId,
            row,
            number,
            isAvailable
          };
          
          this.createSeat(seat);
        }
      });
    }
  }
}

export const storage = new MemStorage();
