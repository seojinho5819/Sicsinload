export const getItem = (itemStr) => {
  const result = new Storage(itemStr);
  return result.getItem();
};

export const setItem = (itemStr, itemDatas) => {
  const result = new Storage(itemStr);
  return result.setItem(itemDatas);
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
}
