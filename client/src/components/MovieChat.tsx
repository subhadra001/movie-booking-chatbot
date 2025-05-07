import { useRef, useEffect } from "react";
import { Film } from "lucide-react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import QuickActionButtons from "./QuickActionButtons";
import TypingIndicator from "./TypingIndicator";
import { useChat } from "@/hooks/useChat";
import MovieCard from "./MovieCard";
import ShowtimeSelector from "./ShowtimeSelector";
import TicketQuantitySelector from "./TicketQuantitySelector";
import SeatSelection from "./SeatSelection";
import BookingSummary from "./BookingSummary";
import TheaterInfo from "./TheaterInfo";

export default function MovieChat() {
  const { 
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
  } = useChat();
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat on new messages or typing status change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-white shadow-lg">
      {/* App Header */}
      <header className="bg-primary text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Film className="w-6 h-6 mr-2" />
          <h1 className="font-ibm font-bold text-xl">MovieChat</h1>
        </div>
      </header>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="chat-container flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Message Bubbles */}
        {messages.map((message, index) => (
          <div key={index}>
            <MessageBubble message={message} />
            
            {/* Display UI components based on message type */}
            {message.sender === 'agent' && message.type === 'movie_results' && (
              <>
                {message.data?.map((movie: any) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onClick={() => handleMovieSelect(movie)} 
                  />
                ))}
              </>
            )}
            
            {message.sender === 'agent' && message.type === 'showtime_results' && currentMovie && (
              <ShowtimeSelector 
                showtimes={message.data?.showtimes} 
                onSelect={handleShowtimeSelect} 
              />
            )}
            
            {message.sender === 'agent' && message.type === 'seat_selection' && (
              <TicketQuantitySelector onSelect={handleTicketQuantitySelect} />
            )}
            
            {message.sender === 'agent' && message.type === 'ticket_quantity' && ticketQuantity > 0 && (
              <SeatSelection 
                showtimeId={currentShowtime?.id} 
                quantity={ticketQuantity}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                onConfirm={handleSeatConfirm}
              />
            )}
            
            {message.sender === 'agent' && message.type === 'booking_confirmation' && (
              <>
                <BookingSummary 
                  movie={currentMovie} 
                  showtime={currentShowtime}
                  theater={currentTheater}
                  seats={selectedSeats}
                  ticketQuantity={ticketQuantity}
                />
                
                {currentTheater && (
                  <TheaterInfo theater={currentTheater} />
                )}
                
                <QuickActionButtons
                  options={[
                    { text: 'Find food nearby', onClick: () => sendMessage('Find food nearby') },
                    { text: 'Book another movie', onClick: () => sendMessage('Book another movie') },
                    { text: 'Theater amenities', onClick: () => sendMessage('Tell me about theater amenities') }
                  ]}
                />
              </>
            )}
            
            {message.sender === 'agent' && message.type === 'general' && index === 0 && (
              <QuickActionButtons
                options={[
                  { text: 'New releases', onClick: () => sendMessage('Show me new releases') },
                  { text: 'Popular movies', onClick: () => sendMessage('Show me popular movies') },
                  { text: 'Movies near me', onClick: () => sendMessage('Show movies near me') }
                ]}
              />
            )}
            
            {/* Show quick replies when available */}
            {message.sender === 'agent' && quickReplies.length > 0 && index === messages.length - 1 && !isTyping && (
              <QuickActionButtons options={quickReplies} />
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}
