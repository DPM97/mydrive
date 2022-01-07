import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import File from '../../components/File'
import Header from '../../components/Header'
import SidePanel from '../../components/SidePanel'
import genRelPath from '../../functions/genRelPath'
import Breadcrumbs from '../../components/Breadcrumbs.js'
import { CreateAcctModal, LoginModal } from '../../components/Modal'
import API_URI from '../../functions/uri'

import 'react-toastify/dist/ReactToastify.css';

const Files = ({ slug }) => {
  const [files, setFiles] = useState([])
  const [authorized, setAuth] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const fetchFiles = useCallback(async () => {
    let resp = null
    try {
      resp = await axios.get(
        `${API_URI}/files?relativePath=${genRelPath(slug)}`,
        { withCredentials: true }
      )
    } catch (e) {
      if (e && e.response && e.response.status === 401) {
        setAuth(false)
      } else {
        toast.error(e.response.data)
      }
    }
    if (resp) setFiles(resp.data)
  }, [slug])

  const [isLoading, setIsLoading] = useState(false)

  const login = async (otp, email) => {
    setIsLoading(true)
    let resp = null
    try {
      resp = await axios.post(`${API_URI}/login`,
        { otp, email },
        { withCredentials: true }
      )
    } catch (e) {
      toast.error(e.response.data)
    }
    if (resp) setAuth(true)
    setIsLoading(false)
    fetchFiles()
  }

  const createAcct = async (email, OTPSecret) => {
    setIsLoading(true)
    try {
      await axios.post(`${API_URI}/accounts`,
        { OTPSecret, email },
        { withCredentials: true }
      )
    } catch (e) {
      toast.error(e.response.data)
      setIsLoading(false)
      return
    }
    toast.success('Account created successfully! Please log in.')
    setIsLoading(false)
    setShowCreate(false)
  }

  useEffect(() => {
    if (slug !== null) fetchFiles()
  }, [slug, fetchFiles])

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        closeOnClick
        pauseOnHover
      />
      {!showCreate && !authorized && (
        <LoginModal setModalActive={setAuth} onSubmit={login} isLoading={isLoading} onCreateAcct={() => {
          setShowCreate(true)
        }} />
      )}
      {showCreate && !authorized && (
        <CreateAcctModal onSubmit={createAcct} isLoading={isLoading} onLogin={() => {
          setShowCreate(false)
        }} />
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

export { Home as default, Files }