import { FiHardDrive } from 'react-icons/fi'
import Router from 'next/router'


const Home = () => (
  <div
    className="
    h-screen 
    w-screen 
    grid 
    grid-cols-1 
    gap-4 
    place-content-center
    text-center
    "
  >
    <a className="text-xl select-none font-mono"
      onClick={() => {
        Router.push('/files/')
      }}>
      <FiHardDrive className="w-screen h-20" />
      Enter MyDrive
    </a>
  </div>
)

export default Home