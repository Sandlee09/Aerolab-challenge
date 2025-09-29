import { notFound, redirect } from "next/navigation";
import { getGameDetails, getSimilarGames, getImageUrl } from "@/lib/igdb";
import { GameDetailContent } from "@/components/GameDetailContent";

interface GameDetailPageProps {
  params: Promise<{
    id: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GameDetailPageProps) {
  try {
    const { id } = await params;
    const game = await getGameDetails(parseInt(id));

    if (!game) {
      return {
        title: "Game Not Found",
        description: "The requested game could not be found.",
      };
    }

    return {
      title: `${game.name} - Game Details`,
      description: game.summary || `View details for ${game.name}`,
      openGraph: {
        title: game.name,
        description: game.summary || `View details for ${game.name}`,
        images: game.cover
          ? [
              {
                url: getImageUrl(game.cover.image_id, "cover_big"),
                width: 264,
                height: 374,
                alt: game.name,
              },
            ]
          : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Game Details",
      description: "View game details",
    };
  }
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  try {
    const { id, slug } = await params;
    const gameId = parseInt(id);

    if (isNaN(gameId)) {
      notFound();
    }

    const game = await getGameDetails(gameId);

    if (!game) {
      notFound();
    }

    // Verify slug matches
    const expectedSlug = game.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (slug !== expectedSlug) {
      redirect(`/game/${gameId}/${expectedSlug}`);
    }

    // Get similar games
    const similarGames = game.similar_games
      ? await getSimilarGames(game.similar_games.slice(0, 6))
      : [];

    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <GameDetailContent game={game} similarGames={similarGames} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading game details:", error);
    notFound();
  }
}
