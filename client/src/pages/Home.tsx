import { useEffect } from "react";
import { Helmet } from "react-helmet";
import MovieChat from "@/components/MovieChat";

export default function Home() {
  // Set primary color for status bar on mobile
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#6C63FF'; // Primary color
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>MovieChat - Book Movie Tickets through Chat</title>
        <meta name="description" content="Book movie tickets easily through a natural conversation with MovieChat - your AI-powered movie booking assistant." />
      </Helmet>
      <div className="bg-background min-h-screen">
        <MovieChat />
      </div>
    </>
  );
}
