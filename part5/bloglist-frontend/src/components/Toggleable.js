import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Toggleable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hiddenByDefault = { display: visible ? 'none' : '' }
  const shownByDefault = { display: visible ? '' : 'none' }

  const toggleVisibility = () => { setVisible(!visible) }
  useImperativeHandle(ref, () => { return { toggleVisibility } })

  return (
    <div>
      <div style={hiddenByDefault}>
        <button onClick={toggleVisibility}>{props.openLabel}</button>
      </div>
      <div style={shownByDefault}>
        {props.children}
        <button onClick={toggleVisibility}>{props.closeLabel}</button>
      </div>
    </div>
  )
})

Toggleable.displayName = 'Toggleable'
Toggleable.propTypes = {
  openLabel: PropTypes.string.isRequired,
  closeLabel: PropTypes.string.isRequired,
}

export default Toggleable