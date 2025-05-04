KICKBOX_API_KEY

# Portfolio Website

A minimalist, monospaced developer portfolio site built with Next.js and
TypeScript.

**Portfolio Screenshot below:**

<img src="image\screenshot.png" width="600" alt="Portfolio Screenshot">

## Features

- 🖥️ Clean, monospaced, terminal-like aesthetic
- 📱 Fully responsive design
- 🔄 Single-page application with dynamic content switching
- 📊 GitHub repository cards and stats integration
- 🎵 Spotify "Now Playing" integration
- 📄 Detailed project showcase sorted by category

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: IBM Plex Mono
- **APIs**: GitHub Stats API, Spotify Web API

## Project Structure

```
Portfolio/
├── app/
│   ├── api/
│   │   └── spotify/
│   │       └── now-playing/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── ProjectsPage.tsx
│   │   └── ResumePage.tsx
│   └── SpotifyNowPlaying.tsx
├── public/
│   ├── profile_picture_manav_garg.jpeg
│   ├── repos.json
│   └── resume.pdf
└── tailwind.config.js
```

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ManavvGarg/Portfolio.git
   cd Portfolio
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Configure environment variables** Create a `.env.local` file in the root
   directory:

   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
   NEXT_PUBLIC_FORMSPREE_ID=your_formspree_form_id
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_key (OBTAINED FROM GOOGLE CLOUD CONSOLE)
   KICKBOX_API_KEY= (NOT REQUIRED AS OF NOW. NOT IMPLEMENTED)
   ```
4. **Run the development server**

   ```bash
   npm run dev
   ```
5. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Customizing the Portfolio

### Personal Information

Edit the main page.tsx file to update your personal information:

- Name
- Title/designation
- Bio
- Contact information
- Quote
- Social media links

### Projects

The projects are loaded from `public/repos.json`. Update this file to display
your own repositories:

```json
[
    {
        "base_url": "https://github-readme-stats.vercel.app/api/pin/?username=yourusername&repo=",
        "repos": {
            "Category1": [
                "repo1",
                "repo2"
            ],
            "Category2": [
                "repo3",
                "repo4"
            ]
        }
    }
]
```

### Page Content

Each page's content is defined in its own component in the `components/pages`
directory. Modify these files to customize the content of each page.

## Spotify Integration

The portfolio includes a "Now Playing" feature that shows what you're currently
listening to on Spotify. To set this up:

1. Create a Spotify Developer application
2. Get your client ID and client secret
3. Set up the authentication flow to get a refresh token
4. Add these credentials to your `.env.local` file

## Deployment

This portfolio can be easily deployed to Vercel, Netlify, or any other
Next.js-compatible hosting platform.

```bash
# For Vercel
vercel

# For Netlify
netlify deploy
```

## Credits

- Built by [Manav Garg](https://github.com/ManavvGarg/)
- GitHub stats API by
  [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- Icons by [Lucide Icons](https://lucide.dev/)
- Font by [IBM Plex](https://www.ibm.com/plex/)

## License

MIT License © Manav Garg
