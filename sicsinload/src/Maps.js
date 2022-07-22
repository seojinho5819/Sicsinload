import { useState,useEffect } from 'react';
import { RenderAfterNavermapsLoaded, NaverMap, Marker, Circle} from 'react-naver-maps';
import { PersonFill } from 'react-bootstrap-icons';


function NaverMapComponent() {
  const navermaps = window.naver.maps;
  const [ myLocation, setMyLocation ] = useState({ lat: 37.2801708, lng: 127.1193201});

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(success,error)

    function success(position){
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setMyLocation({'lat':lat,'lng': lng})
    }
    function error(){
      setMyLocation({ lat: 37.2801708, lng: 127.1193201});
    }
  },[])

  const icon = {
    content: [
      `<img alt="marker" src="../public/images.png" />`
        ].join(''),
    size: new navermaps.Size(38, 58),
    anchor: new navermaps.Point(19, 58),
}

        
    

  const currentCircle = () => {
    return(
      <>
        <Circle
            center = {myLocation}
            radius = {500}
        />
        <Marker
          position={myLocation}
          icon={icon}
          
        >
            
        </Marker>
      </>
      )
  }
  
  


  return (
    <NaverMap
      mapDivId={"react-naver-map"}
      style={{
        width: '100%',
        height: '100%'
      }}
      defaultCenter={myLocation}
      defaultZoom={13}
      onClick={(e)=>{
        console.log(e.latlng)
        setMyLocation({lat : e.latlng.y , lng: e.latlng.x})
      }}
    >
      {currentCircle()}
    </NaverMap>
    
  );
}

function Maps(){
  
    return (
      <RenderAfterNavermapsLoaded
        ncpClientId={'upwpd1lph1'}
        error={<p>Maps Load Error</p>}
        loading={<p>Maps Loading...</p>}
      >
        <NaverMapComponent />
      </RenderAfterNavermapsLoaded>
  
    );
  }
export default Maps;

  