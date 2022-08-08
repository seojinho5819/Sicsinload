import { useEffect } from "react"

export const MenuItem = ({item}) =>{

    return(
        <div style={{border:'1px solid black'}}>
            <div>{item.name}</div>
            <div>{item.price}</div>
        </div>
    )
}

const Menu = ({menuInfo}) =>{
    menuInfo = menuInfo.split(' | ')
    menuInfo= menuInfo.map((item) => {
        let complate = '{"name" : ';
        item = item.replace(/ /,',"price" : ')
        item = complate.concat(item+'}')
        item = item.replace(/}/gi,'"}')
        item = item.replace(/: /gi,': "')
        item = item.replace(/\)/gi,')"')
        console.log(item)
        return JSON.parse(item)
    })
    
    console.log(menuInfo)
   
    return (
        <div>
        {menuInfo?.map((item,index) => (
            <MenuItem 
                key={index}
                item={item}
            />
        ))
        }
        </div>
        
    )
} 
export default Menu