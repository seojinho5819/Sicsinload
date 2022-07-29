import { useEffect, useState } from 'react';
import './App.css';
import logo from './asset/mylocationicon18.jpg'
import sicsinLoadLogo from './asset/sicsinload.png'
import Input from './component/js/inputForm/Input';
import axios from 'axios';
import Select from './component/js/inputForm/Select';
import RightShiftModal from './component/js/inputForm/RightShiftModal';


function App() {
  const [ mylocation , setMyLocation ] = useState({lat : 37.2803486,lng : 127.118456})
  const [ aroundStore , setAroundStore ] = useState([])
  const [ markers , setMakers ] = useState([])
  const { naver } = window;
  


  // getAxios()
  // const getAxios = async() =>{
  //   var config = {
  //     method: 'get',
  //     url: '/v1/search/local.json?query=내근처음식점&display=5&start=100',
  //     headers: { 
  //       'Content-Type': 'application/json', 
  //       'X-Naver-Client-Id': 'DJGnZ7vQFrDYjIvc57PY', 
  //       'X-Naver-Client-Secret': 'FQXmywEPSO'
  //     }
  //   };
    
  //   axios(config)
  //   .then(function (response) {
  //     console.log(response.data.items);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
    

  // }
  //"proxy": "https://openapi.naver.com",
 



  useEffect(()=>{
    const location = naver && new naver.maps.LatLng(37.2803486, 127.118456);
  // 지도에 표시할 위치의 위도와 경도 설정

  const mapOptions = {
  center: location,
  // 중앙에 배치할 위치
  zoom: 16,
  // 확대 단계
  };

  
  let myLocationBtnHtml = '<button type="button" style="margin-left:5px;"><span>내위치</span></button>',
  customControl = new naver.maps.CustomControl(myLocationBtnHtml, {
    position: naver.maps.Position.TOP_LEFT
  });

  let atMyBounceBtnHtml = '<button type="button" style="cursor:pointer ;margin-bottom:5px; background-color: #008CBA;border:0; border-radius:20px"><span>현재 지도에서 검색</span></button>',
  customControl2 = new naver.maps.CustomControl(atMyBounceBtnHtml, {
    position: naver.maps.Position.BOTTOM_CENTER
  });

  let map = naver && new naver.maps.Map('map', mapOptions);
 


 
  // const findNearstore = (lat,lng) => {
  //   let stores = []
  //   if(store.length>0){
  //     stores = store
  //     stores.setMap(null)
  //     setStore([])
  //   }
  //   let places = new kakao.maps.services.Places();
  //   let callback = function(result, status) {
  //     if (status === kakao.maps.services.Status.OK) {
  //         result.map(res => {
  //           let marker = new naver.maps.Marker({
  //             position: new naver.maps.LatLng(res.y, res.x),
  //             map: map
  //           })
  //           stores.push(marker)
  //           setStore(stores)
  //         }
  //         )
  //     }
  //   };

  //   places.keywordSearch('내주변 음식점', callback,{ location: new kakao.maps.LatLng(lat, lng),radius:500});
    
  // }

  //findNearstore(mylocation.lat, mylocation.lng)
  


  // DOM 요소에 지도 삽입 (지도를 삽입할 HTML 요소의 id, 지도의 옵션 객체)
  let marker = new naver.maps.Marker({
    map,
    position: mylocation,
    icon: {
      url : logo,
      scaledSize: new naver.maps.Size(100, 136),
      anchor: naver.maps.Point(60, 80)
    }
  });
  naver.maps.Event.once(map, 'init', function() {
    customControl.setMap(map);
    customControl2.setMap(map);
    //내위치
    naver.maps.Event.addDOMListener(customControl.getElement(), 'click', function() {
      console.log('marker : ',marker.position.y,marker.position.x)
      map.setCenter(new naver.maps.LatLng(marker.position.y, marker.position.x));
    });
    //현재위치에서 주변 음식점 검색
    naver.maps.Event.addDOMListener(customControl2.getElement(), 'click', function() {
      getAxios(map.getBounds()._max,map.getBounds()._min,map)
    });
  });
 
  // 지도에 마커(내위치) 생성
//   let circle = new naver.maps.Circle({
//     map: map,
//     center: mylocation,
//     radius: 500,
//     fillOpacity: 0.8
// });
  // 마커(나) 이동
  naver.maps.Event.addListener(map, 'click',  async function(e) {
 
    console.log(e.latlng.y,e.latlng.x)
    setMyLocation({lat : e.latlng.y,'lng' : e.latlng.x})
    marker.setPosition(e.coord);
   
    
    // 선택한 마커로 부드럽게 이동합니다.
    map.setZoom(15);
    map.panTo(e.coord, {duration:300 ,easing:'linear'});
    
    console.log('bounds : ',map.getBounds());
    });
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const getAxios = (max,min,map) =>{
    
    
    let marker
    var config = {
      method: 'get',
      url: 'https://map.naver.com/v5/api/search?caller=pcweb&query=%EB%82%B4%EC%A3%BC%EB%B3%80%EC%9D%8C%EC%8B%9D%EC%A0%90&type=place&searchCoord='+mylocation.lng+';'+mylocation.lat+'&page=1&displayCount=20&boundary='+min.x+';'+min.y+';'+max.x+';'+max.y+'&lang=ko',
      headers: { 
        'Content-Type': 'application/json', 
        
      }
    };
    
    axios(config)
    .then(function (response) {
      
      if(markers.length>0){
        markers.map((item) =>{
          item.setMap(null)  
        })
      }
      
      
      response.data.result.place.list.map((item) => {
        marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(item.y, item.x),
          map: map
        })
        marker.setMap(map)
        setMakers(markers.push(marker))
        return ;
      })
      setAroundStore(response.data.result.place.list)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  return (
    <div className="App">
      <div className='Wrapper'>
        <img src={sicsinLoadLogo} style={{width:'100px'}}/>
        <div id="map" >
          
        </div>
        <div>
          <table border={'1'} width='100%'>
            <thead>
              <tr>
                  <th colspan="7">내주변 맛집정보 (20)</th>
              </tr>
              <tr>
                  <td>번호</td>
                  <td>점수</td>
                  <td>이름</td>
                  <td>주소</td>
                  <td>카테고리</td>
                  <td>위도</td>
                  <td>경도</td>
              </tr>
            </thead>
            <tbody>
              {/* <tr>
                <td>1</td>
                <td>★★★★☆</td>
                <td>우리집</td>
                <td>경기도 용인시 기흥구 덕영대로 2077번길 20</td>
                <td>가정식 백반</td>
                <td>with two columns</td>
                <td>with two columns</td>
              </tr> */}
              {aroundStore.length>0 && aroundStore.map((item,index) =>(
                <tr key={index}>
                  <td>{item.rank}</td>
                  <td>점수</td>
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>{item.category[0]+' >> '+item.category[1]}</td>
                  <td>{item.y}</td>
                  <td>{item.x}</td>
                </tr>
              ))
              }
            </tbody>
          </table>
        </div>
        <RightShiftModal width={320}>
          <h2>{'음식점 등록하기'}</h2>
         <div style={{paddingRight:50}}>
          <div style={{marginTop:100}}>
            <Input
              type={'text'}
              colLabel={false}
              label={'상호명'}
            />
          </div>
          <div style={{marginTop:50}}>
            <Input
              type={'number'}
              colLabel={false}
              label={'x좌표'}
            />
          </div>
          <div style={{marginTop:50}}>
            <Input
              type={'number'}
              colLabel={false}
              label={'y좌표'}
            />
          </div>
          <div style={{marginTop:50}}>
            <Input
              type={'text'}
              colLabel={false}
              label={'상세주소'}
            />
          </div>
          <div style={{marginTop:50}}>
            <Select
              colLabel={false}
              label={'카테고리'}
              optionList={[1,2,3]}
            />
          </div>
          <div style={{marginTop:50}}>
            <button>등록</button>
          </div>
        </div>
      </RightShiftModal>

   
       
      </div>
    </div>
  );
}

export default App;
