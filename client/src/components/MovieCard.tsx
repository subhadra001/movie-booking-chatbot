import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <motion.div 
      className="pl-10 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
        onClick={onClick}
      >
        <div className="flex">
          <img 
            src={movie.poster} 
            alt={`${movie.title} movie poster`} 
            className="movie-poster w-1/3 object-cover"
          />
          <div className="p-3 flex-1">
            <h3 className="font-ibm font-bold text-lg text-foreground">{movie.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
              <span>{movie.rating}</span>
              <span className="mx-2">|</span>
              <span>{movie.genres}</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{movie.duration}</p>
            <div className="mt-2">
              {(movie.formats as string[]).map((format, index) => (
                <span key={index} className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full ml-1 first:ml-0">
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
