import { motion } from "framer-motion";

interface TicketQuantitySelectorProps {
  onSelect: (quantity: number) => void;
}

export default function TicketQuantitySelector({ onSelect }: TicketQuantitySelectorProps) {
  const quantities = [1, 2, 3, 4, 5];
  
  return (
    <motion.div 
      className="pl-10 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap gap-2">
        {quantities.map((quantity) => (
          <button
            key={quantity}
            className="bg-white border border-gray-300 hover:border-primary text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => onSelect(quantity)}
          >
            {quantity} {quantity === 1 ? 'ticket' : 'tickets'}
          </button>
        ))}
        <button
          className="bg-white border border-gray-300 hover:border-primary text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          onClick={() => onSelect(6)}
        >
          5+ tickets
        </button>
      </div>
    </motion.div>
  );
}
