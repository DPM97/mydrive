import axios from "axios"
import { useState } from "react"
import { FiDownload, FiFolder } from "react-icons/fi"

const File = ({ id, loid, path, uploaded_at, name, file_type, size }) => {
  const upload_date = new Date(uploaded_at.Time)
  const sizeInMb = size.Int32 / 1000000
  const [iconColor, setIconColor] = useState('#262626')

  const download = async () => {
    const resp = await axios.get(`http://localhost:8080/download/${id.Int32}`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([resp.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name.String);
    document.body.appendChild(link);
    link.click();
  }

  return (
    <div className="border-2 h-40 w-72 rounded-lg grid"
      style={{
        gridTemplateColumns: '3fr 1fr'
      }}
    >
      <div className="h-full p-3">
        {file_type.String !== "folder" && (
          <div>
            <p className="text-sm font-bold h-3/4">
              {name.String}
            </p>
            <div>
              <p className="text-xs">
                Size: {sizeInMb.toFixed(2)} MB
              </p>
              <p className="text-xs">Uploaded:
                {` 
        ${upload_date.getDay()}/${upload_date.getMonth()}/${upload_date.getFullYear()}
         ${upload_date.getHours() % 12}:${upload_date.getMinutes() < 10 ? '0' + upload_date.getMinutes() : upload_date.getMinutes()}
         ${upload_date.getHours() >= 12 ? 'PM' : 'AM'}
        `}
              </p>
            </div>
          </div>
        )}
        {file_type.String === "folder" && (
          <div className="grid h-full place-items-center">
            <FiFolder style={{ fontSize: '70px' }} />
            <p className="text-sm font-bold">{name.String}</p>
          </div>
        )}
      </div>
      <div className="bg-neutral-200 rounded-r-md grid grid-rows-1 text-center pt-3 place-content-center">
        <a
          className="w-full text-xl"
          onClick={download}
          onMouseEnter={() => setIconColor('#262626')}
          onMouseLeave={() => setIconColor('#737373')}
        >
          <FiDownload
            color={iconColor}
          />
        </a>
      </div>
    </div>
  )
}

export default File