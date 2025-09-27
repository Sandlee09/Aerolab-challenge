import { notFound, redirect } from 'next/navigation';
import { getGameDetails, getSimilarGames, getImageUrl } from '@/lib/igdb';
import { GameDetailContent } from '@/components/GameDetailContent';
import { createSlug } from '@/lib/utils';

interface GameDetailPageProps {
  params: Promise<{
    id: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GameDetailPageProps) {
  try {
    const { id } = await params;
    const gameId = parseInt(id);
    
    if (isNaN(gameId)) {
      return {
        title: 'Invalid Game ID',
      };
    }
    
    const game = await getGameDetails(gameId);
    
    if (!game) {
      return {
        title: 'Game Not Found',
      };
    }

    const coverUrl = game.cover ? getImageUrl(game.cover.image_id, 'cover_big') : null;

    return {
      title: `${game.name} - Aerolab Game Collection`,
      description: game.summary || `Discover ${game.name} and add it to your game collection.`,
      openGraph: {
        title: game.name,
        description: game.summary || `Discover ${game.name} and add it to your game collection.`,
        images: coverUrl ? [{ url: coverUrl }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: game.name,
        description: game.summary || `Discover ${game.name} and add it to your game collection.`,
        images: coverUrl ? [coverUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Game Not Found',
    };
  }
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  try {
    const { id, slug } = await params;
    const gameId = parseInt(id);
    
    if (isNaN(gameId)) {
      console.error('Invalid game ID:', id);
      notFound();
    }
    
    console.log('Fetching game details for ID:', gameId, 'with slug:', slug);
    const game = await getGameDetails(gameId);
    
    if (!game) {
      console.error('Game not found for ID:', gameId);
      notFound();
    }

    console.log('Found game:', game.name);
    
    // Create the expected slug and compare
    const actualSlug = createSlug(game.name);
    console.log('Slug comparison:', { expected: slug, actual: actualSlug });
    
    // If slug doesn't match, redirect to the correct URL
    if (actualSlug !== slug) {
      console.log('Redirecting to correct slug:', actualSlug);
      redirect(`/game/${gameId}/${actualSlug}`);
    }

    // Get similar games
    const similarGames = game.similar_games ? await getSimilarGames(game.similar_games) : [];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GameDetailContent game={game} similarGames={similarGames} />
      </div>
    );
  } catch (error) {
    console.error('Error in GameDetailPage:', error);
    notFound();
  }
}
