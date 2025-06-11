import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key is not configured');
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Log the API request
    console.log('Making request to Gemini API with prompt:', prompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a color palette based on this description: "${prompt}". Return only an array of 5 hex color codes in this exact format: ["#color1", "#color2", "#color3", "#color4", "#color5"]. Make sure each color is a valid hex code starting with # followed by 6 characters (0-9 or a-f). Do not include any other text or explanation.`
                }
              ]
            }
          ]
        })
      }
    );

    // Log the response status
    console.log('Gemini API response status:', response.status);

    const data = await response.json();
    
    // Log the response data
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || 'Failed to generate palette');
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from API');
    }

    // Extract the color array from the response
    const colorArrayText = data.candidates[0].content.parts[0].text;
    console.log('Extracted color array text:', colorArrayText);
    
    // Parse the response and validate the colors
    let palette;
    try {
      palette = JSON.parse(colorArrayText);
      
      // Validate that we have exactly 5 colors and they are all valid hex codes
      if (!Array.isArray(palette) || palette.length !== 5) {
        console.error('Invalid palette length:', palette);
        throw new Error('Invalid palette format');
      }
      
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      if (!palette.every(color => hexColorRegex.test(color))) {
        console.error('Invalid color format in palette:', palette);
        throw new Error('Invalid color format');
      }

      console.log('Successfully generated palette:', palette);
      return NextResponse.json({ palette });
    } catch (error) {
      console.error('Error parsing palette:', error);
      throw new Error('Failed to generate valid palette');
    }
  } catch (error) {
    console.error('Error in generate-palette route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate palette' },
      { status: 500 }
    );
  }
} 