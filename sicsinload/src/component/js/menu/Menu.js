import React, { useEffect } from "react"
import { isEmptyObj } from "../../../utils/util"

export const MenuItem = ({item}) =>{

    return(
        <div style={{border:'1px solid black'}}>
            <div>{item.name}</div>
            <div>{item.price}</div>
        </div>
    )
}

const Menu = ({menuInfo}) =>{
    if(menuInfo != null){
        menuInfo = menuInfo.split(' | ')
        menuInfo = menuInfo.map((item) => {
            let complate = '{"name" : '; //맨앞
            item = item.replace(/ /,'","price" : ')//value 앞
            item = complate.concat(item+'}')
            item = item.replace(/}/gi,'"}') //맨뒤
            item = item.replace(/: /gi,': "') //key 중간
        
            return JSON.parse(item)
        })
    }else{
        menuInfo = []
    }
 
   
    return (
        <div>
        {menuInfo[0]?.name.length > 0 ?
            menuInfo?.map((item,index) => (
            <MenuItem 
                key={index}
                item={item}
            />
        ))
        :<div>등록된 메뉴가 없습니다.</div>
        }
        </div>
        
    )
} 
export default Menu