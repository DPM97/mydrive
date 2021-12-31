import { FiPlus, FiUpload } from "react-icons/fi"
import axios from 'axios'

const SidePanel = ({ onChange }) => {

  const handleUpload = async (selectedFile) => {
    if (selectedFile === null) return

    const data = new FormData();

    data.append(
      "uploadedFile",
      selectedFile,
      selectedFile.name
    );

    await axios.post(
      `http://localhost:8080${window.location.pathname}${window.location.pathname.endsWith('/') ? '' : '/'}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    onChange()
  }

  const handleNewFolder = async () => {
    await axios.post(
      `http://localhost:8080/folders/create`,
      {
        relativePath: `${window.location.pathname.replace('/files', '')}${window.location.pathname.endsWith('/') ? '' : '/'}`,
        name: 'testing'
      }
    )

    onChange()
  }

  return (
    <div className="grid grid-cols-1 place-items-center mt-10 gap-2">
      <div>
        <input type="file" id="fileUpload" className="hidden"
          onChange={(e) => handleUpload(e.target.files[0])}
        />
        <button
          className="bg-neutral-300 hover:bg-neutral-400 text-white text-md font-bold py-2 px-4 rounded-sm"
          onClick={() => document.getElementById("fileUpload").click()}
        >
          <div>
            <FiUpload className="inline-block mr-2 text-xl" />Upload File
          </div>
        </button>
      </div>
      <div>
        <button
          className="bg-neutral-300 hover:bg-neutral-400 text-white text-md font-bold py-2 px-4 rounded-sm"
          onClick={handleNewFolder}
        >
          <div>
            <FiPlus className="inline-block mr-2 text-xl" />New Folder
          </div>
        </button>
      </div>
    </div>
  )
}

export default SidePanel