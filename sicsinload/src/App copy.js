import React, { useEffect, useState, useCallback } from 'react';
import { setStore, getStore } from '';
import Logo from '';
import NaverMap from '';
import MarkerTable from '';
import RightSidePanel from '';

const App = () => {
	const { naver } = useInitNaver();
	const [markerInfoList, setMarkerInfoList] = useState(getStore());
	const [myMarker, setMyMarker] = useState(null);
	const [focusedMarker, setFocusedMarker] = useState(null);

	return (
		<>
			<Logo />
			<NaverMap naver={naver} setMarkerInfoList={setMarkerInfoList} markerInfoList={markerInfoList} setMyMarker={setMyMarker} />
			<MarkerTable setMarkerInfoList={setMarkerInfoList} markerInfoList={markerInfoList} />
			<RightSidePanel focusedMarker={focusedMarker} />
		</>
	);
};

class Marker {
	#lat;
	#lng;
	#name;
	#address;
	#category;
	#naver;
	#reviews;

	/**
	 *
	 * @param {number} lat
	 * @param {number} lng
	 * @param {string} [name]
	 * @param {string} [address]
	 * @param {string} category
	 * @param {Naver} naver
	 * @param {Review[]} reviews
	 */
	constructor(lat, lng, name, address, category, naver, reviews = []) {
		this.#lat = lat;
		this.#lng = lng;
		this.#name = name;
		this.#address = address;
		this.#category = category;
		this.#naver = naver;
		this.#reviews = reviews;
	}

	static getMarkersByCategory(markerList, category) {
		return markerList.filter((marker) => marker.category === category);
	}

	static createMarkerFromLocalStorageInfo(storeInfo) {
		return new Marker();
	}

	static createMarkerFromNaverMarker(naverMaker) {
		// ...
		return new Marker();
	}
}

class Review {
	#rate;
	#review;

	constructor(rate, review) {
		this.#rate = rate;
		this.#review = review;
	}
}
