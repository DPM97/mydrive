import { useState } from "react"

const Button = ({ OnClick, Icon }) => {

  const [iconColor, setIconColor] = useState('#737373')

  return (
    <a
      className="w-full text-xl"
      onClick={OnClick}
      onMouseEnter={() => setIconColor('#262626')}
      onMouseLeave={() => setIconColor('#737373')}
    >
      <Icon color={iconColor} className="block m-auto" />
    </a>
  )
}

export default Button