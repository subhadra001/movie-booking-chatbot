# Movie Booking Chatbot

A conversational movie ticket booking web application that allows users to discover movies, select showtimes, reserve seats, and generate a digital ticket through a chat interface.

## Application Preview

<p align="center"> <img src="images/start_chat.png" width="190"> <img src="images/show_movies.png" width="190"> <img src="images/select_timing.png" width="190"> <img src="images/select_seat.png" width="190"> <img src="images/ticket.png" width="190"> </p>

## Features
- Natural language chat interface for movie queries
- Browse new releases and popular movies
- Theater and showtime selection
- Interactive seat booking system
- Booking confirmation with QR code ticket

## Tech Stack
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- Language: TypeScript / JavaScript
- API Communication: REST APIs

## How It Works

The system follows a client–server architecture.

- The React frontend provides a chat interface where users interact with the MovieBot.
- User messages are sent to the Express backend through REST APIs.
- The backend processes the conversation state and determines the next booking step.
- Based on the state, the server returns structured responses (movie list, showtimes, seat layout, confirmation).
- Seat selection and ticket confirmation are handled server-side to maintain booking consistency.

The chatbot works as a task-oriented conversational agent that guides the user step-by-step through the movie booking process.

## Running Locally

1. Install Node.js (v20 recommended)

2. Install dependencies
   npm install

3. Start backend server
   npx tsx server/index.ts

4. Start frontend
   npx vite

5. Open in browser
   http://localhost:5173

## Project Structure
client/ → React frontend (chat UI)  
server/ → Express backend (APIs & booking logic)  
shared/ → shared schemas and types

## Future Improvements

- Integrate a real movie database API (TMDB)
- Add payment gateway integration
- Store bookings in a real database (MongoDB/PostgreSQL)
- Add user authentication and booking history
- Improve NLP using an LLM or intent classification model