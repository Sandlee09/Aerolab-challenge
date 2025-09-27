"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game, SearchResult } from "@/types/game";
import { getImageUrl } from "@/lib/igdb";
import { formatDate, getYearsAgo, createSlug } from "@/lib/utils";
import { useGameCollection } from "@/hooks/useGameCollection";
import { GameCard } from "./GameCard";
import { SearchInput } from "./SearchInput";
import {
  Star,
  Calendar,
  Gamepad2,
  Plus,
  Check,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface GameDetailContentProps {
  game: Game;
  similarGames: SearchResult[];
}

export function GameDetailContent({
  game,
  similarGames,
}: GameDetailContentProps) {
  const { theme } = useTheme();
  const { addGame, removeGame, isInCollection, isClient } = useGameCollection();
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const isCollected = isClient ? isInCollection(game.id) : false;
  const coverUrl = game.cover
    ? getImageUrl(game.cover.image_id, "cover_big")
    : null;
  const screenshots = game.screenshots || [];

  const handleCollectionToggle = () => {
    if (!isClient) return;

    if (isCollected) {
      removeGame(game.id);
      setShowNotification("Removed from collection");
    } else {
      addGame(game);
      setShowNotification("Added to collection");
    }

    // Hide notification after 3 seconds
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleGameSelect = (selectedGame: SearchResult) => {
    const slug = createSlug(selectedGame.name);
    window.location.href = `/game/${selectedGame.id}/${slug}`;
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Collection
      </Link>

      {/* Game Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Cover */}
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-lg">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={game.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">
                  No cover available
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-theme mb-4">{game.name}</h1>

            {/* Rating */}
            {game.rating && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < Math.floor(game.rating! / 20)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      )}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {Math.round(game.rating / 10) / 10}/10
                </span>
                {game.rating_count && (
                  <span className="text-gray-500 dark:text-gray-400">
                    ({game.rating_count.toLocaleString()} ratings)
                  </span>
                )}
              </div>
            )}

            {/* Release Date */}
            {game.first_release_date && (
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(game.first_release_date)}</span>
                <span>•</span>
                <span>{getYearsAgo(game.first_release_date)}</span>
              </div>
            )}

            {/* Platforms */}
            {game.platforms && game.platforms.length > 0 && (
              <div className="flex items-center space-x-2 mb-6">
                <Gamepad2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map((platform) => (
                    <span
                      key={platform.id}
                      className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-theme  rounded-full text-sm"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Collection Button */}
            <button
              onClick={handleCollectionToggle}
              disabled={!isClient}
              className={cn(
                "cursor-pointer inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105",
                isCollected
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : `bg-gradient-to-r ${
                      theme === "dark" ? "light" : "dark"
                    } from-primary-500 to-secondary-600 inverted-text-theme hover:from-primary-600 hover:to-secondary-700`,
                !isClient && "opacity-50 cursor-not-allowed"
              )}
            >
              {isCollected ? (
                <>
                  <Trash2 className="w-5 h-5 mr-2" />
                  Remove from Collection
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Collection
                </>
              )}
            </button>
          </div>

          {/* Summary */}
          {game.summary && (
            <div>
              <h2 className="text-2xl font-bold text-theme mb-4">About</h2>
              <p className="text-gray-theme leading-relaxed">{game.summary}</p>
            </div>
          )}
        </div>
      </div>

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-theme mb-6">Screenshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshots.map((screenshot, index) => (
              <div
                key={screenshot.id}
                className="aspect-video relative overflow-hidden rounded-lg cursor-pointer group"
              >
                <Image
                  src={getImageUrl(screenshot.image_id, "screenshot_big")}
                  alt={`${game.name} screenshot ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Games */}
      {similarGames.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-theme mb-6">Similar Games</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarGames.map((similarGame) => (
              <GameCard key={similarGame.id} game={similarGame} />
            ))}
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>{showNotification}</span>
          </div>
        </div>
      )}
    </div>
  );
}
