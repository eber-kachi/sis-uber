import React, { useState } from 'react';

const CustomSwitch = ({ enabled, ...props }) => {
  // const [enabled, setEnabled] = useState(enabledAux);

  return (
    <>
      <div className="form-check form-switch"
        {...props}
      >
        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={enabled} readOnly></input>
        {/* <label className="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label> */}
      </div>
    </>
  )
}

export default CustomSwitch;
