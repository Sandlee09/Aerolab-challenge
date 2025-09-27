# Deployment Guide

## Prerequisites

1. **IGDB API Credentials**
   - Sign up at [IGDB](https://igdb.com)
   - Create a new app to get your Client ID and Client Secret
   - Add credentials to your environment variables

2. **Vercel Account**
   - Sign up at [Vercel](https://vercel.com)
   - Connect your GitHub account

## Deployment Steps

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Aerolab Game Collection"

# Push to GitHub
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_IGDB_CLIENT_ID`: Your IGDB Client ID
   - `NEXT_PUBLIC_IGDB_CLIENT_SECRET`: Your IGDB Client Secret
5. Click "Deploy"

### 3. Update Domain References

After deployment, update these files with your actual domain:

1. **robots.txt**: Update the sitemap URL
2. **sitemap.ts**: Update the base URL
3. **README.md**: Update any example URLs

### 4. Test Your Deployment

1. Visit your deployed URL
2. Test the search functionality
3. Test adding/removing games from collection
4. Test game detail pages
5. Test responsive design on mobile

## Environment Variables

```env
NEXT_PUBLIC_IGDB_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_IGDB_CLIENT_SECRET=your_client_secret_here
```

## Performance Optimization

The app includes several performance optimizations:

- **Image Optimization**: Next.js Image component with proper sizing
- **Code Splitting**: Automatic code splitting by Next.js
- **Static Generation**: Static pages where possible
- **Debounced Search**: Prevents excessive API calls
- **Local Storage**: Efficient client-side storage

## Monitoring

Consider setting up:

1. **Vercel Analytics**: Built-in performance monitoring
2. **Error Tracking**: Sentry or similar service
3. **API Monitoring**: Monitor IGDB API usage and errors

## Troubleshooting

### Common Issues

1. **API Errors**: Check IGDB credentials and rate limits
2. **Build Failures**: Ensure all dependencies are installed
3. **Image Loading**: Verify IGDB image URLs are accessible
4. **Local Storage**: Check browser storage permissions

### Support

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review [IGDB API Documentation](https://api-docs.igdb.com)
- Check [Vercel Documentation](https://vercel.com/docs)
