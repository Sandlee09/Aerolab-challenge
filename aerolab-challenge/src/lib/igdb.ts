import { getAccessToken } from "@/app/api/igdb/route";
import { Game, SearchResult } from "@/types/game";

// Make authenticated request to IGDB API via our API route
async function makeIGDBRequest(
  endpoint: string,
  body: string
): Promise<unknown[]> {
  console.log("Making IGDB request via API route:", { endpoint, body });

  try {
    const token = await getAccessToken();
    const clientId = process.env.NEXT_PUBLIC_IGDB_CLIENT_ID;
    const IGDB_BASE_URL = process.env.NEXT_PUBLIC_IGDB_BASE_URL;

    const response = await fetch(`${IGDB_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Client-ID": clientId!,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body,
    });

    console.log("API route response status:", response.status);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error("API route request failed:", response.status, errorData);
      throw new Error(
        `API request failed: ${response.status} ${
          errorData.error || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    console.log("API route response data length:", data.length);
    return data;
  } catch (error) {
    console.error("Error in makeIGDBRequest:", error);
    throw error;
  }
}

// Make authenticated request to IGDB API via our API route
async function makeSearchRequest(
  endpoint: string,
  body: string
): Promise<unknown[]> {
  console.log("Making IGDB request via API route:", { endpoint, body });

  try {
    const response = await fetch("/api/igdb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint, body }),
    });

    console.log("API route response status:", response.status);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error("API route request failed:", response.status, errorData);
      throw new Error(
        `API request failed: ${response.status} ${
          errorData.error || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    console.log("API route response data length:", data.length);
    return data;
  } catch (error) {
    console.error("Error in makeIGDBRequest:", error);
    throw error;
  }
}

// Search games
export async function searchGames(
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const body = `search "${query}"; fields id,name,cover.image_id,first_release_date; limit ${limit};`;

  try {
    const results = (await makeSearchRequest("/games", body)) as Array<{
      id: number;
      name: string;
      cover?: { id: number; image_id: string };
      first_release_date?: number;
    }>;

    return results.map((game) => ({
      id: game.id,
      name: game.name,
      cover: game.cover
        ? { id: game.cover.id, image_id: game.cover.image_id }
        : undefined,
      first_release_date: game.first_release_date,
    }));
  } catch (error) {
    console.error("Error searching games:", error);
    return [];
  }
}

// Get game details
export async function getGameDetails(gameId: number): Promise<Game | null> {
  const body = `fields id,name,summary,rating,rating_count,first_release_date,cover.image_id,screenshots.image_id,platforms.name,similar_games; where id = ${gameId};`;

  try {
    const results = (await makeIGDBRequest("/games", body)) as Array<{
      id: number;
      name: string;
      summary?: string;
      rating?: number;
      rating_count?: number;
      first_release_date?: number;
      cover?: { id: number; image_id: string };
      screenshots?: Array<{ id: number; image_id: string }>;
      platforms?: Array<{ id: number; name: string }>;
      similar_games?: number[];
    }>;

    if (results.length === 0) return null;

    const game = results[0];
    return {
      id: game.id,
      name: game.name,
      summary: game.summary,
      rating: game.rating,
      rating_count: game.rating_count,
      first_release_date: game.first_release_date,
      cover: game.cover
        ? { id: game.cover.id, image_id: game.cover.image_id }
        : undefined,
      screenshots:
        game.screenshots?.map((s) => ({ id: s.id, image_id: s.image_id })) ||
        [],
      platforms: game.platforms?.map((p) => ({ id: p.id, name: p.name })) || [],
      similar_games: game.similar_games || [],
    };
  } catch (error) {
    console.error("Error getting game details:", error);
    return null;
  }
}

// Get similar games
export async function getSimilarGames(
  gameIds: number[]
): Promise<SearchResult[]> {
  if (gameIds.length === 0) return [];

  const body = `fields id,name,cover.image_id,first_release_date; where id = (${gameIds.join(
    ","
  )}); limit 6;`;

  try {
    const results = (await makeIGDBRequest("/games", body)) as Array<{
      id: number;
      name: string;
      cover?: { id: number; image_id: string };
      first_release_date?: number;
    }>;

    return results.map((game) => ({
      id: game.id,
      name: game.name,
      cover: game.cover
        ? { id: game.cover.id, image_id: game.cover.image_id }
        : undefined,
      first_release_date: game.first_release_date,
    }));
  } catch (error) {
    console.error("Error getting similar games:", error);
    return [];
  }
}

// Get image URL
export function getImageUrl(
  imageId: string,
  size: string = "cover_big"
): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}
