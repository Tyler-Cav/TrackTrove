import { useEffect, useState } from "react";
import axios from "axios";

export default  function Auth() {
  const [codeChallenge, setCodeChallenge] = useState(null);
  let token = "";

  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const params = {
    client_id: "cfc55caf7f324ca0ab3ccfb3bb8a90f5",
    redirect_uri: `http://localhost:${window.location.port}`,
    response_type: "code",
    code_challenge_method: "S256",
    scope: ["user-library-read", "user-follow-read"],
  };
  const paramString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');


  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  // START - AUTHORIZATION FLOW WITH PKCE
  const codeVerifier = generateRandomString(64);
  console.log("codeVerifier", codeVerifier);
  window.localStorage.setItem("code_verifier", codeVerifier);

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const redirectToSpotifyToAuthorize = () => {
    const codeChallenge =  async () => {
      const hashed = await sha256(codeVerifier);
      setCodeChallenge(base64encode(hashed));
    }
    codeChallenge();
  }

  useEffect(() => {
    // Generate code challenge and store in local component state
    const codeChallenge =  async () => {
      const hashed = await sha256(codeVerifier);
      setCodeChallenge(base64encode(hashed));
    }
    codeChallenge();

    // Check if the user has been redirected back to the app with the authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Check if we are in callback, start the token exchange
    if (code) {
      const codeVerifier = window.localStorage.getItem("code_verifier");
      // TODO: code_verifier keeps being regenerated on load, thus causing `code_verifier was incorrect` errors
      axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams({
          client_id: params.client_id,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: `http://localhost:${window.location.port}`,
          code_verifier: codeVerifier,
        }),
      })
      .then((response) => {
        const token = response.data.access_token;
        window.localStorage.setItem('token', token);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
    }
  }, []);

  const logout = () => {
    token = "";
    window.localStorage.clear()
  };

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a
            className="App-link"
            href={`${AUTH_ENDPOINT}?${paramString}&code_challenge=${codeChallenge}`}
            // target="_blank"
            rel="noopener noreferrer"
          >
            Login with Spotify
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </header>
    </div>
  );
}
