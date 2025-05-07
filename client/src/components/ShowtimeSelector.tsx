import { motion } from "framer-motion";
import { Showtime } from "@/types";

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  onSelect: (showtime: Showtime) => void;
}

export default function ShowtimeSelector({ showtimes, onSelect }: ShowtimeSelectorProps) {
  return (
    <motion.div 
      className="pl-10 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h4 className="text-sm font-medium text-gray-700 mb-2">Select a showtime for today:</h4>
      <div className="flex flex-wrap gap-2">
        {showtimes?.map((showtime) => (
          <button
            key={showtime.id}
            className="bg-white border border-gray-300 hover:border-primary text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => onSelect(showtime)}
          >
            {showtime.time}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
