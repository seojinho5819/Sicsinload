// 객체 빈값 체크
export const isEmptyObj = (obj)  => {
  if(obj.constructor === Object
      && Object.keys(obj).length === 0)  {
    return true;
  }
  
  return false;
}




