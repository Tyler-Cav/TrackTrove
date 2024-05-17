import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';


Auth.propTypes = {
  setToken: PropTypes.func.isRequired
}
export default function Auth({setToken}) {
  // TODO: We will need to change this to the Authorization Code flow later... Token based doesn't support refresh tokens.
  // NOTE: https://developer.spotify.com/documentation/web-api/tutorials/code-flow
  const CLIENT_ID = "cfc55caf7f324ca0ab3ccfb3bb8a90f5"
  const REDIRECT_URI = `http://localhost:${window.location.port}`
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPES = ["user-library-read", "user-follow-read"]

  const [token] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      console.log("token", token)
      console.log("hash", hash)
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      console.log("tokenAfter", token)

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [setToken])

  const logout = () => {
    setToken("")
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

