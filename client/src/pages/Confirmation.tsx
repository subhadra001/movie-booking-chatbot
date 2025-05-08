import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Movie, Showtime, Theater, Seat } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Download, Share2, Calendar, Clock, MapPin, CreditCard, QrCode } from 'lucide-react';

export default function Confirmation() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/confirmation/:bookingId');
  const bookingId = params?.bookingId ? parseInt(params.bookingId) : undefined;
  const [showQR, setShowQR] = useState(false);

  const { data: booking, isLoading: isLoadingBooking } = useQuery({
    queryKey: ['/api/bookings', bookingId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!bookingId
  });

  const { data: movie, isLoading: isLoadingMovie } = useQuery({
    queryKey: ['/api/movies', booking?.movieId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!booking?.movieId
  });

  const { data: showtime, isLoading: isLoadingShowtime } = useQuery({
    queryKey: ['/api/showtimes', booking?.showtimeId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!booking?.showtimeId
  });

  const { data: theater, isLoading: isLoadingTheater } = useQuery({
    queryKey: ['/api/theaters', showtime?.theaterId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!showtime?.theaterId
  });

  const { data: seats, isLoading: isLoadingSeats } = useQuery({
    queryKey: ['/api/seats', `showtimeId=${booking?.showtimeId}`],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!booking?.showtimeId
  });

  const selectedSeats = seats?.filter(seat => 
    booking?.seatIds.includes(seat.id.toString())
  ) || [];

  const isLoading = isLoadingBooking || isLoadingMovie || isLoadingShowtime || isLoadingTheater || isLoadingSeats;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!booking || !movie || !showtime || !theater) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <p className="mb-6">Sorry, we couldn't find the booking confirmation you're looking for.</p>
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
    const date = new Date(showtime.date);
    return `${date.toLocaleString('default', { weekday: 'long' })}, ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Generate booking reference
  const bookingReference = `BK${bookingId.toString().padStart(6, '0')}`;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8 mb-16">
      <button 
        onClick={() => setLocation('/')}
        className="mb-6 flex items-center text-gray-600 hover:text-primary"
      >
        <ArrowLeft size={16} className="mr-1" /> Return to Chat
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-6 text-white">
          <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
          <p className="opacity-90">Your tickets are ready. We've sent a copy to your email.</p>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          {/* Movie Info */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <img 
              src={movie.poster} 
              alt={movie.title}
              className="w-full md:w-32 h-48 md:h-auto object-cover rounded-md"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{movie.title}</h2>
              <p className="text-gray-500 text-sm mb-2">{movie.rating} • {movie.duration} • {movie.genres}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">DATE</p>
                    <p className="font-medium">{formatDate()}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">TIME</p>
                    <p className="font-medium">{showtime.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">THEATER</p>
                    <p className="font-medium">{theater.name}</p>
                    <p className="text-sm text-gray-500">{theater.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ticket Info */}
          <div className="my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Ticket Details</h3>
              <span className="text-primary font-medium text-sm">Booking Ref: {bookingReference}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">SEATS</p>
                <p className="font-medium">
                  {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">TICKETS</p>
                <p className="font-medium">{selectedSeats.length} × Adult</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">AMOUNT PAID</p>
                <p className="font-medium">{formatPrice(booking.totalPrice)}</p>
              </div>
            </div>
          </div>
          
          {/* QR Code */}
          <div 
            className="bg-gray-50 rounded-lg p-6 text-center cursor-pointer transition-all"
            onClick={() => setShowQR(!showQR)}
          >
            {showQR ? (
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg shadow-md inline-block mb-3">
                  {/* Simulated QR Code */}
                  <div className="w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzAgMjMwIj48cmVjdCB3aWR0aD0iMjMwIiBoZWlnaHQ9IjIzMCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0wLDBoNTB2NTBoLTUweiIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZmZmIi8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTE4MCwwaC01MHY1MGg1MHoiLz48cmVjdCB4PSIxOTAiIHk9IjEwIiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IiNmZmYiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMCwxODBoNTB2NTBoLTUweiIvPjxyZWN0IHg9IjEwIiB5PSIxOTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik03MCw3MGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTkwLDcwaDEwdjEwaC0xMHoiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEwLDcwaDEwdjEwaC0xMHoiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTMwLDcwaDEwdjEwaC0xMHoiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTUwLDcwaDEwdjEwaC0xMHoiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNNzAsOTBoMTB2MTBoLTEweiIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik05MCw5MGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTExMCw5MGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTEzMCw5MGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTE1MCw5MGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTcwLDExMGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTkwLDExMGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTExMCwxMTBoMTB2MTBoLTEweiIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0xMzAsMTEwaDEwdjEwaC0xMHoiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTUwLDExMGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTcwLDEzMGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTkwLDEzMGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTExMCwxMzBoMTB2MTBoLTEweiIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0xMzAsMTMwaDEwdjEwaC0xMHoiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTUwLDEzMGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTcwLDE1MGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTkwLDE1MGgxMHYxMGgtMTB6Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTExMCwxNTBoMTB2MTBoLTEweiIvPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0xMzAsMTUwaDEwdjEwaC0xMHoiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTUwLDE1MGgxMHYxMGgtMTB6Ii8+PC9zdmc+')]" />
                </div>
                <p className="text-sm text-gray-500">Show this QR code at the theater entrance</p>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <QrCode className="w-6 h-6 mr-2 text-gray-500" />
                <span className="font-medium">Click to view tickets QR code</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="bg-gray-50 p-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium">
              <Download className="w-4 h-4 mr-2" />
              Download Tickets
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
          
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
          >
            Book Another Movie
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Need assistance? Contact our support team at help@moviebooking.com</p>
        <p className="mt-2">© {new Date().getFullYear()} MovieTickets. All rights reserved.</p>
      </div>
    </div>
  );
}