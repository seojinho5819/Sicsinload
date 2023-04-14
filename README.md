# React-Project-sicsinload
React를 이용한 Naver Map API기반 맛집 리스트


## 🖥️ 프로젝트 소개
사용해 본적 없는 Naver Map API실습과 디자인 패턴, 아키텍트를 연습, 평소 구현해보고 싶었던 것들을 실험하기 위한 프로젝트 입니다.
데이터 최신화를 위해 맵 구현은 Open API, 데이터는 실제 MAP API기반으로 구현하였습니다.

## 주의!
해당 프로젝트는 Naver Map API ClientID가 공개되어있습니다.
월 천만건이하는 무료입니다. 
그럴일은 없겠지만 비용이 청구된다면 ClientID 폐기 후, 재발급하여 .env를 사용하여 다시 비공개로 전환합니다.

<br>

## 🕰️ 개발 기간
* 1차22.07.22일 - 22.08.09
* 2차23.04.11일 - 진행중

### ⚙️ 개발 환경
- `React`
- `NodeJs v14.18.2`
- `npm v6.14.15`
- **IDE** : vscode
- **Framework** : react(^18.2.0)
- **storage** : local storage
- **Map** : Naver Cloud API
- **Map store Datas** : Naver Map

## 📌 주요 기능
#### 주변 맛집 검색
![image](https://user-images.githubusercontent.com/70255383/231934894-3e507128-e578-47f3-8036-28e161aa37f9.png)


#### 맛집 리뷰(별점, 글)
![image](https://user-images.githubusercontent.com/70255383/231935009-019d384c-5791-454c-914d-3694f284a284.png)
![image](https://user-images.githubusercontent.com/70255383/231935093-8dd164c8-4113-425d-9321-83ed1837792a.png)


#### 맛집 리스트 내보내기(export excel, web worker)
![image](https://user-images.githubusercontent.com/70255383/231934745-2bf9728f-6a37-4d5a-9628-7ccbbcd2bc33.png)

#### [예정1] 맵 스냅샷 추가하여 옵셥 다각화 후 상세 리스트 내보내기(엑셀 내보내기 기능 고도화)

#### [예정]디자인 패턴 적용 해보기(Container/Presentation Pattern + Actomic Pattern)

#### [예정]debounce 자동완성 검색창

#### [예정]애니메이션 신경쓰기
