import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { Files } from './index'

const Slug = () => {
  const router = useRouter()
  const [slug, setSlug] = useState(null)

  useEffect(() => {
    if (router.query.slug) setSlug([...router.query.slug])
  }, [router.query.slug])

  return (
    <Files slug={slug} />
  )
};

export default Slug