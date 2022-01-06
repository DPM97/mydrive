import { FiPlus, FiUpload } from "react-icons/fi"
import axios from 'axios'
import genRelPath from "../../functions/genRelPath"
import { useState } from "react"
import { CreateFolderModal, UploadModel } from "../Modal"
import { AnimatePresence } from "framer-motion"
import API_URI from "../../functions/uri"
import StorageBar from "../StorageBar"
import { toast } from "react-toastify"

const SidePanel = ({ onChange, slug }) => {

  const [isModalActive, setModalActive] = useState(false)

  const [uploader, setUploader] = useState({
    active: false,
    percent: 0
  })

  const handleUploadProgress = (e) => {
    setUploader({
      active: true,
      percent: ((e.loaded / e.total) * 100).toFixed(0)
    })
  }

  const handleUpload = async (selectedFile) => {
    if (selectedFile === null) return

    setUploader({
      percent: 0,
      active: true
    })

    const data = new FormData();

    data.append(
      "uploadedFile",
      selectedFile,
      selectedFile.name
    );

    try {
      await axios.post(
        `${API_URI}/files?relativePath=${genRelPath(slug)}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
          onUploadProgress: handleUploadProgress
        }
      )
      toast.success('File uploaded!')
    } catch (e) {
      toast.error(e.response.data)
    }

    setUploader({
      active: false,
      percent: 0
    })

    onChange()
  }

  const [isLoading, setIsLoading] = useState(false)

  const handleNewFolder = async (name) => {
    setIsLoading(true)
    try {
      await axios.post(
        `${API_URI}/folders`,
        {
          relativePath: genRelPath(slug),
          name
        },
        { withCredentials: true }
      )
      toast.success('Folder created!')
    } catch (e) {
      toast.error(e.response.data)
    }

    setIsLoading(false)
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
          <CreateFolderModal onSubmit={handleNewFolder} setModalActive={setModalActive} isLoading={isLoading} />
        )}
        {uploader.active && (
          <UploadModel percent={uploader.percent} />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 place-items-center mt-5 gap-2">
        <StorageBar />
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