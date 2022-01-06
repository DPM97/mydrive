import { useRouter } from "next/router"
import DefaultErrorPage from 'next/error'

import { SpecialZoomLevel, Viewer } from '@react-pdf-viewer/core'
import { Worker } from '@react-pdf-viewer/core'

import { zoomPlugin } from '@react-pdf-viewer/zoom'

import '@react-pdf-viewer/zoom/lib/styles/index.css'
import '@react-pdf-viewer/core/lib/styles/index.css'
import API_URI from "../../functions/uri"

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