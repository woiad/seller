/**
 * 解析url参数
 * @example ?id=123456&a=b
 * @return Object {id:123456,a:b}
 */
export function UrlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?123456','&a=b']
  if (arr) {
    arr.forEach((item) => {
      let templateArr = item.substring(1).split('=');
      let key = decodeURIComponent(templateArr[0]);
      let val = decodeURIComponent(templateArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}
