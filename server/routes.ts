import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // Movies routes
  app.get(`${apiPrefix}/movies`, async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string | undefined;
      
      if (query) {
        const movies = await storage.searchMovies(query);
        return res.json(movies);
      }
      
      const movies = await storage.getMovies();
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get(`${apiPrefix}/movies/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const movie = await storage.getMovie(id);
      
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      
      res.json(movie);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Theaters routes
  app.get(`${apiPrefix}/theaters`, async (req: Request, res: Response) => {
    try {
      const theaters = await storage.getTheaters();
      res.json(theaters);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get(`${apiPrefix}/theaters/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const theater = await storage.getTheater(id);
      
      if (!theater) {
        return res.status(404).json({ message: "Theater not found" });
      }
      
      res.json(theater);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Showtimes routes
  app.get(`${apiPrefix}/showtimes`, async (req: Request, res: Response) => {
    try {
      const movieId = req.query.movieId ? parseInt(req.query.movieId as string) : undefined;
      const theaterId = req.query.theaterId ? parseInt(req.query.theaterId as string) : undefined;
      
      if (movieId) {
        const showtimes = await storage.getShowtimesByMovie(movieId);
        return res.json(showtimes);
      }
      
      if (theaterId) {
        const showtimes = await storage.getShowtimesByTheater(theaterId);
        return res.json(showtimes);
      }
      
      const showtimes = await storage.getShowtimes();
      res.json(showtimes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get(`${apiPrefix}/showtimes/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const showtime = await storage.getShowtime(id);
      
      if (!showtime) {
        return res.status(404).json({ message: "Showtime not found" });
      }
      
      res.json(showtime);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Seats routes
  app.get(`${apiPrefix}/seats`, async (req: Request, res: Response) => {
    try {
      const showtimeId = req.query.showtimeId ? parseInt(req.query.showtimeId as string) : undefined;
      
      if (!showtimeId) {
        return res.status(400).json({ message: "showtimeId query parameter is required" });
      }
      
      const seats = await storage.getSeats(showtimeId);
      res.json(seats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Booking routes
  app.post(`${apiPrefix}/bookings`, async (req: Request, res: Response) => {
    try {
      const { userId, showtimeId, seatIds, totalPrice } = req.body;
      
      // Validate required fields
      if (!showtimeId || !seatIds || !totalPrice) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Check if seats are available
      for (const seatId of seatIds) {
        const seat = await storage.getSeat(parseInt(seatId));
        if (!seat || !seat.isAvailable) {
          return res.status(400).json({ 
            message: `Seat ${seatId} is not available`,
            seatId
          });
        }
      }
      
      const booking = await storage.createBooking({
        userId,
        showtimeId,
        seatIds,
        totalPrice
      });
      
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get(`${apiPrefix}/bookings/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Search movies by title or genre
  app.get(`${apiPrefix}/search/movies`, async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: "Query parameter q is required" });
      }
      
      const movies = await storage.searchMovies(query);
      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Natural language processing endpoint for the chat interface
  app.post(`${apiPrefix}/chat`, async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Simple NLP to understand common user intents
      const lowerMessage = message.toLowerCase();
      
      // Check for "movies near me" query
      if (lowerMessage.includes("near me") || 
          (lowerMessage.includes("movie") && lowerMessage.includes("near")) ||
          (lowerMessage.includes("theater") && lowerMessage.includes("near"))) {
        
        const movies = await storage.getMovies();
        
        return res.json({
          type: "movie_results",
          message: "I found these movies playing at theaters near you:",
          data: movies.slice(0, 3)
        });
      }
      
      // Check for "new releases" query
      if (lowerMessage.includes("new releases") || 
          lowerMessage.includes("latest movies") ||
          lowerMessage.includes("just released")) {
        
        const movies = await storage.getMovies();
        // Sort by newest release year
        const sortedMovies = [...movies].sort((a, b) => b.releaseYear - a.releaseYear);
        
        return res.json({
          type: "movie_results",
          message: "Here are the latest movie releases:",
          data: sortedMovies.slice(0, 3)
        });
      }
      
      // Check for "popular movies" query
      if (lowerMessage.includes("popular movies") || 
          lowerMessage.includes("top movies") ||
          lowerMessage.includes("best movies")) {
        
        const movies = await storage.getMovies();
        
        return res.json({
          type: "movie_results",
          message: "Here are some popular movies in theaters now:",
          data: movies.slice(0, 3)
        });
      }
      
      // Check for movie browsing intent
      if (lowerMessage.includes("watch") || lowerMessage.includes("movie") || lowerMessage.includes("show")) {
        // Extract potential movie titles or genres
        let searchTerm = "";
        
        if (lowerMessage.includes("watch")) {
          const watchIndex = lowerMessage.indexOf("watch");
          searchTerm = lowerMessage.substring(watchIndex + 5).trim();
        } else if (lowerMessage.includes("movie")) {
          const movieIndex = lowerMessage.indexOf("movie");
          searchTerm = lowerMessage.substring(movieIndex + 5).trim();
        }
        
        // Clean up search term
        searchTerm = searchTerm.replace(/^(the|a|an) /, "").trim();
        
        if (searchTerm) {
          const movies = await storage.searchMovies(searchTerm);
          
          if (movies.length > 0) {
            return res.json({
              type: "movie_results",
              message: `Great choice! I found "${movies[0].title}" now showing in theaters near you.`,
              data: movies.slice(0, 3)
            });
          } else {
            return res.json({
              type: "no_results",
              message: `I couldn't find any movies matching "${searchTerm}". Would you like to browse popular movies instead?`
            });
          }
        } else {
          // Generic movie browsing response
          const movies = await storage.getMovies();
          
          return res.json({
            type: "movie_suggestions",
            message: "Here are some popular movies playing right now:",
            data: movies.slice(0, 3)
          });
        }
      }
      
      // Check for showtime selection intent
      if (lowerMessage.includes("time") || lowerMessage.includes("showtime") || 
          lowerMessage.includes("when") || lowerMessage.includes("showing")) {
        
        // Get the first movie as a default
        const movies = await storage.getMovies();
        const movie = movies[0];
        
        const showtimes = await storage.getShowtimesByMovie(movie.id);
        
        return res.json({
          type: "showtime_results",
          message: `Here are the showtimes for ${movie.title}:`,
          data: {
            movie,
            showtimes
          }
        });
      }
      
      // Check for seat selection intent
      if (lowerMessage.includes("seat") || lowerMessage.includes("ticket")) {
        return res.json({
          type: "seat_selection",
          message: "Great! How many tickets would you like?",
          data: {}
        });
      }
      
      // Handle specific ticket quantity
      const ticketMatch = lowerMessage.match(/(\d+)\s*(ticket|seat)/);
      if (ticketMatch) {
        const quantity = parseInt(ticketMatch[1]);
        
        return res.json({
          type: "ticket_quantity",
          message: `Perfect! Please select ${quantity} seats from the theater layout.`,
          data: { quantity }
        });
      }
      
      // Handle confirmation messages
      if (lowerMessage.includes("confirm") || lowerMessage.includes("book") || 
          lowerMessage.includes("yes") || lowerMessage.includes("great") || 
          lowerMessage.includes("perfect") || lowerMessage.includes("good")) {
        return res.json({
          type: "booking_confirmation",
          message: "Your tickets have been confirmed! You'll receive an email with the ticket QR codes. Enjoy the movie! 🎬 Is there anything else I can help you with?",
          data: {}
        });
      }
      
      // Default fallback response
      return res.json({
        type: "general",
        message: "I'm your movie booking assistant. You can ask me about movies, showtimes, or say 'book tickets' to get started.",
        data: {}
      });
      
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
