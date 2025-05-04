import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const apiKey = process.env.KICKBOX_API_KEY;
    
    if (!apiKey) {
      console.error('Missing Kickbox API key in environment variables');
      return NextResponse.json({ isDisposable: false });
    }
    
    const encodedEmail = encodeURIComponent(email);
    
    const response = await fetch(
      `https://api.kickbox.com/v2/verify?email=${encodedEmail}&apikey=${apiKey}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      console.error(`Kickbox API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ isDisposable: false });
    }
    
    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({ isDisposable: data.disposable === true });
    } else {
      console.error(`Kickbox API error: ${data.message}`);
      return NextResponse.json({ isDisposable: false });
    }
    
  } catch (error) {
    console.error('Error checking disposable email:', error);
    return NextResponse.json({ isDisposable: false });
  }
}