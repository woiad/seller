export function formatDate(data, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': data.getMonth() + 1,
    'd+': data.getDate(),
    'h+': data.getHours(),
    'm+': data.getMinutes(),
    's+': data.getSeconds
  };
  for (let i in o) {
     if (new RegExp(`(${i})`).test(fmt)) {
       let str = o[i] + '';
       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1 ? str : paddingLeftZero(str)));
    }
  }
  function paddingLeftZero(str) {
    return ('00' + str).substr(str.length);
  };
  return fmt;
};
