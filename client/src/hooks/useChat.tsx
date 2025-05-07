import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { delay, extractMovieTitle } from '@/lib/utils';
import { MessageType, Movie, Theater, Showtime, Seat } from '@/types';

export function useChat() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      text: "👋 Hi there! I'm MovieBot, your movie booking assistant. What would you like to watch today?",
      sender: 'agent',
      type: 'general'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Booking state
  const [currentMovie, setCurrentMovie] = useState<Movie | undefined>();
  const [currentTheater, setCurrentTheater] = useState<Theater | undefined>();
  const [currentShowtime, setCurrentShowtime] = useState<Showtime | undefined>();
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  // Quick replies based on context
  const [quickReplies, setQuickReplies] = useState<{ text: string, onClick: () => void }[]>([]);
  
  // Chat API mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', { message });
      return response.json();
    },
    onSuccess: (data) => {
      handleBotResponse(data);
    }
  });
  
  // Add a user message to the chat
  const addUserMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, { text, sender: 'user', type: 'text' }]);
  }, []);
  
  // Add a bot message to the chat
  const addBotMessage = useCallback((text: string, type = 'text', data = {}) => {
    setMessages(prev => [...prev, { text, sender: 'agent', type, data }]);
  }, []);
  
  // Send a message to the chat API
  const sendMessage = useCallback(async (text: string) => {
    addUserMessage(text);
    setIsTyping(true);
    
    // Extract potential movie title for improving context
    const movieTitle = extractMovieTitle(text);
    
    // Add a small delay to simulate typing
    await delay(1000);
    
    chatMutation.mutate(text);
  }, [addUserMessage, chatMutation]);
  
  // Handle bot response from API
  const handleBotResponse = useCallback((data: any) => {
    setIsTyping(false);
    
    const { type, message, data: responseData } = data;
    
    addBotMessage(message, type, responseData);
    
    // Update app state based on response type
    switch (type) {
      case 'movie_results':
        if (responseData && responseData.length > 0) {
          setCurrentMovie(responseData[0]);
        }
        break;
        
      case 'showtime_results':
        if (responseData?.movie) {
          setCurrentMovie(responseData.movie);
        }
        break;
        
      case 'booking_confirmation':
        setBookingConfirmed(true);
        break;
    }
    
    // Set context-specific quick replies
    updateQuickReplies(type);
    
  }, [addBotMessage]);
  
  // Handle movie selection
  const handleMovieSelect = useCallback((movie: Movie) => {
    setCurrentMovie(movie);
    
    // Simulate user selecting the movie
    addUserMessage(`I'd like to watch ${movie.title}`);
    setIsTyping(true);
    
    // Simulate bot response with a delay
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(
        `Great choice! I found ${movie.title} now showing in theaters near you. Here are some showtimes:`,
        'showtime_results',
        {
          movie,
          showtimes: [
            { id: 1, movieId: movie.id, theaterId: 1, time: "10:30 AM", date: new Date().toISOString().split('T')[0] },
            { id: 2, movieId: movie.id, theaterId: 1, time: "1:15 PM", date: new Date().toISOString().split('T')[0] },
            { id: 3, movieId: movie.id, theaterId: 1, time: "4:45 PM", date: new Date().toISOString().split('T')[0] },
            { id: 4, movieId: movie.id, theaterId: 1, time: "7:30 PM", date: new Date().toISOString().split('T')[0] },
            { id: 5, movieId: movie.id, theaterId: 1, time: "10:15 PM", date: new Date().toISOString().split('T')[0] }
          ]
        }
      );
    }, 1000);
  }, [addUserMessage, addBotMessage]);
  
  // Handle showtime selection
  const handleShowtimeSelect = useCallback((showtime: Showtime) => {
    setCurrentShowtime(showtime);
    
    // Fetch theater information
    fetch(`/api/theaters/1`)
      .then(res => res.json())
      .then(theater => {
        setCurrentTheater(theater);
      });
    
    // Simulate user selecting the showtime
    addUserMessage(`I'll take the ${showtime.time} show`);
    setIsTyping(true);
    
    // Simulate bot response with a delay
    setTimeout(() => {
      setIsTyping(false);
      if (currentMovie) {
        addBotMessage(
          `Perfect! Now, let's pick seats for ${currentMovie.title} at ${showtime.time}. How many tickets would you like?`,
          'seat_selection',
          {}
        );
      }
    }, 1000);
  }, [addUserMessage, addBotMessage, currentMovie]);
  
  // Handle ticket quantity selection
  const handleTicketQuantitySelect = useCallback((quantity: number) => {
    setTicketQuantity(quantity);
    
    // Simulate user selecting the quantity
    addUserMessage(`${quantity} tickets please`);
    setIsTyping(true);
    
    // Simulate bot response with a delay
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(
        `Great! Please select ${quantity} seats from the theater layout below:`,
        'ticket_quantity',
        { quantity }
      );
    }, 1000);
  }, [addUserMessage, addBotMessage]);
  
  // Handle seat selection
  const handleSeatSelect = useCallback((seat: Seat) => {
    setSelectedSeats(prev => {
      // If already selected, remove it
      if (prev.some(s => s.id === seat.id)) {
        return prev.filter(s => s.id !== seat.id);
      }
      
      // If we've reached the ticket quantity, don't add more
      if (prev.length >= ticketQuantity) {
        return prev;
      }
      
      // Add the new seat
      return [...prev, seat];
    });
  }, [ticketQuantity]);
  
  // Handle seat confirmation
  const handleSeatConfirm = useCallback(() => {
    // Simulate user confirming seats
    addUserMessage(`Those seats look perfect!`);
    setIsTyping(true);
    
    // Simulate bot response with a delay
    setTimeout(() => {
      setIsTyping(false);
      setBookingConfirmed(true);
      addBotMessage(
        `Great! Here's your booking summary:`,
        'booking_confirmation',
        {}
      );
    }, 1000);
  }, [addUserMessage, addBotMessage]);
  
  // Handle booking confirmation
  const handleBookingConfirm = useCallback(() => {
    setBookingConfirmed(true);
  }, []);
  
  // Update quick replies based on context
  const updateQuickReplies = useCallback((messageType: string) => {
    switch (messageType) {
      case 'general':
        setQuickReplies([
          { text: 'Show new releases', onClick: () => sendMessage('Show me new releases') },
          { text: 'Popular movies', onClick: () => sendMessage('Show me popular movies') },
          { text: 'Movies near me', onClick: () => sendMessage('Show movies near me') }
        ]);
        break;
        
      case 'movie_results':
        setQuickReplies([
          { text: 'Show showtimes', onClick: () => sendMessage('Show showtimes') },
          { text: 'Movie details', onClick: () => sendMessage('Tell me more about this movie') },
          { text: 'Find another movie', onClick: () => sendMessage('I want to see something else') }
        ]);
        break;
        
      case 'showtime_results':
        setQuickReplies([
          { text: 'Book tickets', onClick: () => sendMessage('I want to book tickets') },
          { text: 'Theater details', onClick: () => sendMessage('Tell me about the theater') },
          { text: 'Different movie', onClick: () => sendMessage('Show me other movies') }
        ]);
        break;
        
      case 'booking_confirmation':
        setQuickReplies([
          { text: 'Find food nearby', onClick: () => sendMessage('Find food nearby') },
          { text: 'Book another movie', onClick: () => sendMessage('Book another movie') },
          { text: 'Theater amenities', onClick: () => sendMessage('Tell me about theater amenities') }
        ]);
        break;
        
      default:
        setQuickReplies([]);
    }
  }, [sendMessage]);
  
  return {
    messages,
    isTyping,
    sendMessage,
    currentMovie,
    currentTheater,
    currentShowtime,
    ticketQuantity,
    selectedSeats,
    bookingConfirmed,
    quickReplies,
    handleMovieSelect,
    handleShowtimeSelect,
    handleTicketQuantitySelect,
    handleSeatSelect,
    handleSeatConfirm,
    handleBookingConfirm
  };
}
