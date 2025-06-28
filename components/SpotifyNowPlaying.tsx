"use client";

import { useEffect, useState } from "react";
import { Music } from "lucide-react";

type SpotifyData = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  songUrl?: string;
};

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch the Spotify data
    const fetchSpotifyData = async () => {
      try {
        const response = await fetch("/api/spotify/now-playing");
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
        setLoading(false);
      }
    };

    // Fetch initially
    fetchSpotifyData();

    // Refresh every 30 seconds
    const intervalId = setInterval(fetchSpotifyData, 30000);

    // Clean up interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center text-xs">
      <Music className="w-4 h-4 mr-2" />
      {loading ? <span>Loading...</span> : data?.isPlaying
        ? (
          <a
            href={data.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline overflow-hidden"
            style={{ maxWidth: "calc(100% - 24px)" }}
          >
            <div className="flex flex-col" style={{ width: "100%" }}>
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "93%",
                }}
              >
                {data.title}
              </span>
              <span className="text-xs opacity-80">
                by {data.artist}
              </span>
            </div>
          </a>
        )
        : (
          <span>
            Not listening to anything<br />I might be Away..💤
          </span>
        )}
    </div>
  );
}
