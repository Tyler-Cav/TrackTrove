import './App.css'

function App() {
  const CLIENT_ID = "cfc55caf7f324ca0ab3ccfb3bb8a90f5"
  const REDIRECT_URI = `http://localhost:${window.location.port}`
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Login with Spotify
        </a>
      </header>
    </div>
  )
}

export default App
