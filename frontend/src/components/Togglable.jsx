import { useState, useImperativeHandle } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)
  const label = visible ? 'Close' : props.buttonLabel

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <button onClick={toggleVisibility}>{label}</button>
      {visible && props.children}
    </div>
  )
}

export default Togglable
