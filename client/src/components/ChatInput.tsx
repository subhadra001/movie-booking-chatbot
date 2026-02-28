import { useState, FormEvent, KeyboardEvent } from "react";
import { Paperclip, Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="flex items-center w-full bg-[hsl(var(--input-bg))] rounded-full px-4 py-2">
          <button type="button" className="text-gray-500 mr-2">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="bg-transparent border-none flex-1 focus:outline-none font-inter text-sm"
            autoComplete="off"
          />
          <button
            type="submit"
            className="ml-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
