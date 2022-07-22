import './App.css';

const { naver } = window;
function App() {

  let mapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 17
};

  let map = new naver.maps.Map('map', mapOptions);
  const markser = new naver.maps.Marker({
    map,
    position: new naver.maps.LatLng(37.3595704, 127.105399),
  });
  return (
    <div className="App">
     <div id='map' style={{width:'400px',height:'400px'}}></div>
    </div>
  );
}

export default App;
