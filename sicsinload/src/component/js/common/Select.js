const Select = ({colLabel,label,optionList}) => {
    
    return (
        <div style={{display:'flex',flexDirection:colLabel?colLabel:'row'}}>
            <div style={{width:100,marginRight:10}}>{label}</div>
            <div >
              <select style={{width:180}}>
                {optionList.map((e,index) => (
                    <option key={index} value={e}>{e}</option>
                ))}
              </select>
            </div>
        </div>
    )
}
export default Select