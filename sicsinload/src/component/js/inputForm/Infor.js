import React from "react"

const Infor = (props) => {
    
    return (
        <div style={{display:'flex',flexDirection:'row'}}>
            <div style={{width:120,display:'flex'}}>{props.label}</div>
            <div>
                <div>{props.value}</div>
            </div>
        </div>
    )
}
export default Infor