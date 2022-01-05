import axios from "axios"
import Router from "next/router"
import { FiDownload, FiEye, FiFolder, FiTrash, FiUsers } from "react-icons/fi"
import { toast } from "react-toastify"
import canViewFile from "../../functions/canViewFile"
import parseTime from "../../functions/parseTime"
import API_URI from "../../functions/uri"
import Button from "../Button"

const File = ({ id, path, uploaded_at, name, file_type, size, pid, onChange }) => {
  const sizeInMb = size.Int32 / 1000000

  const download = async () => {
    let resp
    try {
      resp = await axios.get(`${API_URI}/download/${id.Int32}`, { responseType: 'blob', withCredentials: true })
    } catch (e) {
      toast.error(e.response.data)
    }
    const url = window.URL.createObjectURL(new Blob([resp.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name.String);
    document.body.appendChild(link);
    link.click();
  }

  const deleteFile = async () => {
    try {
      await axios.delete(`${API_URI}/files/${id.Int32}`, { withCredentials: true })
    } catch (e) {
      toast.error(e.response.data)
    }
    onChange()
  }

  const deleteFolder = async () => {
    try {
      await axios.delete(`${API_URI}/folders/${id.Int32}`, { withCredentials: true })
    } catch (e) {
      toast.error(e.response.data)
    }
    onChange()
  }

  return (
    <div className="border-2 h-40 w-72 rounded-lg grid"
      style={{
        gridTemplateColumns: '3fr 1fr'
      }}
    >
      <div className="h-full p-3">
        {file_type.String !== "folder" && (
          <div className="h-full">
            <p className="text-sm font-bold h-3/4">
              {name.String}
            </p>
            <div>
              <p className="text-xs">
                Size: {sizeInMb.toFixed(2)} MB
              </p>
              <p className="text-xs">Uploaded:
                {parseTime(uploaded_at.Time)}
              </p>
            </div>
          </div>
        )}
        {file_type.String === "folder" && (
          <div className="grid h-full place-items-center cursor-pointer" onClick={() => {
            Router.push(`/files${path.String}${name.String}`)
          }}>
            <FiFolder style={{ fontSize: '70px' }} />
            <p className="text-sm font-bold">{name.String}</p>
          </div>
        )}
      </div>
      <div className="bg-neutral-200 rounded-r-md grid grid-cols-1 text-center place-content-center gap-5">
        <Button OnClick={download} Icon={FiDownload} />
        {file_type.String === "folder" && (
          <Button OnClick={deleteFolder} Icon={FiTrash} />
        )}
        {file_type.String !== "folder" && (
          <Button OnClick={deleteFile} Icon={FiTrash} />
        )}
        {canViewFile(file_type.String) && (
          <Button OnClick={() => window.open(`/view/${id.Int32}`, '_blank')} Icon={FiEye} />
        )}
        {canViewFile(file_type.String) && (
          <Button OnClick={() => window.open(`/view/public/${pid.String}`, '_blank')} Icon={FiUsers} />
        )}
      </div>

    </div>
  )
}

export default File