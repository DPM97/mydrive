import { useEffect, useState } from 'react'
import File from '../../components/File'
import axios from 'axios'
import Header from '../../components/Header'
import SidePanel from '../../components/SidePanel'
import genRelPath from '../../functions/genRelPath'

export const Files = ({ slug }) => {
  const [files, setFiles] = useState([])

  const fetchFiles = async () => {
    const resp = await axios.get(
      `http://localhost:8080/files?relativePath=${genRelPath(slug)}`
    )
    setFiles(resp.data)
  }

  useEffect(() => {
    if (slug !== null) fetchFiles()
  }, [slug])

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
          <SidePanel onChange={fetchFiles} slug={slug} />
        </div>
        <div className="grid w-full gap-5 p-10"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, 18rem)',
            gridTemplateRows: 'repeat(auto-fill, 10rem)'
          }}
        >
          {files.map((file, i) => (
            <File slug={slug} onChange={fetchFiles} {...file} key={i} />
          ))}
        </div>
      </div>
    </div>
  )
};

export const Home = () => <Files slug={[]} />


export default Home