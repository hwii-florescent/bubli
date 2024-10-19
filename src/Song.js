import axios from "axios";

// Export the function to be called in another file
export const SpotifySongSuggestion = async (valence, tempo, energy) => {
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET; // Not recommended to use in frontend directly

  const getAccessToken = async () => {
    // Use btoa to encode the clientId and clientSecret into base64
    const token = btoa(`${clientId}:${clientSecret}`);

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  };

  const token = await getAccessToken();

  const params = {
    limit: 1,
    market: "US",
    seed_genres: "pop", // You can make this dynamic if needed
    min_valence: valence - 0.05,
    max_valence: valence + 0.05,
    min_tempo: tempo,
    max_tempo: tempo,
    min_energy: energy,
    max_energy: energy,
  };

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    // Return the track data to the calling function
    return response.data.tracks;
  } catch (error) {
    console.error("Error fetching Spotify recommendations: ", error);
    return [];
  }
};
