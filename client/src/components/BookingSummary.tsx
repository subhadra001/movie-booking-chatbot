import { motion } from "framer-motion";
import { Movie, Showtime, Theater, Seat } from "@/types";
import { CheckCircle, QrCode, Share2 } from "lucide-react";

interface BookingSummaryProps {
  movie?: Movie;
  showtime?: Showtime;
  theater?: Theater;
  seats: Seat[];
  ticketQuantity: number;
}

export default function BookingSummary({ 
  movie, 
  showtime, 
  theater,
  seats,
  ticketQuantity
}: BookingSummaryProps) {
  // Calculate total price - $12.50 per ticket + $2.50 booking fee
  const ticketPrice = 12.50;
  const bookingFee = 2.50;
  const totalPrice = (ticketPrice * ticketQuantity) + bookingFee;
  
  // Format date to display nicely
  const formatDate = () => {
    if (!showtime) {
      // Use today's date if showtime is not available
      const today = new Date();
      return `Today, ${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;
    }
    
    const date = new Date(showtime.date);
    const now = new Date();
    
    // Check if the date is today
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
    }
    
    // Format date normally
    return `${date.toLocaleString('default', { weekday: 'long' })}, ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  return (
    <motion.div 
      className="pl-10 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-primary">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-ibm font-bold text-base text-foreground">Booking Summary</h3>
          <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full font-medium flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            CONFIRMED
          </span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Movie:</span>
            <span className="font-medium">{movie?.title || 'Movie Title'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{showtime?.time || '4:45 PM'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Theater:</span>
            <span className="font-medium">{theater?.name || 'Cineplex IMAX - Downtown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Seats:</span>
            <span className="font-medium">
              {seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tickets:</span>
            <span className="font-medium">{ticketQuantity} × Adult</span>
          </div>
          
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Tickets ({ticketQuantity} × ${ticketPrice.toFixed(2)})</span>
              <span>${(ticketQuantity * ticketPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Booking Fee</span>
              <span>${bookingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium mt-1">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <button className="bg-white border border-primary text-primary px-3 py-1.5 rounded-md text-sm flex items-center">
            <QrCode className="w-4 h-4 mr-1" /> View Tickets
          </button>
          <button className="bg-white border border-primary text-primary px-3 py-1.5 rounded-md text-sm flex items-center">
            <Share2 className="w-4 h-4 mr-1" /> Share
          </button>
        </div>
      </div>
    </motion.div>
  );
}
