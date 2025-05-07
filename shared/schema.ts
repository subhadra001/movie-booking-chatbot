import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Movies table
export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  poster: text("poster").notNull(),
  rating: text("rating").notNull(),
  genres: text("genres").notNull(),
  duration: text("duration").notNull(),
  description: text("description").notNull(),
  releaseYear: integer("release_year").notNull(),
  formats: jsonb("formats").notNull(),
});

export const insertMovieSchema = createInsertSchema(movies).omit({ id: true });

// Theaters table
export const theaters = pgTable("theaters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  image: text("image").notNull(),
  phone: text("phone").notNull(),
});

export const insertTheaterSchema = createInsertSchema(theaters).omit({ id: true });

// Showtimes table
export const showtimes = pgTable("showtimes", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").notNull(),
  theaterId: integer("theater_id").notNull(),
  time: text("time").notNull(),
  date: text("date").notNull(),
});

export const insertShowtimeSchema = createInsertSchema(showtimes).omit({ id: true });

// Seats table
export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  showtimeId: integer("showtime_id").notNull(),
  row: text("row").notNull(),
  number: integer("number").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const insertSeatSchema = createInsertSchema(seats).omit({ id: true });

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  showtimeId: integer("showtime_id").notNull(),
  seatIds: text("seat_ids").array().notNull(),
  totalPrice: integer("total_price").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;

export type Theater = typeof theaters.$inferSelect;
export type InsertTheater = z.infer<typeof insertTheaterSchema>;

export type Showtime = typeof showtimes.$inferSelect;
export type InsertShowtime = z.infer<typeof insertShowtimeSchema>;

export type Seat = typeof seats.$inferSelect;
export type InsertSeat = z.infer<typeof insertSeatSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
