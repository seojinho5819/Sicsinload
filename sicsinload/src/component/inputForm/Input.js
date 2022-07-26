import React, { useEffect } from "react"


const Input = ({colLabel,label,type}) => {
    // useEffect(() => {

    // },[colLabel,label,type])
    return (
        // <div className={'d-flex'+colLabel?'flex-column':'flex-row'}>
        <div className={'d-flex flex-row'}>
            <div className="border">{label}</div>
            <div className="border">
                <input
                    type={type}
                    label={label}
                ></input>
            </div>
        </div>
    )
}
export default Input