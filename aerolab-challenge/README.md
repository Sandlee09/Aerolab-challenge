# Aerolab Game Collection

A modern web application for discovering and collecting video games, built with Next.js and the IGDB API.

## Features

- 🔍 **Smart Search**: Real-time game search with debounced API calls
- 📚 **Game Collection**: Save and manage your favorite games locally
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🎮 **Game Details**: Comprehensive game information including ratings, screenshots, and similar games
- ⚡ **Performance**: Optimized images, lazy loading, and efficient API usage
- 🎨 **Modern UI**: Clean, accessible interface with smooth animations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **API**: IGDB (Internet Game Database)
- **Storage**: Browser Local Storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- IGDB API credentials

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aerolab-challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up IGDB API credentials**
   
   - Sign up at [IGDB](https://igdb.com)
   - Create a new app to get your Client ID and Client Secret
   - Copy `.env.local.example` to `.env.local`
   - Add your credentials:
   ```env
   NEXT_PUBLIC_IGDB_CLIENT_ID=your_client_id_here
   NEXT_PUBLIC_IGDB_CLIENT_SECRET=your_client_secret_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── game/[id]/[slug]/  # Dynamic game detail pages
│   ├── layout.tsx         # Root layout with header
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── CollectionGrid.tsx
│   ├── GameCard.tsx
│   ├── GameDetailContent.tsx
│   ├── Header.tsx
│   └── SearchInput.tsx
├── hooks/                 # Custom React hooks
│   └── useGameCollection.ts
├── lib/                   # Utility functions
│   ├── igdb.ts           # IGDB API integration
│   ├── storage.ts        # Local storage utilities
│   └── utils.ts          # General utilities
└── types/                 # TypeScript type definitions
    └── game.ts
```

## Features Implementation

### Home Page
- ✅ Logo and navigation
- ✅ Search functionality
- ✅ Game collection grid
- ✅ Empty state handling
- ✅ Sort options (date added, release date)
- ✅ Remove games functionality

### Search Feature
- ✅ Real-time search with debouncing
- ✅ Dynamic results dropdown
- ✅ Game selection and navigation
- ✅ Loading states and error handling
- ✅ API rate limiting consideration

### Game Detail Page
- ✅ Comprehensive game information
- ✅ Cover art and screenshots
- ✅ Rating display with stars
- ✅ Platform information
- ✅ Release date and years ago
- ✅ Add/remove from collection
- ✅ Similar games section
- ✅ SEO-friendly URLs with slugs
- ✅ Search functionality on detail page

### Technical Features
- ✅ TypeScript for type safety
- ✅ Responsive mobile-first design
- ✅ Performance optimizations
- ✅ Accessibility features
- ✅ SEO metadata
- ✅ Error handling
- ✅ Loading states
- ✅ Local storage persistence

## API Integration

The app integrates with the IGDB API to fetch game data:

- **Search Games**: `/games` endpoint with search functionality
- **Game Details**: Comprehensive game information including ratings, screenshots, platforms
- **Similar Games**: Related game recommendations
- **Image URLs**: Optimized image loading with different sizes

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## Environment Variables

```env
NEXT_PUBLIC_IGDB_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_IGDB_CLIENT_SECRET=your_client_secret_here
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [IGDB](https://igdb.com) for the comprehensive game database API
- [Aerolab](https://aerolab.co) for the coding challenge
- [Next.js](https://nextjs.org) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
