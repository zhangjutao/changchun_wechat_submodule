import Config from './Config';

const app = getApp();
function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  function formatNumber(n) {
    const nString = n.toString();
    return nString[1] ? nString : `0${nString}`;
  }

  return `${year}-${month}-${day} ${[hour, minute, second].map(formatNumber).join(':')}`;
}
function formatJsonP(stringData, callback) {
  const shortStringData = stringData.substring(
    callback.length + 1,
    stringData.length - 1,
  );
  const pageData = JSON.parse(shortStringData);
  return pageData;
}
function colorRGBA2Hex(rgba) {
  const hex = rgba.map((e) => {
    if (e < 16) {
      return `0${e.toString(16)}`;
    }
    return e.toString(16);
  });
  return `#${hex[0]}${hex[1]}${hex[2]}${hex[3]}`;
}
function mapDataExchange([lon, lat]) {
  const pi = 3.14159265358979324;
  const R_EARTH = 6378245.0;
  const ee = 0.00669342162296594323;
  const transformLat = (x, y) => {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
  };

  const transformLon = (x, y) => {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
  };
  /* 判断是否在国内，不在国内则不做偏移 */
  if ((lon < 72.004 || lon > 137.8347) && (lat < 0.8293 || lat > 55.8271)) {
    return [lon, lat];
  }
  let dLat = transformLat(lon - 105.0, lat - 35.0);
  let dLon = transformLon(lon - 105.0, lat - 35.0);
  const radLat = lat / 180.0 * pi;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((R_EARTH * (1 - ee)) / (magic * sqrtMagic) * pi);
  dLon = (dLon * 180.0) / (R_EARTH / sqrtMagic * Math.cos(radLat) * pi);
  const marsPointLat = lat + dLat;
  const marsPointLon = lon + dLon;
  return [marsPointLon, marsPointLat];
}

function measureText(inputText, fontSize = 10) {
  // 计算文本宽度
  const text = inputText.split('');
  let width = 0;
  // text = String(text);
  text.forEach((item) => {
    if (/[a-zA-Z]/.test(item)) {
      width += 7;
    } else if (/[0-9]/.test(item)) {
      width += 5.5;
    } else if (/\./.test(item)) {
      width += 2.7;
    } else if (/-/.test(item)) {
      width += 3.25;
    } else if (/[\u4e00-\u9fa5]/.test(item)) {
      width += 10;
    } else if (/\(|\)/.test(item)) {
      width += 3.73;
    } else if (/\s/.test(item)) {
      width += 2.5;
    } else if (/%/.test(item)) {
      width += 8;
    } else {
      width += 10;
    }
  });
  return width * fontSize / 10;
}

const normalize = (point) => {
  const len = Math.sqrt(point[0] * point[0] + point[1] * point[1]);
  return [point[0] / len, point[1] / len];
};

const normalVector = (p1, p2) => {
  const vector = normalize([p2[0] - p1[0], p2[1] - p1[1]]);
  return [vector[1], -vector[0]];
};

const getStringLength = (str) => {
  // console.log('str = ', str);
  const strArray = str.toString().split('');
  const lengths = strArray.map((e) => {
    // console.log(e, e.codePointAt(0));
    if (e.codePointAt(0) > 128) {
      // 非英文字符
      return 2;
    } else if (e.codePointAt(0) >= 64 && e.codePointAt(0) <= 90) {
      // 大写字母和@
      return 2;
    }
    return 1;
  });
  // console.log('length = ', lengths.reduce((a, b) => (a + b)));
  return lengths.reduce((a, b) => (a + b));
};

// 判断字符串是否以 http 开头，并包含合理的图片后缀名
function isHttpImage(imgUrl) {
  const suffixIndex = imgUrl.lastIndexOf('.');
  const suffix = imgUrl.substring(suffixIndex + 1).toUpperCase();
  const validImageSuffix = ['PNG', 'JPG', 'JPEG', 'BMP', 'GIF', 'SVG', 'EPS', 'TIFF'];
  return validImageSuffix.indexOf(suffix) !== -1 && imgUrl.substring(0, 4).toUpperCase() === 'HTTP';
}

function getObjectKeys(object) {
  // const keys = [];
  // const objKeys = Object.keys(object);
  // for (const property of objKeys) {
  //   keys.push(property);
  // }
  return Object.keys(object);
}
function getObjectValues(object) {
  const values = [];
  const objectKeys = Object.keys(object);
  objectKeys.forEach((element) => {
    values.push(object[element]);
  });
  return values;
}
function getObjectEntries(object) {
  const values = [];
  const objectKeys = Object.keys(object);
  objectKeys.forEach((element) => {
    values.push([element, object[element]]);
  });
  return values;
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function getDataSource(value) {
  switch (value) {
    case 'j':
      return '路况分析评价系统';
    case 'r':
      return '过江交通分析系统';
    case 'fl':
      return '车流分析系统';
    case 'st':
      return '静态交通分析系统';
    case 't':
      return '轨道客流分析系统';
    case 'b':
      return '常规公交分析系统';
    case 'sl':
      return '慢行交通分析系统';
    case 'l':
      return '职住分析评价系统';
    case 'i':
      return '交通调查分析系统';
    case 'd':
      return '车辆排放分析系统';
    case 'c':
      return '社会车辆分析系统';
    case 'fo':
      return '对外运输分析系统';
    case 'y':
      return '年报数据';
    case 'yb':
      return '统计年鉴';
    default:
      return '年报数据';
  }
}

function refreshAccessToken(requestFunciton) {
  wx.request({
    url: Config.common.url + Config.logIn.url.freshToken,
    data: { refreshToken: app.globalData.refreshToken },
    header: {
      access_token: app.globalData.accessToken,
    },
    success(res) {
      if (res.success) {
        const { data } = res;
        app.globalData.accessToken = data;
        // 拿到新的token以后，再次执行请求，把请求放在此处是因为刷新token是个异步过程
        requestFunciton();
      }
    },
    fail(res) {
      console.log('accessToken刷新失败：', res.message);
    },
  });
}
module.exports = {
  formatTime,
  formatJsonP,
  colorRGBA2Hex,
  mapDataExchange,
  measureText,
  normalize,
  normalVector,
  getStringLength,
  isHttpImage,
  getObjectKeys,
  getObjectValues,
  getObjectEntries,
  sleep,
  getDataSource,
  refreshAccessToken,
};
