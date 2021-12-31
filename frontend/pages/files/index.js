import { useEffect, useState } from 'react'
import File from '../../components/File'
import axios from 'axios'
import Header from '../../components/Header'
import SidePanel from '../../components/SidePanel'

const Home = () => {

  const [files, setFiles] = useState([])

  const fetchFiles = async () => {
    const resp = await axios.get(
      `http://localhost:8080${window.location.pathname}${window.location.pathname.endsWith('/') ? '' : '/'}`
    )
    setFiles(resp.data)
  }

  useEffect(async () => {
    await fetchFiles()
  }, [])

  return (
    <div>
      <Header />
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: '200px calc(100% - 200px)'
        }}
      >
        <div className="bg-neutral-100 min-w-max" style={{ minHeight: 'calc(100vh - 85px)' }}>
          <SidePanel onChange={fetchFiles} />
        </div>
        <div className="grid w-full gap-5 p-10"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, 18rem)',
            gridTemplateRows: 'repeat(auto-fill, 10rem)'
          }}
        >
          {files.map((file, i) => (
            <File {...file} key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}


export default Home