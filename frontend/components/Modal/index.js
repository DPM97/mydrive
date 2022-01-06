import { FiLogIn, FiPlus, FiUserPlus, FiX } from "react-icons/fi"
import { motion } from "framer-motion"
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ReactTooltip from 'react-tooltip';
import API_URI from '../../functions/uri'

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    x: "100vw",
    opacity: 0,
    transition: {
      duration: 0.1
    }
  },
};

export const CreateFolderModal = ({ setModalActive, onSubmit }) => (
  <div className="container flex justify-center mx-auto">
    <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700">
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl p-6 bg-white rounded-md"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl">Create a folder</h3>
          <FiX className="text-xl mt-1 hover:cursor-pointer" onClick={() => setModalActive(false)} />
        </div>
        <div className="mt-4">
          <div className="mb-5">
            <label htmlFor="name" className="block font-bold text-gray-800">Name</label>
            <input type="text" name="name" id="createFolderName"
              className="w-full p-2 border border-gray-300 rounded-l shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter a folder name" />
          </div>
          <button
            className="block w-full p-3 font-bold text-white bg-teal-500 rounded-l"
            onClick={() => {
              onSubmit(document.getElementById("createFolderName").value)
              setModalActive(false)
            }}
          >
            <FiPlus className="text-center w-full text-xl" />
          </button>
        </div>
      </motion.div>
    </div>
  </div>
)


export const LoginModal = ({ onSubmit, onCreateAcct }) => (
  <div className="container flex justify-center mx-auto">
    <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700">
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl p-6 bg-white rounded-md"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl">Login</h3>
        </div>
        <div className="mt-4">
          <div className="mb-1">
            <label htmlFor="name" className="block font-bold text-gray-800">Email</label>
            <input type="text" name="name" id="email"
              className="w-full p-2 border border-gray-300 rounded-l shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="me@mysite.com" />
          </div>
          <div>
            <label htmlFor="name" className="block font-bold text-gray-800">One Time Password</label>
            <input type="text" name="name" id="otp"
              className="w-full p-2 border border-gray-300 rounded-l shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="XXXXXX" />
          </div>
          <a className="text-xs hover:cursor-pointer text-teal-500" onClick={onCreateAcct}>Create an account!</a>
          <button
            className="mt-4 block w-full p-3 font-bold text-white bg-teal-500 rounded-l"
            onClick={() => {
              onSubmit(document.getElementById("otp").value, document.getElementById("email").value)
            }}
          >
            <FiLogIn className="text-center w-full text-xl" />
          </button>
        </div>
      </motion.div>
    </div>
  </div>
)
export const CreateAcctModal = ({ onSubmit, onLogin }) => {

  const [qr, setQR] = useState("")
  const [secret, setSecret] = useState("<nil>")

  const genQrCode = async (email) => {
    try {
      const resp = await axios.get(`${API_URI}/qr?email=${email}`)
      setQR(resp.data.uri)
      setSecret(resp.data.secret)
    } catch (e) {
      toast.error(e.response.data)
    }
  }

  useEffect(() => {
    genQrCode()
  }, [setQR, setSecret])

  return (
    <div className="container flex justify-center mx-auto">
      <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700">
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="max-w-2xl p-6 bg-white rounded-md"
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl">Create an account</h3>
          </div>
          <div className="mt-4">
            <div className="mb-1">
              <label htmlFor="name" className="block font-bold text-gray-800">Email</label>
              <input type="text" name="name" id="email"
                className="w-full p-2 border border-gray-300 rounded-l shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="me@mysite.com"
                onChange={(e) => genQrCode(e.target.value)}
              />
            </div>
            <a className="text-xs hover:cursor-pointer text-teal-500" onClick={onLogin}>Already have one? Log in!</a>
            <div className="p-4 text-xs">
              <p className="text-center font-bold">OTP Secret</p>
              <p className="text-center pb-5">{secret}</p>
              <div className="p-5 pt-1 grid place-items-center grid-flow-col">
                <QRCode size={256} value={qr} data-tip="Scan me with google authenticator :)" />
              </div>
              <ReactTooltip place="bottom" effect="solid" />
            </div>
            <button
              className="mt-4 block w-full p-3 font-bold text-white bg-teal-500 rounded-l"
              onClick={() => {
                onSubmit(document.getElementById("email").value, secret)
              }}
            >
              <FiUserPlus className="text-center w-full text-xl" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}