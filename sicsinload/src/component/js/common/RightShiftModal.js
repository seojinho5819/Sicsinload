import React, {useEffect, useRef, useState } from "react";
import  '../../css/common/RightShiftModal.css'

const RightShiftModal = ({ width,isSidebar,setIsSidebar, children }) => {
    const [isOpen, setOpen] = useState(false);
    const [xPosition, setX] = useState(-width);
    const side = useRef();

    useEffect(()=>{
        //마커 클릭시
       
        if(isSidebar){
            setX(0);
            setOpen(true);
            
        }else{
            setX(-width);
            setOpen(false);
        }
	// eslint-disable-next-line react-hooks/exhaustive-deps    
    },[isSidebar])
    
    // button 클릭 시 토글
    const toggleMenu = () => {
      if (xPosition < 0) {
        setX(0);
        setOpen(true);
      } else {
        setX(-width);
        setOpen(false);
        setIsSidebar(false)
      }
    };
    
    return(
        <div className='container' style={{}}>
        <div ref={side}  className='sidebar' style={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPosition}px)`}}>
            <button onClick={toggleMenu}
            className={'button'} >
              {isOpen ? 
              <span>{'>>'}</span> : <span className={'openBtn'}>{'<<'}</span>
              }
            </button>
          <div className={'content'}>{children}</div> 
        </div>
      </div>
    )
}
export default RightShiftModal;