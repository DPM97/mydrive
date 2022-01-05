import axios from "axios"
import { useState, useEffect } from "react"
import ReactTooltip from 'react-tooltip';

import API_URI from "../../functions/uri"

const StorageBar = () => {

  const [storageData, setStorageData] = useState({
    total: {
      value: "0.00 GB",
      percent: 0
    },
    used: {
      value: "0.00 GB",
      percent: 0
    },
    free: {
      value: "0.00 GB",
      percent: 0
    },
  })


  useEffect(() => {
    const fetchData = async () => {
      let resp = null
      try {
        resp = await axios.get(
          `${API_URI}/storage`,
          { withCredentials: true }
        )
      } catch (e) {
        console.log(e)
        // throw err usually
      }
      if (resp) setStorageData(resp.data)
    }

    fetchData()
  }, [setStorageData])

  const [tt, setTT] = useState({
    ref: null,
    text: ''
  })


  return (
    <div style={{ width: '75%' }} className="text-xs">
      <p className="text-right w-full">{storageData.total.value}</p>
      <div className="mb-8 h-4 grid-flow-col grid w-full"
        ref={ref => {
          if (ref && !tt.ref) setTT({ ...tt, ref })
          return tt.ref
        }}
        data-tip={tt.text}
        style={{
          gridTemplateColumns: `${storageData.used.percent > 2 ? storageData.used.percent : 2}%`
        }}
      >
        <div className="bg-teal-500 leading-none rounded-l-sm h-full"
          onMouseOver={() => {
            setTT({ ...tt, text: `Used: ${storageData.used.value}` })
          }}
        ></div>
        <div className="bg-gray-200 leading-none rounded-sm h-full"
          onMouseOver={() => {
            setTT({ ...tt, text: `Free: ${storageData.free.value}` })
          }}
        ></div>
      </div>
      <ReactTooltip place="bottom" effect="solid" offset={{ bottom: -5 }} getContent={() => <p className="text-xs">{tt.text}</p>} />
    </div>
  )
}

export default StorageBar