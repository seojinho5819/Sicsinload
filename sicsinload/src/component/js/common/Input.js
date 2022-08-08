import React from "react"

const Input = ({colLabel,label,type,value,readOnly}) => {
    
    return (
        <div style={{display:'flex',flexDirection:colLabel?colLabel:'row'}}>
            <div style={{width:200,border:'1px solid black'}}>{label}</div>
            <div>
                <input
                    style={{width:230,border: 'none', background: 'transparent',border:'1px solid black'}}
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