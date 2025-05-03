import { NextResponse } from 'next/server'
import { Buffer } from 'buffer'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  throw new Error('Missing one or more Spotify environment variables')
}


const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'

async function getAccessToken() {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN as string
    }),
    cache: 'no-store'
  })

  if (!res.ok) {
    console.error('Token refresh failed:', await res.text())
    throw new Error('Failed to refresh Spotify token')
  }

  const { access_token } = await res.json()
  return access_token as string
}

export async function GET() {
  try {
    const token = await getAccessToken()
    const res = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    })

    if (res.status === 204 || !res.ok) {
      return NextResponse.json({ isPlaying: false })
    }

    const json = await res.json()
    const isPlaying = json.is_playing
    const artist = json.item.artists.map((_artist: { name: string }) => _artist.name).join(', ');
    const title = json.item.name
    const songUrl = json.item.external_urls.spotify

    return NextResponse.json({ isPlaying, title, songUrl, artist })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ isPlaying: false, error: 'Failed to fetch now‑playing.' })
  }
}