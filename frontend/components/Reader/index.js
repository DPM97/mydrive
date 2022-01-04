import { useRouter } from "next/router"
import DefaultErrorPage from 'next/error'

import { Viewer } from '@react-pdf-viewer/core'
import { Worker } from '@react-pdf-viewer/core'

import { zoomPlugin } from '@react-pdf-viewer/zoom'

import '@react-pdf-viewer/zoom/lib/styles/index.css'
import '@react-pdf-viewer/core/lib/styles/index.css'
import API_URI from "../../functions/uri"

const Reader = ({ isPublic }) => {
  const router = useRouter()
  const { id } = router.query

  const zoomPluginInstance = zoomPlugin()
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance

  if (id === undefined) {
    return <></>
  }

  console.log()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
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
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <Viewer
            theme="dark"
            defaultScale={1}
            withCredentials={!isPublic}
            fileUrl={`http://192.168.86.27:8080/files/JZOIpvTGaVArbRdTdTUKapMRmzNaHNTCjbaTKxiMfyMdqcluLNzGFfaODwLJYQpGgtwMGmQlyuHexuTZBFwwKhghSjIpjTSyLHNo`}
            plugins={[zoomPluginInstance]}
            renderError={() => <DefaultErrorPage statusCode={404} />}
          />
        </div>
      </Worker >
    </div>
  );
}

export default Reader