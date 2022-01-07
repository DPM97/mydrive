import { FiPlus, FiUpload } from "react-icons/fi"
import axios from 'axios'
import genRelPath from "../../functions/genRelPath"
import { useEffect, useState } from "react"
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

  const handleUploadProgress = (e, total) => {
    setUploader({
      active: true,
      percent: ((e.loaded / total) * 100).toFixed(0)
    })
  }

  const handleUpload = async (selectedFiles) => {
    selectedFiles = Array.from(selectedFiles)

    if (selectedFiles.length === 0) return

    let totalSize = 0

    selectedFiles.forEach(file => {
      totalSize += file.size
    })

    setUploader({
      percent: 0,
      active: true
    })

    let err = false
    for (let file of selectedFiles) {
      if (file.name.startsWith('.')) continue;

      const data = new FormData();

      data.append(
        "uploadedFile",
        file,
        file.name
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
            onUploadProgress: (e) => handleUploadProgress(e, totalSize)
          }
        )
      } catch (e) {
        err = true
        toast.error(e.response.data)
      }
    }

    if (!err) {
      toast.success(`File${selectedFiles.length > 1 ? 's' : ''} uploaded!`)
    }

    setUploader({
      active: false,
      percent: 0
    })

    onChange()
  }

  const handleUploadFolder = async (selectedFiles) => {
    selectedFiles = Array.from(selectedFiles)

    if (selectedFiles.length === 0) return

    let totalSize = 0

    selectedFiles.forEach(file => {
      totalSize += file.size
    })

    setUploader({
      percent: 0,
      active: true
    })

    selectedFiles = selectedFiles.sort((a, b) =>
      a.webkitRelativePath.split('/').length
      -
      b.webkitRelativePath.split('/').length
    )

    let createdFolders = []

    let err = false
    for (let file of selectedFiles) {
      if (file.name.startsWith('.')) continue;

      let relPath = file.webkitRelativePath.split('/')
      relPath.pop()

      let folderPath = relPath.join('/')

      if (!createdFolders.includes(folderPath)) {
        let folderName = relPath[relPath.length - 1]
        let path = [...relPath]
        path.pop()
        path = path.join('/')


        await handleNewFolder(folderName, path === '' ? '' : path + '/')

        createdFolders.push(folderPath)
      }

      const data = new FormData();

      data.append(
        "uploadedFile",
        file,
        file.name
      );

      try {
        await axios.post(
          `${API_URI}/files?relativePath=${genRelPath(slug)}${relPath.join('/')}/`,
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            onUploadProgress: (e) => handleUploadProgress(e, totalSize)
          }
        )
      } catch (e) {
        err = true
        toast.error(e.response.data)
      }
    }


    if (!err) {
      toast.success(`File${selectedFiles.length > 1 ? 's' : ''} uploaded!`)
    }

    setUploader({
      active: false,
      percent: 0
    })

    onChange()

  }

  const [isLoading, setIsLoading] = useState(false)

  const handleNewFolder = async (name, path = null) => {
    setIsLoading(true)
    try {
      await axios.post(
        `${API_URI}/folders`,
        {
          relativePath: path ? genRelPath(slug) + path : genRelPath(slug),
          name
        },
        { withCredentials: true }
      )
      if (path === null) toast.success('Folder created!')
    } catch (e) {
      toast.error(e.response.data)
    }

    setIsLoading(false)
    onChange()
  }

  // react doesn't support this for some reason so we need to do it manually
  useEffect(() => {
    document.getElementById('folderUpload').setAttribute('directory', true)
    document.getElementById('folderUpload').setAttribute('webkitdirectory', true)
    document.getElementById('folderUpload').setAttribute('mozdirectory', true)
  })

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
        <div className="w-full pl-5 pr-5">
          <input type="file" id="fileUpload" className="hidden"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            className="bg-neutral-300 hover:bg-neutral-400 text-white text-sm font-bold py-2 px-4 rounded-sm w-full"
            onClick={() => document.getElementById("fileUpload").click()}
          >
            <div>
              <FiUpload className="inline-block mr-2 text-xl" />Upload Files
            </div>
          </button>
        </div>

        <div className="w-full pl-5 pr-5">
          <input type="file" id="folderUpload" className="hidden"
            onChange={(e) => handleUploadFolder(e.target.files)}
          />
          <button
            className="bg-neutral-300 hover:bg-neutral-400 text-white text-sm font-bold py-2 px-4 rounded-sm w-full"
            onClick={() => document.getElementById("folderUpload").click()}
          >
            <div>
              <FiUpload className="inline-block mr-2 text-xl" />Upload Folder
            </div>
          </button>
        </div>

        <div className="w-full pl-5 pr-5">
          <button
            className="bg-neutral-300 hover:bg-neutral-400 text-white text-sm font-bold py-2 px-4 rounded-sm w-full"
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