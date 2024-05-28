import { useEffect } from "react";
import axios from "axios";

export default  function Auth() {
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const params = {
    client_id: "cfc55caf7f324ca0ab3ccfb3bb8a90f5",
    redirect_uri: `http://localhost:${window.location.port}`,
    response_type: "code",
    code_challenge_method: "S256",
    scope: ["user-library-read", "user-follow-read"],
  };

  const currentToken = {
    get access_token() { return localStorage.getItem('access_token') || null; },
    get refresh_token() { return localStorage.getItem('refresh_token') || null; },
    get expires_in() { return localStorage.getItem('refresh_in') || null },
    get expires() { return localStorage.getItem('expires') || null },

    save: function (response) {
      const { access_token, refresh_token, expires_in } = response;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);

      const now = new Date();
      const expiry = new Date(now.getTime() + (expires_in * 1000));
      localStorage.setItem('expires', expiry);
    }
  };

  const generateCodeVerifier = () => {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  };

  const generateCodeChallenge = async (codeVerifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const authorize = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    window.localStorage.setItem('code_verifier', codeVerifier);

    params.code_challenge = codeChallenge;

    const url = `${AUTH_ENDPOINT}?${new URLSearchParams(params).toString()}`;
    window.location.href = url;
  };

  const logout = () => {
    window.localStorage.clear()
    window.location.reload();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const codeVerifier = window.localStorage.getItem('code_verifier');

      axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams({
          client_id: params.client_id,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: params.redirect_uri,
          code_verifier: codeVerifier,
        }),
      })
      .then((response) => {
        console.log('Success!', response.data);
        currentToken.save(response.data);

      })
      .catch((error) => {
        console.error('There was an error!', error);
      });

      window.history.pushState({}, null, '/');
      window.localStorage.removeItem('code_verifier');


    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!currentToken.access_token ? (
          <button onClick={authorize}>Login</button>
        ) : (

          <button onClick={logout}>Logout</button>
        )}
        {/* TODO: 'logout' button shows up after one additional refresh. We need to convert the above to use redux so that that component will re-render after the access_token retrival */}
        {/* TODO: Get token refreshes working */}
      </header>
    </div>
  );
}
