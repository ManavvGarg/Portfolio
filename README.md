# Portfolio Website

A minimalist, monospaced developer portfolio site built with Next.js and
TypeScript.

**Portfolio Screenshot below:**

<img src="image\screenshot.png" width="600" alt="Portfolio Screenshot">

## Features

- 🖥️ **Terminal-like Aesthetic**: Clean monospaced design with a
  developer-friendly interface
- 📱 **Fully Responsive Design**: Optimized for all screen sizes from mobile to
  desktop
- 🔄 **Single-Page Application**: Smooth navigation with dynamic content
  switching
- 📊 **GitHub Integration**:
  - Repository cards showing your pinned projects
  - GitHub stats integration with customizable display
  - Categorized projects for better organization
- 🎵 **Spotify Now Playing**: Real-time display of your current Spotify track
- 📄 **Project Showcase**: Detailed project cards sorted by customizable
  categories
- 📝 **Contact Form**: Interactive form with FormSpree integration and reCAPTCHA
  protection
- 📱 **Social Media Links**: Easy connections to your professional profiles
- 🌐 **SEO Optimized**: Built with Next.js for better search engine visibility

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: IBM Plex Mono
- **APIs**: GitHub Stats API, Spotify Web API, FormSpree, Google reCAPTCHA

## Project Structure

```
Portfolio/
├── app/
│   ├── api/
│   │   └── spotify/
│   │       └── now-playing/
│   │           └── route.ts  # Spotify API integration
│   ├── globals.css           # Global styles 
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Main entry component
├── components/
│   ├── pages/
│   │   ├── AboutPage.tsx     # About section component
│   │   ├── ContactPage.tsx   # Contact form component
│   │   ├── HomePage.tsx      # Home/landing page component
│   │   ├── ProjectsPage.tsx  # Projects showcase component
│   │   └── ResumePage.tsx    # Resume component
│   └── SpotifyNowPlaying.tsx # Spotify integration component
├── public/
│   ├── profile_picture_manav_garg.jpeg # Profile image
│   ├── repos.json            # GitHub repositories configuration
│   └── Resume_Manav_Garg.pdf # Downloadable resume file
└── tailwind.config.js        # Tailwind CSS configuration
```

## Prerequisites

Before installing the portfolio, ensure you have:

- **Node.js**: v16.x or later (v18.x recommended)
- **npm**: v8.x or later
- **A GitHub account**: For repository cards integration
- **A Spotify account**: For the "Now Playing" feature (optional)
- **A FormSpree account**: For contact form submission handling (optional)
- **Google reCAPTCHA**: For spam protection on the contact form (optional)

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
3. **Configure environment variables**

   Create a `.env.local` file in the root directory with the following
   variables:

   ```env
   # Spotify API credentials
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token

   # FormSpree integration
   NEXT_PUBLIC_FORMSPREE_ID=your_formspree_form_id

   # Google reCAPTCHA
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

   # Email validation service (for future use)
   KICKBOX_API_KEY=your_kickbox_api_key
   ```
4. **Run the development server**

   ```bash
   npm run dev
   ```

   This will start the development server at
   [http://localhost:3000](http://localhost:3000)
5. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Detailed API Setup Guides

### GitHub Stats API Integration

The portfolio uses
[anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
to display repository cards:

1. No setup is required for basic usage - the API is public
2. For higher rate limits:
   - Fork the GitHub Stats repository
   - Deploy it to Vercel
   - Update the `base_url` in `repos.json` to your deployed instance

### Spotify API Setup

To enable the "Now Playing" feature:

1. **Create a Spotify Developer Application**

   - Go to
     [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create an App"
   - Fill in the app details (name, description)
   - Set the Redirect URI to `http://localhost:3000/callback`
2. **Get Required Credentials**

   - Note your Client ID and Client Secret from the app dashboard
   - Generate a refresh token using the following steps:
3. **Generate a Refresh Token**

   ```bash
   # Step 1: Get authorization code (replace CLIENT_ID)
   # Open this URL in your browser:
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing%20user-read-recently-played

   # Step 2: After authorization, you'll be redirected to a URL with a code parameter
   # Extract that code and use it in the following request:

   curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic <BASE64_ENCODED_CLIENT_ID_AND_SECRET>" -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=http://localhost:3000/callback" https://accounts.spotify.com/api/token
   ```
4. **Add to Environment Variables**

   - Add the client ID, client secret, and refresh token to your `.env.local`
     file

### FormSpree Integration

For the contact form functionality:

1. Create an account at [FormSpree](https://formspree.io/)
2. Create a new form and note the form ID
3. Add the form ID to your `.env.local` as `NEXT_PUBLIC_FORMSPREE_ID`
4. The contact form will now submit messages to your email via FormSpree

### Google reCAPTCHA Setup

To protect your contact form from spam:

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site with reCAPTCHA v2
3. Add your domain(s) to the allowed domains list
4. Copy the Site Key and add it to `.env.local` as
   `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

## Customizing the Portfolio

### Personal Information

Edit the main `page.tsx` file in the app directory to update your personal
information:

- Name and professional title
- Bio and personal description
- Contact information (email, phone, location)
- Social media links and professional profiles
- Quote or personal motto

### Professional Interests and Skills

Update the `HomePage.tsx` component to reflect your:

- Professional interests
- Educational background
- Skills and expertise
- Certifications and achievements

### Projects

The projects are loaded from `public/repos.json`. Update this file to display
your own repositories:

```json
[
   {
      "base_url": "https://github-readme-stats.vercel.app/api/pin/?username=yourusername&repo=",
      "repos": {
         "Web Development": [
            "web-project-1",
            "web-project-2"
         ],
         "Machine Learning": [
            "ml-project-1",
            "data-analysis-tool"
         ],
         "Mobile Apps": [
            "mobile-app-1",
            "flutter-project"
         ]
      }
   }
]
```

You can:

- Create custom categories that represent your focus areas
- Add as many repositories as needed in each category
- Change the GitHub username in the `base_url` to your own

### Page Content

Each page's content is defined in its own component in the `components/pages`
directory:

- `HomePage.tsx`: Update your introduction, headline, and key highlights
- `AboutPage.tsx`: Edit your bio, education, and personal story
- `ProjectsPage.tsx`: Customize the project display settings
- `ResumePage.tsx`: Update your professional experience and education
- `ContactPage.tsx`: Modify the contact form fields and submission handling

### Visual Customization

To change the visual appearance:

1. **Theme Colors**: Edit the Tailwind configuration in `tailwind.config.js`
2. **Typography**: Change font settings in `globals.css` and
   `tailwind.config.js`
3. **Profile Picture**: Replace `public/profile_picture_manav_garg.jpeg` with
   your own image
4. **Resume PDF**: Replace `public/resume.pdf` with your current resume

## Advanced Customization

### Adding New Pages

To add a new section to your portfolio:

1. Create a new component in `components/pages` (e.g., `ProjectsPage.tsx`)
2. Add your content and styling
3. Import and include the new component in `page.tsx`
4. Add a navigation link in the main navigation component

### Custom API Routes

For adding new API integrations:

1. Create a new directory in `app/api/` for your API
2. Add a `route.ts` file with your API handler logic
3. Use the API in your components using fetch or axios

## Troubleshooting

### Spotify Integration Issues

- **"Now Playing" not working**: Check your Spotify credentials and make sure
  you're actively playing music
- **API errors**: Verify your refresh token is valid and not expired
- **Rate limiting**: If you see rate limit errors, implement caching or reduce
  request frequency

### GitHub Cards Not Displaying

- Verify your GitHub username is correct in `repos.json`
- Check if repository names are accurate
- Consider deploying your own instance of the GitHub Stats API for higher rate
  limits

### Contact Form Issues

- Check your FormSpree ID is correct
- Verify your reCAPTCHA setup with the correct domain
- Test the form in both development and production environments

## Deployment

This portfolio can be deployed to various platforms:

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Configuration tips:

- Add all environment variables in the Vercel project settings
- Set the build command to `npm run build`
- Set the output directory to `.next`

### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy
```

Remember to:

- Set up environment variables in Netlify's dashboard
- Configure the build settings to use Next.js

### Self-Hosting

For deploying to your own server:

1. Build the application

   ```bash
   npm run build
   ```
2. Start the production server

   ```bash
   npm start
   ```
3. Use a process manager like PM2 for keeping the application running

   ```bash
   npm install -g pm2
   pm2 start npm -- start
   ```

## Performance Optimization

The portfolio is optimized for performance with:

- Next.js image optimization
- Component-level code splitting
- Efficient data fetching with SWR
- Minimal client-side JavaScript

## Browser Compatibility

The portfolio is tested and works on:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (Chrome for Android, Safari iOS)

## Credits

- Built by [Manav Garg](https://github.com/ManavvGarg/)
- GitHub stats API by
  [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- Icons by [Lucide Icons](https://lucide.dev/)
- Font by [IBM Plex](https://www.ibm.com/plex/)
- Built with [Next.js](https://nextjs.org/) and
  [Tailwind CSS](https://tailwindcss.com/)
- Contact form powered by [FormSpree](https://formspree.io/)
- Form protection by [Google reCAPTCHA](https://www.google.com/recaptcha/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License © Manav Garg

---

_Last updated: 2025_
