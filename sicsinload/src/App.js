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
  const { naver } = window;

  const getAxios = async() =>{
    var config = {
      method: 'get',
      url: '/v1/search/local.json?query=주변일식당&display=5',
      headers: { 
        'Content-Type': 'application/json', 
        'X-Naver-Client-Id': 'DJGnZ7vQFrDYjIvc57PY', 
        'X-Naver-Client-Secret': 'FQXmywEPSO'
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(response.data.items);
    })
    .catch(function (error) {
      console.log(error);
    });
    

  }


  useEffect(()=>{
    const location = naver && new naver.maps.LatLng(37.2803486, 127.118456);
  // 지도에 표시할 위치의 위도와 경도 설정

  const mapOptions = {
  center: location,
  // 중앙에 배치할 위치
  zoom: 16,
  // 확대 단계
  };

  
  let btnHtml = '<button type="button" style="margin-left:5px;"><span>내위치</span></button>',
  customControl = new naver.maps.CustomControl(btnHtml, {
    position: naver.maps.Position.TOP_LEFT
  });

  let map = naver && new naver.maps.Map('map', mapOptions);
  naver.maps.Event.once(map, 'init', function() {
    customControl.setMap(map);
    naver.maps.Event.addDOMListener(customControl.getElement(), 'click', function() {
      map.setCenter(new naver.maps.LatLng(mylocation.lat, mylocation.lng));
  });
});

  getAxios()
  
  
    


  // DOM 요소에 지도 삽입 (지도를 삽입할 HTML 요소의 id, 지도의 옵션 객체)
  let marker = new naver.maps.Marker({
    map,
    position: mylocation,
    icon: {
      url : logo,
      scaledSize: new naver.maps.Size(50, 68),
      anchor: naver.maps.Point(23, 40)
    }
  });
 
  // 지도에 마커(내위치) 생성
  let circle = new naver.maps.Circle({
    map: map,
    center: mylocation,
    radius: 500,
    fillOpacity: 0.8
});
  // 마커(나) 이동
  naver.maps.Event.addListener(map, 'click', function(e) {
    setMyLocation(e.latlng.y,e.latlng.x)
    marker.setPosition(e.coord);
    circle.setCenter({y:e.latlng.y,x: e.latlng.x})

    //const mapLatLng = new naver.maps.LatLng(e.coord);

    // 선택한 마커로 부드럽게 이동합니다.
    map.setZoom(15)
    map.panTo(e.coord, {duration:300 ,easing:'linear'});
  
    });
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
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
                  <th colspan="7">내주변 맛집정보 +5(개)</th>
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
              <tr>
                <td>1</td>
                <td>★★★★☆</td>
                <td>우리집</td>
                <td>경기도 용인시 기흥구 덕영대로 2077번길 20</td>
                <td>가정식 백반</td>
                <td>with two columns</td>
                <td>with two columns</td>
              </tr>
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
