import { useRouter } from "next/router"
import DefaultErrorPage from 'next/error'
import { FiDownload } from "react-icons/fi"

import { SpecialZoomLevel, Viewer } from '@react-pdf-viewer/core'
import { Worker } from '@react-pdf-viewer/core'

import { zoomPlugin } from '@react-pdf-viewer/zoom'

import '@react-pdf-viewer/zoom/lib/styles/index.css'
import '@react-pdf-viewer/core/lib/styles/index.css'
import API_URI from "../../functions/uri"
import { download } from "../File"

const Reader = ({ isPublic }) => {
  const { query, isReady } = useRouter()

  if (!isReady) return <div></div>

  const { id } = query

  const zoomPluginInstance = zoomPlugin()
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance

  return (
    <div className="min-h-screen min-w-screen" style={{ backgroundColor: '#ffffff' }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.11.338/build/pdf.worker.min.js">
        <div
          className="absolute z-50 top-3.5 hover:cursor-pointer"
          style={{
            left: 'calc(100vw - 40px)'
          }}
        >
          <FiDownload color="#5c5c5c" size="20" onClick={() => download(id)} />
        </div>
        <div
          style={{
            alignItems: 'center',
            backgroundColor: '#eeeeee',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            padding: '4px',
          }}
        >
          <ZoomOutButton />
          <ZoomPopover />
          <ZoomInButton />
        </div>
        <div
          style={{
            height: 'calc(100vh - 49px)',
          }}
        >
          <Viewer
            defaultScale={SpecialZoomLevel.PageFit}
            withCredentials={!isPublic}
            fileUrl={`${API_URI}/files/${id}`}
            plugins={[zoomPluginInstance]}
            renderError={(e) => {
              console.log(e)
              return <DefaultErrorPage statusCode={404} />
            }}
          />
        </div>
      </Worker >
    </div>
  );
}

export default Reader