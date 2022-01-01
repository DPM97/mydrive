import Router from 'next/router'
import { useEffect } from 'react'

const Home = () => {
  useEffect(() => {
    Router.push('/files/')
  })

  return (<></>)
}

export default Home