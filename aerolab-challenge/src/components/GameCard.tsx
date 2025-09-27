"use client";

import Image from "next/image";
import Link from "next/link";
import { Game } from "@/types/game";
import { getImageUrl } from "@/lib/igdb";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface GameCardProps {
  game: Game;
  showReleaseDate?: boolean;
  className?: string;
}

export function GameCard({
  game,
  showReleaseDate = false,
  className,
}: GameCardProps) {
  const { theme } = useTheme();
  const coverUrl = game.cover
    ? getImageUrl(game.cover.image_id, "cover_big")
    : null;

  return (
    <Link
      href={`/game/${game.id}/${createSlug(game.name)}`}
      className={cn(
        `group block ${
          theme === "dark" ? "light" : "dark"
        } rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-dark-600`,
        className
      )}
    >
      <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={game.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              No cover
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm !inverted-theme line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {game.name}
        </h3>
        {showReleaseDate && game.first_release_date && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(game.first_release_date)}
          </p>
        )}
      </div>
    </Link>
  );
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
