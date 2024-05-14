import './App.css'
import axios from "axios";
import { useState } from 'react';
import Auth from './components/Auth'


function App() {
  const [token, setToken] = useState("")

  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])

  const searchArtists = async (e) => {
    e.preventDefault()
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })

    setArtists(data.artists.items)
  }

  return (
    <>
      <Auth token = />
      <form onSubmit={searchArtists}>
        <input type="text" onChange={e => setSearchKey(e.target.value)} />
        <button type={"submit"}>Search</button>
      </form>
    </>
  )
}
export default App
