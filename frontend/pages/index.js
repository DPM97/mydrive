import { useState } from 'react'
import axios from 'axios'

const Home = () => {

  const [selectedFile, setSelectedFile] = useState(null)

  const submitHandler = () => {
    const data = new FormData();

    data.append(
      "uploadedFile",
      selectedFile,
      selectedFile.name
    );

    axios.post('http://localhost:8080/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  return (
    <div>
      <input type="file" id="input" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button type="submit" onClick={submitHandler}>upload</button>
    </div >
  )
}

export default Home