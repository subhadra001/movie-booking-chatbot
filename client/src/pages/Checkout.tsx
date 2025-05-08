import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import PaymentForm from '@/components/PaymentForm';
import { Movie, Showtime, Theater, Seat } from '@/types';
import { apiRequest, getQueryFn } from '@/lib/queryClient';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Ticket, Calendar, Clock, MapPin, Users, Check } from 'lucide-react';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/checkout/:bookingId');
  const bookingId = params?.bookingId ? parseInt(params.bookingId) : undefined;
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { toast } = useToast();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['/api/bookings', bookingId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!bookingId
  });

  const { data: movie } = useQuery({
    queryKey: ['/api/movies', booking?.movieId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!booking?.movieId
  });

  const { data: showtime } = useQuery({
    queryKey: ['/api/showtimes', booking?.showtimeId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!booking?.showtimeId
  });

  const { data: theater } = useQuery({
    queryKey: ['/api/theaters', showtime?.theaterId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!showtime?.theaterId
  });

  const { data: seats } = useQuery({
    queryKey: ['/api/seats', `showtimeId=${booking?.showtimeId}`],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!booking?.showtimeId
  });

  const selectedSeats = seats?.filter(seat => 
    booking?.seatIds.includes(seat.id.toString())
  ) || [];

  const handlePaymentComplete = async () => {
    // Update booking status
    try {
      await apiRequest('PATCH', `/api/bookings/${bookingId}/complete`, {});
      setPaymentComplete(true);
      
      // Show success toast
      toast({
        title: "Payment Complete!",
        description: "Your tickets have been confirmed and sent to your email.",
      });
      
      // Redirect to confirmation after 3 seconds
      setTimeout(() => {
        setLocation(`/confirmation/${bookingId}`);
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not complete booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <p className="mb-6">Sorry, we couldn't find the booking you're looking for.</p>
          <button 
            onClick={() => setLocation('/')}
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = () => {
    if (!showtime) return 'Today';
    
    const date = new Date(showtime.date);
    return `${date.toLocaleString('default', { weekday: 'long' })}, ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-8">
      <button 
        onClick={() => setLocation('/')}
        className="mb-6 flex items-center text-gray-600 hover:text-primary"
      >
        <ArrowLeft size={16} className="mr-1" /> Return to Chat
      </button>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            {movie && (
              <div className="flex gap-4 mb-6">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-24 h-36 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-bold text-lg">{movie.title}</h3>
                  <p className="text-sm text-gray-500">{movie.rating} • {movie.duration}</p>
                  <p className="text-sm text-gray-500">{movie.genres}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Showtime</p>
                  <p className="font-medium">{showtime?.time || '—'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Theater</p>
                  <p className="font-medium">{theater?.name || '—'}</p>
                  <p className="text-sm text-gray-500">{theater?.address || '—'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Ticket className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-medium">
                    {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ') || '—'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Tickets</p>
                  <p className="font-medium">{selectedSeats.length} × Adult</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Tickets ({selectedSeats.length} × $12.50)</span>
                <span>{formatPrice(12.50 * selectedSeats.length)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Booking Fee</span>
                <span>{formatPrice(2.50)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(booking.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {paymentComplete ? 'Payment Complete' : 'Payment Details'}
          </h2>
          
          {paymentComplete ? (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-center text-gray-600 mb-4">
                Your booking has been confirmed and your tickets have been sent to your email.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you to the confirmation page...
              </p>
            </div>
          ) : (
            <PaymentForm 
              amount={booking.totalPrice / 100} // Convert cents to dollars
              bookingId={bookingId!}
              onPaymentComplete={handlePaymentComplete} 
            />
          )}
        </div>
      </div>
    </div>
  );
}