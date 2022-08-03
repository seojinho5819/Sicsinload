import React from "react"

const Input = ({colLabel,label,type,value,readOnly}) => {
    
    return (
        <div style={{display:'flex',flexDirection:colLabel?colLabel:'row'}}>
            <div style={{width:100,marginRight:10}}>{label}</div>
            <div>
                <input
                    style={{width:180,border: 'none', background: 'transparent'}}
                    type={type}
                    label={label}
                    value={value}
                    readOnly={readOnly}
                ></input>
            </div>
        </div>
    )
}
export default Input