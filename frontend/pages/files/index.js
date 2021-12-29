import { useEffect, useState } from 'react'
import File from '../../components/File'
import axios from 'axios'
import Header from '../../components/Header'

const Home = () => {

  const [selectedFile, setSelectedFile] = useState(null)
  const [files, setFiles] = useState([])

  useEffect(async () => {
    const resp = await axios.get(
      `http://localhost:8080${window.location.pathname}${window.location.pathname.endsWith('/') ? '' : '/'}`
    )
    setFiles(resp.data)
  }, [])

  const submitHandler = () => {
    const data = new FormData();

    data.append(
      "uploadedFile",
      selectedFile,
      selectedFile.name
    );

    axios.post(`http://localhost:8080${window.location.pathname}${window.location.pathname.endsWith('/') ? '' : '/'}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  return (
    <div>
      <Header />
      <div className="grid grid-flow-col auto-cols-max gap-5 p-10">
        {files.map((file, i) => (
          <File {...file} key={i} />
        ))}
      </div>
    </div>
  )
}

/*
      <input type="file" id="input" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button type="submit" onClick={submitHandler}>upload</button>
*/

export default Home