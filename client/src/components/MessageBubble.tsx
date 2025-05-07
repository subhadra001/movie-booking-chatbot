import { motion } from "framer-motion";
import { MessageType } from "@/types";
import { User, Bot } from "lucide-react";

interface MessageBubbleProps {
  message: MessageType;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { sender, text } = message;
  
  if (sender === "user") {
    return (
      <motion.div 
        className="flex items-end justify-end mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="user-bubble relative max-w-[80%] bg-[hsl(var(--bubble-user))] p-3 rounded-t-lg rounded-bl-lg">
          <p className="font-inter text-sm text-foreground">{text}</p>
        </div>
        <div className="w-8 h-8 ml-2 rounded-full bg-secondary flex items-center justify-center text-white flex-shrink-0">
          <User className="w-4 h-4" />
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="flex items-end mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="agent-bubble relative max-w-[80%] bg-primary text-white p-3 rounded-t-lg rounded-br-lg">
        <p className="font-inter text-sm">{text}</p>
      </div>
    </motion.div>
  );
}
