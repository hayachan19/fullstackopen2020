import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
const Toggleable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hiddenByDefault = { display: visible ? 'none' : '' }
  const shownByDefault = { display: visible ? '' : 'none' }

  const toggleVisibility = () => { setVisible(!visible) }
  useImperativeHandle(ref, () => { return { toggleVisibility } })

  return (
    <div>
      <div style={hiddenByDefault}>
        <Button onClick={toggleVisibility}>{props.openLabel}</Button>
      </div>
      <div style={shownByDefault}>
        {props.children}
        <Button variant='danger' onClick={toggleVisibility}>{props.closeLabel}</Button>
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