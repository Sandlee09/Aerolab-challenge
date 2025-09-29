"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Game, SearchResult } from "@/types/game";
import { getImageUrl } from "@/lib/igdb";
import { formatDate, getYearsAgo } from "@/lib/utils";
import { useGameCollection } from "@/hooks/useGameCollection";
import { GameCard } from "./GameCard";
import { Star, Calendar, Gamepad2, Plus, Minus, Play } from "lucide-react";
import { ImageGallery } from "./ImageGallery";
import { cn } from "@/lib/utils";

interface GameDetailContentProps {
  game: Game;
  similarGames: SearchResult[];
}

export function GameDetailContent({
  game,
  similarGames,
}: GameDetailContentProps) {
  const { addGame, removeGame, isInCollection, isClient } = useGameCollection();
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

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

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return "text-green-500";
    if (rating >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 80) return "Excellent";
    if (rating >= 60) return "Good";
    return "Fair";
  };

  return (
    <>
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2">
          {showNotification}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Cover Image */}
          <div className="lg:col-span-1">
            <div className="relative group">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={game.name}
                  width={400}
                  height={600}
                  className="w-full h-auto rounded-xl shadow-2xl"
                  priority
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-16 h-16 text-gray-400" />
                </div>
              )}

              {/* Collection Button */}
              <button
                onClick={handleCollectionToggle}
                className={cn(
                  "absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all transform hover:scale-105",
                  isCollected
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-pink-500 hover:bg-pink-600 text-white"
                )}
                title={
                  isCollected ? "Remove from collection" : "Add to collection"
                }
              >
                {isCollected ? (
                  <Minus className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Game Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-theme mb-2">
                {game.name}
              </h1>
              {game.first_release_date && (
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(game.first_release_date)}</span>
                  <span className="ml-2 text-sm">
                    ({getYearsAgo(game.first_release_date)} years ago)
                  </span>
                </div>
              )}
            </div>

            {/* Rating */}
            {game.rating && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold text-theme">
                    {Math.round(game.rating)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    / 100
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={cn("font-medium", getRatingColor(game.rating))}
                  >
                    {getRatingLabel(game.rating)}
                  </span>
                  {game.rating_count && (
                    <span className="text-sm text-gray-500">
                      ({game.rating_count.toLocaleString()} ratings)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Platforms */}
            {game.platforms && game.platforms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-theme mb-3">
                  Platforms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map((platform) => (
                    <span
                      key={platform.id}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {game.summary && (
              <div>
                <h3 className="text-lg font-semibold text-theme mb-3">About</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {game.summary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Screenshots Gallery */}
        {screenshots.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-theme mb-6">Screenshots</h2>
            <div
              onClick={() => setIsGalleryOpen(true)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
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
            <h2 className="text-2xl font-bold text-theme mb-6">
              Similar Games
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarGames.map((similarGame) => (
                <Link
                  key={similarGame.id}
                  href={`/game/${similarGame.id}/${similarGame.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "")}`}
                  className="group"
                >
                  <GameCard game={similarGame} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {screenshots.length > 0 && (
        <ImageGallery
          images={screenshots}
          gameName={game.name}
          isOpen={isGalleryOpen}
          onClose={closeGallery}
          initialIndex={galleryIndex}
        />
      )}
    </>
  );
}
