import { motion } from "framer-motion";
import { Theater } from "@/types";
import { MapPin, Phone, Navigation, Info } from "lucide-react";

interface TheaterInfoProps {
  theater: Theater;
}

export default function TheaterInfo({ theater }: TheaterInfoProps) {
  return (
    <motion.div 
      className="pl-10 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <img 
          src={theater.image} 
          alt={`${theater.name} interior`} 
          className="w-full h-32 object-cover"
        />
        <div className="p-3">
          <h3 className="font-ibm font-bold text-base text-foreground">{theater.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <MapPin className="w-4 h-4 text-primary mr-1" />
            <span>{theater.address}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 text-primary mr-1" />
            <span>{theater.phone}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <button className="bg-white border border-primary text-primary px-3 py-1 rounded-md text-xs flex items-center">
              <Navigation className="w-3 h-3 mr-1" /> Directions
            </button>
            <button className="bg-white border border-primary text-primary px-3 py-1 rounded-md text-xs flex items-center">
              <Info className="w-3 h-3 mr-1" /> More Info
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
