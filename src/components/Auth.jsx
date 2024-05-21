import { useEffect } from 'react';
import PropTypes from 'prop-types';

Auth.propTypes = {
}
export default function Auth() {
  let token = ''
  // TODO: We will need to change this to the Authorization Code flow later... Token based doesn't support refresh tokens.
  // TODO: Make use of authorization code flow with state (request thing)
  // TODO: Need to work on Express backend so we can login, then access, API data
  // NOTE: https://developer.spotify.com/documentation/web-api/tutorials/code-flow
  const CLIENT_ID = "cfc55caf7f324ca0ab3ccfb3bb8a90f5"
  const REDIRECT_URI = `http://localhost:${window.location.port}`
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "code"
  const SCOPES = ["user-library-read", "user-follow-read"]


  const callback = async (e) => {
    console.log(e)
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    console.log(searchParams)
    // token = window.localStorage.getItem("token")
    console.log(searchParams.has('code'))
    console.log(searchParams.get('code'))
  }, [])

  const logout = () => {
    token = ''
    window.localStorage.removeItem("token")
  }

  return (
    <div className="App">
      <header className="App-header">
        {!token ? <a
          className="App-link"
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES.join(' '))}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Login with Spotify
        </a> : <button onClick={logout}>Logout</button>
        }
      </header>
    </div>
  )
}

