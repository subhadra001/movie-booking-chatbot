import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Seat } from "@/types";
import { Loader2 } from "lucide-react";

interface SeatSelectionProps {
  showtimeId?: number;
  quantity: number;
  selectedSeats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  onConfirm: () => void;
}

export default function SeatSelection({ 
  showtimeId, 
  quantity,
  selectedSeats,
  onSeatSelect,
  onConfirm
}: SeatSelectionProps) {
  const [seatGrid, setSeatGrid] = useState<Record<string, Seat[]>>({});
  const [rows, setRows] = useState<string[]>([]);

  const { data: seats, isLoading } = useQuery({
    queryKey: [`/api/seats?showtimeId=${showtimeId}`],
    enabled: !!showtimeId
  });

  // Organize seats into a grid by row
  useEffect(() => {
    if (seats && Array.isArray(seats)) {
      const grid: Record<string, Seat[]> = {};
      const rowList: string[] = [];

      seats.forEach((seat: Seat) => {
        if (!grid[seat.row]) {
          grid[seat.row] = [];
          rowList.push(seat.row);
        }
        grid[seat.row].push(seat);
      });

      // Sort rows alphabetically
      rowList.sort();

      // Sort seats by number within each row
      Object.keys(grid).forEach(row => {
        grid[row].sort((a, b) => a.number - b.number);
      });

      setSeatGrid(grid);
      setRows(rowList);
    }
  }, [seats]);

  const isSeatSelected = (seat: Seat) => {
    return selectedSeats.some(s => s.id === seat.id);
  };

  if (isLoading) {
    return (
      <div className="pl-10 mb-4 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div 
      className="pl-10 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-lg p-4 shadow-md">
        {/* Screen */}
        <div className="w-full h-8 bg-gray-300 rounded-t-3xl mb-6 flex items-center justify-center">
          <span className="text-xs text-gray-600 font-medium">SCREEN</span>
        </div>

        {/* Seat grid */}
        <div className="grid grid-cols-8 gap-2 mb-6">
          {/* Empty top-left corner */}
          <div></div>

          {/* Column numbers */}
          {Array.from({ length: 7 }, (_, i) => i + 1).map(num => (
            <div key={`col-${num}`} className="text-xs text-gray-500 flex items-center justify-center">
              {num}
            </div>
          ))}

          {/* Rows with seats */}
          {rows.map(row => (
            <div key={`row-${row}`} className="contents">
              {/* Row label */}
              <div className="text-xs text-gray-500 flex items-center justify-center">
                {row}
              </div>

              {/* Seats in this row */}
              {seatGrid[row]?.map(seat => (
                <div 
                  key={seat.id}
                  onClick={() => seat.isAvailable && selectedSeats.length < quantity && onSeatSelect(seat)}
                  className={`
                    seat w-6 h-6 rounded-t-md flex items-center justify-center text-xs cursor-pointer
                    ${!seat.isAvailable ? 'seat-unavailable bg-gray-400 text-gray-600' : 
                      isSeatSelected(seat) ? 'seat-selected bg-primary text-white' : 
                      'bg-gray-200 hover:bg-primary/20'}
                  `}
                >
                  {seat.number}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-600 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded-sm mr-1"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-primary rounded-sm mr-1"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded-sm mr-1"></div>
            <span>Unavailable</span>
          </div>
        </div>

        {/* Confirm button */}
        <div className="text-center">
          <button 
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${selectedSeats.length === quantity 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
            `}
            disabled={selectedSeats.length !== quantity}
            onClick={onConfirm}
          >
            Confirm Seats: {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
