import { useEffect, useState } from 'react';
import './App.css';
import logo from './asset/mylocationicon18.jpg'
import miniInfoLogo from './asset/speech-balloon-6754533_640.png'
import sicsinLoadLogo from './asset/sicsinload.png'
import Input from './component/js/inputForm/Input';
import axios from 'axios';
import moment from 'moment';
import Select from './component/js/inputForm/Select';
import RightShiftModal from './component/js/inputForm/RightShiftModal';
import { Rating } from 'react-simple-star-rating'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function App() {
  const [ mylocation , setMyLocation ] = useState({lat : 37.2803486,lng : 127.118456})
  const [ aroundStore , setAroundStore ] = useState([])
  const [ focusingStore , setFocusingStore ] = useState({})
  const [ focusingMarker , setFocusingMarker ] = useState({})
  const [ isSidebar , setIsSidebar ] = useState(false)
  const [ markers , setMarkers ] = useState([])
  const { naver } = window;
  const tabList = ['음식점 정보','리뷰 작성']

  const handleRating = (rate) => {
    setFocusingStore({...focusingStore,rating:rate})
    // other logic
  }
  

  function isEmptyObj(obj)  {
    if(obj.constructor === Object
       && Object.keys(obj).length === 0)  {
      return true;
    }
    
    return false;
  }

  // useEffect(()=>{
  //   console.log('focusingStore : ',focusingStore)
  // },[focusingStore])
  
  
  useEffect(()=>{
    if(!isEmptyObj(focusingMarker)){
      if(!isSidebar){
        focusingMarker?.setAnimation(null)
  
      }
    }
  },[isSidebar])

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
  let makersArray = []
  naver.maps.Event.once(map, 'init', function() {
    customControl.setMap(map);
    customControl2.setMap(map);
    //내위치
    naver.maps.Event.addDOMListener(customControl.getElement(), 'click', function() {
      console.log('marker : ',marker.position.y,marker.position.x)
      map.setCenter(new naver.maps.LatLng(marker.position.y, marker.position.x));
      map.setZoom(16)
    });
    //현재위치에서 주변 음식점 검색
    naver.maps.Event.addDOMListener(customControl2.getElement(), 'click', function() {
      getAxios(map.getBounds()._max,map.getBounds()._min,map)
    });
  });
 

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

  // 현재 위치에서 찾기
  const getAxios =async (max,min,map) =>{
    
    
    let marker
    var config = {
      method: 'get',
      //mylocaltion 위치 안먹음 라이프사이클 확인 요망(중요도 낮음)
      url: 'https://map.naver.com/v5/api/search?caller=pcweb&query=%EB%82%B4%EC%A3%BC%EB%B3%80%EC%9D%8C%EC%8B%9D%EC%A0%90&type=place&searchCoord='+mylocation.lng+';'+mylocation.lat+'&page=1&displayCount=20&boundary='+min.x+';'+min.y+';'+max.x+';'+max.y+'&lang=ko',
      headers: { 
        'Content-Type': 'application/json', 
        
      }
    };
    
    
    await axios(config)
    .then(function (response) {
      let savedStores = []
      
      if(markers.length>0){
        markers.map((item) =>{
          item.setMap(null)  
        })
      }
      
      
      savedStores = JSON.parse(localStorage.getItem('stores'))
      savedStores = savedStores ? savedStores.concat(response.data.result.place.list) : response.data.result.place.list
      //최신데이터를 위해 기존데이터 제거를 위한 리버스 후 필터링
      savedStores.reverse();
      savedStores = savedStores.filter((item, i) => {
        return (
          savedStores.findIndex((item2, j) => {
            return item.id === item2.id;
          }) === i
          );
        });
        console.log('savedStores : ',savedStores)
        localStorage.setItem('stores',JSON.stringify(savedStores))
      
      response.data.result.place.list.map((item) => { 
        //마커 생성하기
        marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(item.y, item.x),
          map: map
        })
        
        marker.id = item.id
        //마커 맵에 올리기
        marker.setMap(map)

        
        // 마커 다시 그리기 위한 용도
        setMarkers(markers.push(marker))

        // 음식점 정보창 생성(마커 클릭시)
        var contentString = [
          '<div class="iw_inner">',
          '   <h3>'+item.name+'</h3>',
          '   <p>'+item.address+'<br />',
          '       <img src="'+ item.thumUrl +'" width="55" height="55" alt="'+item.name+'" class="thumb" /><br />',
          '       '+item.tel+' | '+item.category[0]+' &gt; '+item.category[1]+'<br />',
          '       <a href="'+item.homePage+'" target="_blank">'+item.homePage+'</a>',
          '   </p>',
          '</div>'
        ].join('');
        var infowindow = new naver.maps.InfoWindow({
            content: contentString,
           
        });
        
        //마커 클릭시 우측 정보창 띄워주기
        naver.maps.Event.addListener(marker, "click", function(e) {
          let reviews = JSON.parse(localStorage.getItem('reviews'))?.filter(x => x.id == item.id)?JSON.parse(localStorage.getItem('reviews'))?.filter(x => x.id == item.id):[]
          let ratings = reviews.map(x => x.rating)
          if(reviews.length>0){
            item.ratingAverage = ratings.reduce((sum,currValue) => {return sum+currValue},0)/ratings.length
            item.reviews = reviews.map(x => x.review)
          }
          console.log(item)
          setFocusingMarker(marker)
          marker.setAnimation( naver.maps.Animation.BOUNCE)
          console.log(item)
          setFocusingStore(item)
          setIsSidebar(true)
        });
        return;
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
        <RightShiftModal width={320} isSidebar={isSidebar} setIsSidebar={setIsSidebar} focusingStore={focusingStore}>
          <h2>{'음식점 정보'}</h2>
          <Tabs
            
          >
    <TabList>
      {tabList.map((item,index) => <Tab key ={index}>{item}</Tab>)}
    </TabList>
    <TabPanel>
         <div style={{paddingRight:50}}>
          <div style={{marginTop:50}}>
            <Input
              type={'text'}
              colLabel={false}
              label={'상호명'}
              value={focusingStore?focusingStore.name:''}
              readOnly
            />
          </div>
          <div  style={{marginTop:30,display:'flex',flexDirection:'row',alignItems:'center'}}>
              <div style={{margin:20}}>별점</div><Rating readonly ratingValue={focusingStore.ratingAverage?focusingStore.ratingAverage:0} /* Available Props */ />
            </div>
         
          <div style={{marginTop:30}}>
            <Input
              type={'text'}
              colLabel={false}
              label={'x좌표'}
              value={focusingStore?focusingStore.x:''}
              readOnly
            />
          </div>
          <div style={{marginTop:50}}>
            <Input
              type={'text'}
              colLabel={false}
              label={'y좌표'}
              value={focusingStore?focusingStore.y:''}
              readOnly
            />
          </div>
          <div style={{marginTop:50}}>
            <Input
              type={'text'}
              colLabel={false}
              label={'상세주소'}
              value={focusingStore?focusingStore.address:''}
              readOnly
            />
          </div>
          <div style={{marginTop:50}}>
          <Input
              type={'text'}
              colLabel={false}
              label={'카테고리'}
              value={focusingStore.category?(focusingStore.category[0]+' >> '+focusingStore.category[1]):''}
              readOnly
            />
          </div>
           
          </div>
          </TabPanel>
          <TabPanel>
            <div  style={{marginTop:50,display:'flex',flexDirection:'row',alignItems:'center'}}>
              <div style={{margin:20}}>별점</div><Rating onClick={handleRating} ratingValue={focusingStore.rating?focusingStore.rating:0} /* Available Props */ />
            </div>
            <div style={{marginTop:50,display:'flex',flexDirection:'row',alignItems:'center'}}>
            <div style={{margin:20}}>리뷰</div>
              <textarea 
                style={{width:200,height:100}}
                value={focusingStore?.review?focusingStore.review:''}
                onChange={(e)=>{
                  setFocusingStore({...focusingStore,review : e.target.value})
                }}
              />
            </div>
            <div style={{marginTop:50}}>
              <button
                type='button'
                onClick={()=>{
                  console.log('focusingStore >> ',focusingStore)
                  console.log('isEmpty? >> ',isEmptyObj(focusingStore))
                  if(isEmptyObj(focusingStore)){
                    window.alert('"지도에서 검색"후 리뷰할 음심점을 먼저 선택해 주세요.')
                  }else{
                    const reaction = {
                      id : focusingStore.id,
                      rating : focusingStore.rating?focusingStore.rating:0,
                      review : focusingStore.review,
                      date : moment().format('YYYY-MM-DD')
                    }
                    let reviews = JSON.parse(localStorage.getItem('reviews'))?JSON.parse(localStorage.getItem('reviews')):[]
                    reviews.push(reaction)
                    localStorage.setItem('reviews', JSON.stringify(reviews))
                    window.alert('리뷰 작성이 완료 되었습니다!')
                    setIsSidebar(false)
                    setFocusingStore({})
                  }
                }}
              >등록</button>
            </div>
          </TabPanel>
        </Tabs>
        </RightShiftModal>
      </div>
    </div>
  );
}

export default App;
