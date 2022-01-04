import { useCallback, useEffect, useState } from 'react'
import File from '../../components/File'
import axios from 'axios'
import Header from '../../components/Header'
import SidePanel from '../../components/SidePanel'
import genRelPath from '../../functions/genRelPath'
import Breadcrumbs from '../../components/Breadcrumbs.js'
import { LoginModal } from '../../components/Modal'

export const Files = ({ slug }) => {
  const [files, setFiles] = useState([])
  const [authorized, setAuth] = useState(true)

  const fetchFiles = useCallback(async () => {
    let resp = null
    try {
      resp = await axios.get(
        `http://localhost:8080/files?relativePath=${genRelPath(slug)}`,
        { withCredentials: true }
      )
    } catch (e) {
      if (e && e.response && e.response.status === 401) {
        setAuth(false)
      }
    }
    if (resp) setFiles(resp.data)
  }, [slug])

  const login = async (otp) => {
    let resp = null
    try {
      resp = await axios.post('http://localhost:8080/login',
        { otp },
        { withCredentials: true }
      )
    } catch (e) {
      console.log(e)
      // throw error
    }
    if (resp) setAuth(true)
    fetchFiles()
  }

  useEffect(() => {
    if (slug !== null) fetchFiles()
  }, [slug, fetchFiles])

  return (
    <div>
      {!authorized && (
        <LoginModal setModalActive={setAuth} onSubmit={login} />
      )}
      <Header setFiles={setFiles} setAuth={setAuth} />
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: '200px calc(100% - 200px)'
        }}
      >
        <div className="bg-neutral-100 min-w-max" style={{ minHeight: 'calc(100vh - 85px)' }}>
          <SidePanel onChange={fetchFiles} slug={slug} />
        </div>
        <div>
          <Breadcrumbs slug={slug} />
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
    </div>
  )
};

export const Home = () => <Files slug={[]} />


export default Home