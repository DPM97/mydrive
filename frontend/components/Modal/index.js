import { FiPlus, FiX } from "react-icons/fi"

const Modal = ({ title, setModalActive, onSubmit }) => (
  <div className="container flex justify-center mx-auto">
    <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-700">
      <div className="max-w-2xl p-6 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl">{title}</h3>
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
      </div>
    </div>
  </div>
)

export default Modal