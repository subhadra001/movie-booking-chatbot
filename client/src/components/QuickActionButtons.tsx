import { motion } from "framer-motion";

interface QuickOption {
  text: string;
  onClick: () => void;
}

interface QuickActionButtonsProps {
  options: QuickOption[];
}

export default function QuickActionButtons({ options }: QuickActionButtonsProps) {
  return (
    <motion.div 
      className="pl-10 space-y-2 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={option.onClick}
            className="bg-white border border-primary text-primary px-3 py-1.5 rounded-full text-sm hover:bg-primary hover:text-white transition"
          >
            {option.text}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
