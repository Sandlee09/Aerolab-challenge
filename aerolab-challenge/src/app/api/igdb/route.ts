import { NextRequest, NextResponse } from "next/server";

const IGDB_BASE_URL = process.env.NEXT_PUBLIC_IGDB_BASE_URL;

// Get access token for IGDB API
export async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_IGDB_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_IGDB_CLIENT_SECRET;

  console.log(
    "Getting access token with client ID:",
    clientId ? "present" : "missing"
  );

  if (!clientId || !clientSecret) {
    console.error("Missing IGDB credentials");
    throw new Error("IGDB API credentials not configured");
  }

  try {
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token request failed:", response.status, errorText);
      throw new Error(
        `Failed to get IGDB access token: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Successfully got access token");
    return data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { endpoint, body } = await request.json();

    console.log("API request:", { endpoint, body });

    if (!endpoint || !body) {
      return NextResponse.json(
        { error: "Missing endpoint or body" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();
    const clientId = process.env.NEXT_PUBLIC_IGDB_CLIENT_ID;

    if (!clientId) {
      console.error("Client ID not found in environment");
      return NextResponse.json(
        { error: "Client ID not configured" },
        { status: 500 }
      );
    }

    console.log("Making IGDB request to:", `${IGDB_BASE_URL}${endpoint}`);

    const response = await fetch(`${IGDB_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body,
    });

    console.log("IGDB response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("IGDB API request failed:", response.status, errorText);
      return NextResponse.json(
        { error: `IGDB API request failed: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("IGDB response data length:", data.length);
    return NextResponse.json(data);
  } catch (error) {
    console.error("IGDB API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch from IGDB API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
