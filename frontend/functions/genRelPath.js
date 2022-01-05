const genRelPath = (slug) => slug.length === 0 ? '/' : `/${slug.join('/')}/`

export default genRelPath