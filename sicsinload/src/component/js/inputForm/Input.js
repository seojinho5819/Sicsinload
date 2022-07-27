import React from "react"

const Input = ({colLabel,label,type}) => {
    
    return (
        <div style={{display:'flex',flexDirection:colLabel?colLabel:'row'}}>
            <div style={{width:100,marginRight:10}}>{label}</div>
            <div>
                <input
                    style={{width:180}}
                    type={type}
                    label={label}
                ></input>
            </div>
        </div>
    )
}
export default Input