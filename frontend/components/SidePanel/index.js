import { FiPlus, FiUpload } from "react-icons/fi"
import axios from 'axios'
import genRelPath from "../../functions/genRelPath"
import { useState } from "react"
import { CreateFolderModal } from "../Modal"
import { AnimatePresence } from "framer-motion"
import API_URI from "../../functions/uri"

const SidePanel = ({ onChange, slug }) => {

  const [isModalActive, setModalActive] = useState(false)

  const handleUpload = async (selectedFile) => {
    if (selectedFile === null) return

    const data = new FormData();

    data.append(
      "uploadedFile",
      selectedFile,
      selectedFile.name
    );

    await axios.post(
      `${API_URI}/files?relativePath=${genRelPath(slug)}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      }
    )

    onChange()
  }

  const handleNewFolder = async (name) => {
    await axios.post(
      `${API_URI}/folders`,
      {
        relativePath: genRelPath(slug),
        name
      },
      { withCredentials: true }
    )

    onChange()
  }

  return (
    <>
      <AnimatePresence
        initial={false}
        exitBeforeEnter={true}
        onExitComplete={() => null}
      >
        {isModalActive && (
          <CreateFolderModal onSubmit={handleNewFolder} setModalActive={setModalActive} />
        )}
      </AnimatePresence>

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
            onClick={() => setModalActive(true)}
          >
            <div>
              <FiPlus className="inline-block mr-2 text-xl" />New Folder
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

export default SidePanel