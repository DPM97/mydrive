import { FiLogIn, FiPlus, FiX } from "react-icons/fi"
import { motion } from "framer-motion"

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
          <h3 className="text-2xl">Create Folder</h3>
          <FiX className="text-xl mt-1 hover:cursor-pointer" onClick={() => setModalActive(false)} />
        </div>
        <div className="mt-4">
          <div className="mb-5">
            <label for="name" className="block font-bold text-gray-800">Name</label>
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


export const LoginModal = ({ onSubmit }) => (
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
          <div className="mb-5">
            <label for="name" className="block font-bold text-gray-800">One Time Password</label>
            <input type="text" name="name" id="otp"
              className="w-full p-2 border border-gray-300 rounded-l shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="XXX XXX" />
          </div>
          <button
            className="block w-full p-3 font-bold text-white bg-teal-500 rounded-l"
            onClick={() => {
              onSubmit(document.getElementById("otp").value)
            }}
          >
            <FiLogIn className="text-center w-full text-xl" />
          </button>
        </div>
      </motion.div>
    </div>
  </div>
)