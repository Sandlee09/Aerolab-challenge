export interface Game {
  id: number;
  name: string;
  summary?: string;
  rating?: number;
  rating_count?: number;
  first_release_date?: number;
  cover?: {
    id: number;
    image_id: string;
  };
  screenshots?: Array<{
    id: number;
    image_id: string;
  }>;
  platforms?: Array<{
    id: number;
    name: string;
  }>;
  similar_games?: number[];
}

export interface GameCollection {
  [key: number]: Game;
}

export interface SearchResult {
  id: number;
  name: string;
  cover?: {
    id: number;
    image_id: string;
  };
  first_release_date?: number;
}

export interface Platform {
  id: number;
  name: string;
}

export interface Screenshot {
  id: number;
  image_id: string;
}
