# Magic Mirror

A modern, customizable smart mirror interface built with React, TypeScript, and Vite. This project creates an elegant display for your smart mirror, showing various widgets including weather, train schedules, news headlines, and a photo collage from your Google Photos.

## Features

- **Clock Widget**: Displays current time
- **Weather Widget**: Shows current weather and conditions
- **Train Schedule**: Real-time train departure information
- **News Headlines**: Latest news updates
- **Photo Collage**: Rotating display of your Google Photos
- **Responsive Design**: Adapts to different screen sizes
- **Dark Theme**: Perfect for mirror displays
- **Click-to-Show Interface**: Click anywhere to show/hide widgets

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Google Cloud Platform account (for Photos API)
- API keys for various services

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd magic-mirror
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Google APIs
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_API_KEY=your_api_key_here

# Other APIs as needed
VITE_NEWS_API_KEY=your_news_api_key
```

4. Set up Google Cloud Platform:
   - Create a new project
   - Enable the Google Photos Library API
   - Create OAuth 2.0 credentials
   - Add authorized JavaScript origins for your domain
   - Add the client ID and API key to your `.env` file

5. Start the development server:
```bash
npm run dev
```

## Configuration

### Google Photos Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Photos Library API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production URL (if deployed)

### Widget Customization
Each widget can be customized in its respective component file in `src/widgets/`:
- `Clock.tsx`: Clock display settings
- `Weather.tsx`: Weather display preferences
- `Rail.tsx`: Train schedule settings
- `Headlines.tsx`: News preferences
- `Photos.tsx`: Photo collage settings

## Development

The project uses:
- React 18 with TypeScript
- Vite for fast development and building
- CSS Modules for styling
- Axios for API requests

Key directories:
```
src/
  ├── widgets/        # Widget components
  ├── assets/         # Static assets
  ├── components/     # Shared components
  ├── App.tsx         # Main application
  └── App.css         # Global styles
```

## Building for Production

1. Build the project:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

The built files will be in the `dist` directory.

## Deployment

1. Build the project as above
2. Deploy the contents of the `dist` directory to your hosting service
3. Ensure your production domain is added to the authorized JavaScript origins in Google Cloud Console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [Weather Service]
- News data provided by NewsAPI
- Train schedule data provided by [Transport Service]
- Google Photos API for photo integration
