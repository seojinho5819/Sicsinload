export const getItem = (itemStr) => {
  const result = new Storage(itemStr);
  return result.getItem();
};

export const setItem = (itemStr, itemDatas) => {
  const result = new Storage(itemStr);
  return result.setItem(itemDatas);
  // new SEt();
};

class Storage {

  constructor(category) {
    this.category = category;
  }

  getItem() {
    return JSON.parse(localStorage.getItem(this.category) || "[]");
  }

  setItem(datas) {
    return localStorage.setItem(this.category, JSON.stringify(datas));
  }

  addItem() {

  }

  findStoreReview(storeList) { // 수정도 덜 될뿐더러,, 그리고 메소드 명을 이쁘게지으면 의미파악이 굉장히쉬움..
    
  }
}
