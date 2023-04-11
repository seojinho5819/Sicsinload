import React,{ useEffect, useState, useCallback } from "react";
import "./App.css";
import logo from "./asset/mylocationicon18.jpg";
import sicsinLoadLogo from "./asset/sicsinload.png";
import Infor from "./component/js/common/Infor";
import axios from "axios";
import moment from "moment";
import FileSaver from 'file-saver';
import RightShiftModal from "./component/js/common/RightShiftModal";
import { Rating } from "react-simple-star-rating";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Review from "./component/js/common/Review";
import Menu from "./component/js/menu/Menu";
import { getItem, setItem } from "./utils/localstorage";
import { isEmptyObj } from "./utils/util";

const App = () => {
  const { naver } = window;
  const [mylocation, setMyLocation] = useState({
    lat: 37.2803486,
    lng: 127.118456,
  });
  const [aroundStore, setAroundStore] = useState([]);
  const [focusingStore, setFocusingStore] = useState({});
  const [focusingMarker, setFocusingMarker] = useState({});
  const [isSidebar, setIsSidebar] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);
  const tabList = ["음식점 정보", "메뉴 보기", "리뷰 보기", "리뷰 작성"];

  //별점 입력 함수
  const handleRating = useCallback(
    (rate) => {
      setFocusingStore({ ...focusingStore, rating: rate });
      // other logic
    },
    [focusingStore]
  );

  const registHandler = useCallback((focusingStoreArg) => {
      if (!focusingStoreArg.id) {
        window.alert('"지도에서 검색"후 리뷰할 음심점을 먼저 선택해 주세요.');
      } else {
        const reaction = {
          id: focusingStoreArg.id,
          rating: focusingStoreArg.rating ? focusingStoreArg.rating : 0,
          review: focusingStoreArg.review,
          date: moment().format("YYYY-MM-DD"),
        };
        const reviews = getItem("reviews");
        reviews.push(reaction);
        setItem("reviews", reviews);

        const storeReviews = reviews.filter(
          (item) => item.id === focusingStoreArg.id
        );
        const ratingAverage =
          storeReviews?.length > 0
            ? storeReviews.reduce((sum, curr) => sum + curr.rating, 0) /
              storeReviews.length
            : 0;

        setFocusingStore({
          ...focusingStoreArg,
          ratingAverage: ratingAverage,
          reviews: storeReviews,
          review: "",
          rating: 0,
        });
        getAroundStoreList(map.getBounds(), getItem("stores"), reviews);
        window.alert("리뷰 작성이 완료 되었습니다!");
      }
	// eslint-disable-next-line react-hooks/exhaustive-deps    
    },[focusingStore]);

  const standbyMap = useCallback(() => {
    const location = naver && new naver.maps.LatLng(37.2803486, 127.118456);
    // 지도에 표시할 위치의 위도와 경도 설정
    const mapOptions = {
      center: location,
      zoom: 16,
    };
    // 검색창
    const searchInput = '<input type="text" placeholder="Debounce 자동완성 구현 예정" style="margin-left:5px;"/>',
      customControl3 = new naver.maps.CustomControl(searchInput, {
        position: naver.maps.Position.TOP_LEFT,
      });
    // 내 위치 버튼
    const myLocationBtnHtml =
        '<button type="button" style="margin-left:5px;"><span>내위치</span></button>',
      customControl = new naver.maps.CustomControl(myLocationBtnHtml, {
        position: naver.maps.Position.TOP_LEFT,
      });
    // 현재 지도에서 검색버튼
    const atMyBounceBtnHtml =
        '<button type="button" style="cursor:pointer ;margin-bottom:5px; background-color: #008CBA;border:0; border-radius:20px"><span>현재 지도에서 검색</span></button>',
      customControl2 = new naver.maps.CustomControl(atMyBounceBtnHtml, {
        position: naver.maps.Position.BOTTOM_CENTER,
      });

    // 맵 객체 생성
    let map = naver && new naver.maps.Map("map", mapOptions);

    // DOM 요소에 지도 삽입 (지도를 삽입할 HTML 요소의 id, 지도의 옵션 객체)
    let marker = new naver.maps.Marker({
      map,
      position: mylocation,
      icon: {
        url: logo,
        scaledSize: new naver.maps.Size(100, 136),
        anchor: naver.maps.Point(60, 80),
      },
    });

    naver.maps.Event.once(map, "init", () => {
      setMap(map);
      customControl.setMap(map);
      customControl2.setMap(map);
      customControl3.setMap(map);
      //내위치
      naver.maps.Event.addDOMListener(
        customControl.getElement(),
        "click",
        () => {
          map.setCenter(
            new naver.maps.LatLng(marker.position.y, marker.position.x)
          );
          map.setZoom(16);
        }
      );
      //현재위치에서 주변 음식점 검색
      naver.maps.Event.addDOMListener(
        customControl2.getElement(),
        "click",
        () => {
          getAxios(mylocation, map.getBounds()._max, map.getBounds()._min, map);
        }
      );
      //검색 기반
      naver.maps.Event.addDOMListener(
        customControl3.getElement(),
        "click",
        () => {
          getAxios(mylocation, map.getBounds()._max, map.getBounds()._min, map);
        }
      );
    });

    // 마커(나) 이동
    naver.maps.Event.addListener(map, "click", async function (e) {
      setMyLocation({ lat: e.latlng.y, lng: e.latlng.x });
      marker.setPosition(e.coord);
      map.setZoom(15);
      // 선택한 마커로 부드럽게 이동합니다.
      map.panTo(e.coord, { duration: 300, easing: "linear" });
    });
	// eslint-disable-next-line react-hooks/exhaustive-deps    
  },[mylocation])

  const getAroundStoreList = useCallback((bounds, savedStores, allReviews) => {
    const aroundStoreList = savedStores
      .filter(
        (item) =>
          item.x <= bounds._max.x &&
          item.x >= bounds._min.x &&
          item.y <= bounds._max.y &&
          item.y >= bounds._min.y
      )
      .map((item1) => ({
        ...item1,
        reviews: allReviews.filter((item2) => item2.id === item1.id),
        ratingAverage:
          allReviews.filter((item2) => item2.id === item1.id).length > 0
            ? allReviews
                .filter((item2) => item2.id === item1.id)
                .reduce((sum, currValue) => sum + currValue.rating, 0) /
              allReviews.filter((item2) => item2.id === item1.id).length
            : 0,
      }));

    setAroundStore(aroundStoreList);
    return aroundStoreList;
  }, []);

  // 현재 map 중심 기반으로 주변 음식점 찾기
  const getAxios = async (mylocationData, max, min, map) => {
    let marker;
    const config = {
      method: "get",
      //mylocation 위치 안먹음 라이프사이클 확인 요망(중요도 낮음)
      url: `https://map.naver.com/v5/api/search?caller=pcweb&query=%EB%82%B4%EC%A3%BC%EB%B3%80%EC%9D%8C%EC%8B%9D%EC%A0%90&type=place&searchCoord=
      ${mylocationData.lng};${mylocationData.lat}&page=1&displayCount=20&boundary=${min.x};${min.y};${max.x};${max.y}&lang=ko`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios(config)
      .then((response) => {
        const responseList = [...response.data.result.place.list];
        if (markers.length > 0) {
          markers.forEach((item) => {
            item.setMap(null);
          });
        }
        // 맵 범위 구하기
        const bounds = map.getBounds();

        //맵에 표시할 객체,마커 준비
        let savedStores = getItem("stores");
        let allReviews = getItem("reviews");

        savedStores = savedStores.concat(responseList);
        //최신데이터를 위해 기존데이터 제거를 위한 리버스 후 필터링
        savedStores.reverse();
        savedStores = savedStores.filter((item, i) => {
          return savedStores.findIndex((item2) => item.id === item2.id) === i;
        });
        // 로컬스토리지에 음식점 추가(네이버 검색 api에 rank20이 자주 바뀜 따라서 음식점 검색이 일정하지 않음으로 스토리지에 저장)
        setItem("stores", savedStores);

        const aroundStoreList = getAroundStoreList(
          bounds,
          [...savedStores],
          [...allReviews]
        );

        aroundStoreList.forEach((item) => {
          //마커 생성하기
          marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(item.y, item.x),
            map: map,
          });
          marker.id = item.id;
          //마커 맵에 올리기
          marker.setMap(map);
          // 마커 다시 그리기 위한 용도(지도 중심 이동후 다시 검색시)
          setMarkers([...markers].push(marker));

          //마커 클릭시 우측 정보창 띄워주기
          naver.maps.Event.addListener(marker, "click", function (e) {
            let allSavedReviews = getItem("reviews");

            item.reviews = allSavedReviews.filter(
              (review) => review.id === item.id
            );
            item.ratingAverage =
              allSavedReviews.filter((review) => review.id === item.id).length >
              0
                ? allSavedReviews
                    .filter((review) => review.id === item.id)
                    .reduce((sum, curr) => sum + curr.rating, 0) /
                  allSavedReviews.filter((review) => review.id === item.id)
                    .length
                : 0;

            setFocusingMarker(marker);
            marker.setAnimation(1);
            marker.setPosition(new naver.maps.LatLng(item.y, item.x));
            setFocusingStore(item);
            setIsSidebar(true);
          });
          return;
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const excelDownLoadHandler = (data) => {
	const cloneData = data.slice();
	const worker = new Worker(new URL('./utils/excel.worker.js', import.meta.url));
	worker.postMessage(
		JSON.stringify({ action: 'excelDownload', excelDatas: cloneData})
	);
	worker.onmessage = (m) => {
		if(m.data.action === 'progressBar') {
			// 프로그래스 바 적용시키기
		}
		if(m.data.action === 'excelComplete') {
			if(m.data.data.result === true) {											
				FileSaver.saveAs(m.data.data.data, `내주변 맛집목록.zip`);
				alert('엑셀 다운로드가 완료 되었습니다.');
			} else {
				alert('엑셀 데이터 생성에 실패 하였습니다.');
			}
			worker.terminate();
		}
	};	

  }

  // 사이드바 내릴때 에니메이션 끄기
  useEffect(() => {
    if (!isEmptyObj(focusingMarker)) {
      if (!isSidebar) {
        focusingMarker?.setAnimation(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebar]);

  useEffect(() => {
    standbyMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="Wrapper">
        <img src={sicsinLoadLogo} style={{ width: "100px" }} />
        <div id="map" />

        <div>
          <table border={"1"} width="100%">
            <thead>
              <tr>
                <th colSpan="7" style={{position: 'relative' }}>
					내 주변 식당정보 ({aroundStore.length + "개"})
					<button 
						style={{position: 'absolute', right: 0}}
						onClick={()=> excelDownLoadHandler(aroundStore)}>
					{'엑셀 다운로드'}</button>
                </th>
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
              {aroundStore.length > 0 &&
                aroundStore.map((item, index) => (
                  <tr key={`s-${item.id}`}>
                    <td>{index + 1}</td>
                    <td>
                      {item.reviews.length > 0
                        ? (item.ratingAverage / 20).toFixed(1)
                        : "리뷰없음"}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.address}</td>
                    <td>{item.category[0] + " >> " + item.category[1]}</td>
                    <td>{item.y}</td>
                    <td>{item.x}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <RightShiftModal
          width={440}
          isSidebar={isSidebar}
          setIsSidebar={setIsSidebar}
          focusingStore={focusingStore}
        >
          <h2>{"음식점 정보"}</h2>
          <Tabs id={"infoTabs"} style={{ marginRight: 25 }}>
            <TabList>
              {tabList.map((item, index) => (
                <Tab key={`t-${index}`}>{item}</Tab>
              ))}
            </TabList>
            <TabPanel>
              <div className="photoZone">
                <div>
                  {isEmptyObj(focusingStore) ? (
                    <div style={{ marginTop: 50 }}>
                      선택된 음심점이 없습니다
                    </div>
                  ) : (
                    <img
                      src={focusingStore?.thumUrl}
                      style={{ width: "100%", height: 200 }}
                      alt="음식점 이미지가 없습니다"
                    />
                  )}
                </div>
              </div>
              <div style={{ paddingRight: 50 }}>
                <div style={{ marginTop: 50 }}>
                  <Infor
                    label={"상호명"}
                    value={focusingStore ? focusingStore.name : ""}
                  />
                </div>
                <div
                  style={{
                    marginTop: 30,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div style={{ display: "flex", width: 100, margin: 10 }}>
                    별점
                  </div>
                  <Rating
                    readonly
                    ratingValue={
                      focusingStore.ratingAverage
                        ? focusingStore.ratingAverage
                        : 0
                    }
                  />
                </div>

                <div style={{ marginTop: 30 }}>
                  <Infor
                    label={"x좌표"}
                    value={focusingStore ? focusingStore.x : ""}
                  />
                </div>
                <div style={{ marginTop: 50 }}>
                  <Infor
                    label={"y좌표"}
                    value={focusingStore ? focusingStore.y : ""}
                  />
                </div>
                <div style={{ marginTop: 50 }}>
                  <Infor
                    label={"상세주소"}
                    value={focusingStore ? focusingStore.address : ""}
                  />
                </div>
                <div style={{ marginTop: 50 }}>
                  <Infor
                    label={"카테고리"}
                    value={
                      focusingStore.category
                        ? focusingStore.category[0] +
                          " >> " +
                          focusingStore.category[1]
                        : ""
                    }
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <Menu
                menuInfo={
                  focusingStore?.menuInfo ? focusingStore?.menuInfo : ""
                }
              />
            </TabPanel>
            <TabPanel>
              <div style={{ marginTop: 50 }}></div>
              <Review reviews={focusingStore.reviews} />
            </TabPanel>
            <TabPanel>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    marginTop: 50,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginRight: 20 }}>별점</div>
                  <Rating
                    onClick={handleRating}
                    ratingValue={
                      focusingStore.rating ? focusingStore.rating : 0
                    } /* Available Props */
                  />
                </div>
                <div
                  style={{
                    marginTop: 50,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginRight: 20 }}>리뷰</div>
                  <textarea
                    style={{ width: 200, height: 100 }}
                    value={focusingStore?.review ? focusingStore.review : ""}
                    onChange={(e) => {
                      setFocusingStore({
                        ...focusingStore,
                        review: e.target.value,
                      });
                    }}
                  />
                </div>
                <div style={{ marginTop: 50 }}>
                  <button
                    type="button"
                    onClick={() => registHandler(focusingStore)}
                  >
                    등록
                  </button>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </RightShiftModal>
      </div>
    </div>
  );
}

export default App;
