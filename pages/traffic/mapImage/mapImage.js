import Config from '../../../utils/Config';

const app = getApp();

const { pixelRatio, windowHeight, windowWidth } = app.globalData.system;

const OX1 = 227871;
// const OX1 = 213555;
const OX2 = 256503;
// const OX2 = 270819;
const OY1 = 3355990;
// const OY1 = 3330527;
const OY2 = 3406917;
// const OY2 = 3432380;
const DX = OX2 - OX1;
const DY = OY2 - OY1;

const SERVER = 'http://59.175.231.195:3300/geoserver';
const URL_GREEN = 'fcd/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&STYLES&LAYERS=fcd:lyr_wgs_green&SRS=EPSG:32650';
const URL_WATER = 'fcd/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&STYLES&LAYERS=fcd:lyr_wgs_water&SRS=EPSG:32650';
const URL_CONTENT = 'fcd/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&STYLES&LAYERS=rtm:lyr_wgs_link01m_lv1&SRS=EPSG:32650';

const SERVER_FLOW = 'http://59.175.231.195:3300/geoserver';
const URL_FLOW = 'whflux/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&STYLES&LAYERS=whflux:flux_taxi_day&SRS=EPSG:32650';

const WIDTH = Math.round(windowWidth * pixelRatio);
const HEIGHT = Math.round(windowHeight * pixelRatio);

const X1 = OX1 - DX * (WIDTH - 750) / 750 / 2;
const X2 = OX2 + DX * (WIDTH - 750) / 750 / 2;
const Y1 = OY1 - DY * (HEIGHT - 1334) / 1334 / 2;
const Y2 = OY2 + DY * (HEIGHT - 1334) / 1334 / 2;

const titles = {
  1: '实时路况地图',
  2: '全天路网流量',
};
const legends = {
  1: [
    {
      color: '#007800',
      text: '>40Km/h',
    },
    {
      color: '#98CB02',
      text: '30-40Km/h',
    },
    {
      color: '#fecb00',
      text: '20-30Km/h',
    },
    {
      color: '#FF9900',
      text: '15-20Km/h',
    },
    {
      color: '#df0100',
      text: '0-15Km/h',
    },
  ],
  2: [
    {
      color: '#56E708',
      text: '2-273',
    },
    {
      color: '#0070FF',
      text: '274-713',
    },
    {
      color: '#E79900',
      text: '714-1259',
    },
    {
      color: '#FF00C5',
      text: '1260-2075',
    },
    {
      color: '#FF5400',
      text: '2076-3812',
    },
    {
      color: '#E70000',
      text: '3813-8499',
    },
  ],
};

Page({
  data: {
    // 地图高度，根据用户设备自动调整大小
    mapImageGreenSrc: `${SERVER}/${URL_GREEN}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&BBOX=${X1},${Y1},${X2},${Y2}`,

    mapImageWaterSrc: `${SERVER}/${URL_WATER}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&BBOX=${X1},${Y1},${X2},${Y2}`,

    mapImageSrc: null,
    mapImageDetailSrc: null,

    // x,y 不是像素级别
    x: -windowWidth / 2,
    y: -windowHeight / 2,

    scaleValue: 1,

    width: WIDTH,
    height: HEIGHT,

    top: HEIGHT / 2,
    left: WIDTH / 2,

    legend: null,
  },
  onLoad(options) {
    this.id = Number(options.id);
    this.scale = 1;
    const that = this;
    wx.setNavigationBarTitle({
      title: titles[this.id],
    });
    this.setData({
      legend: legends[this.id],
    });

    // 路况地图
    if (this.id === 1) {
      // summary
      wx.REQUEST({
        url: `${Config.url}/traffic/trafficIndex`,
        data: {},
        method: 'POST',
        success(res) {
          if (res.statusCode === 200) {
            that.setData({
              summary: `全网平均指数: ${Number(res.data.allRoadIndex).toFixed(1)}，平均速度: ${Number(res.data.averageSpeed).toFixed(1)}km/h`,
            });
          }
        },
      });
      // map
      this.setData({
        mapImageSrc: `${SERVER}/${URL_CONTENT}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&BBOX=${X1},${Y1},${X2},${Y2}`,
      });
    } else if (this.id === 2) {
      // 流量
      this.setData({
        mapImageSrc: `${SERVER_FLOW}/${URL_FLOW}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&BBOX=${X1},${Y1},${X2},${Y2}`,
        summary: '典型天路网流量',
      });
    }
  },

  onReady() {
  },

  onUnload() {
  },

  onTapClose() {
    wx.navigateBack({});
  },

  onChange(e) {
    [this.currentX, this.currentY] = [e.detail.x, e.detail.y];
  },

  onScale(e) {
    const { scale } = e.detail;
    this.scale = scale;
  },

  onTapZoomIn() {
    const newScale = Math.min(4, this.scale + 0.5);
    this.setData({
      scaleValue: newScale,
    });
    this.scale = newScale;
    this.checkForRefresh();
  },

  onTapZoomOut() {
    const newScale = Math.max(0.5, this.scale - 0.5);
    this.setData({
      scaleValue: newScale,
    });
    this.scale = newScale;
    this.checkForRefresh();
  },

  onImageDetailLoad() {
    this.big = true;
    this.setData({
      mapImageSrc: null,
    });
  },

  onImageLoad() {
    this.big = false;
    this.setData({
      mapImageDetailSrc: null,
    });
  },

  onTouchEnd() {
    this.checkForRefresh();

    // const that = this;
    // // 坐标移动量
    // // 注意X坐标是反的因为是左下角定位的
    // const pX = (this.data.x - this.currentX) / windowWidth;
    // const pY = (this.currentY - this.data.y) / windowHeight;

    // // 计算新的BBOX
    // const newX1 = DX * pX + X1;
    // const newX2 = DX * pX + X2;
    // const newY1 = DY * pY + Y1;
    // const newY2 = DY * pY + Y2;

    // // 计算新的top和left
    // const newTop = -this.currentY * pixelRatio;
    // const newLeft = -this.currentX * pixelRatio;

    // eslint-disable-next-line
    // const newImageGreenSrc = `${SERVER}/${URL_GREEN}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&BBOX=${newX1},${newY1},${newX2},${newY2}`;
    // eslint-disable-next-line
    // const newImageWaterSrc = `${SERVER}/${URL_WATER}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&BBOX=${newX1},${newY1},${newX2},${newY2}`;
    // eslint-disable-next-line
    // const newImageSrc = `${SERVER}/${URL_CONTENT}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&BBOX=${newX1},${newY1},${newX2},${newY2}`;

    // // wx.showLoading({
    // //   title: '数据拼命载入中',
    // //   mask: true,
    // // });

    // const requestImage = url => new Promise((resolve) => {
    //   this.imgLoader.load(url, (err, data) => {
    //     if (!err) {
    //       resolve(data);
    //     }
    //   });
    // });
    // Promise.all([
    //   requestImage(newImageGreenSrc),
    //   requestImage(newImageWaterSrc),
    //   requestImage(newImageSrc),
    // ]).then(([dataGreen, dataWater, dataContent]) => {
    //   that.setData({
    //     mapImageGreenSrc: dataGreen.src,
    //     mapImageWaterSrc: dataWater.src,
    //     mapImageSrc: dataContent.src,
    //     left: newLeft,
    //     top: newTop,
    //   });
    //   wx.hideLoading();
    // });
  },

  checkForRefresh() {
    if (this.id === 1) {
      if (this.scale >= 2 && !this.big) {
        this.setData({
          mapImageDetailSrc: `${SERVER}/${URL_CONTENT.replace('lyr_wgs_link01m_lv1', 'lyr_wgs_link01m_lv5')}&WIDTH=${Math.round(WIDTH * 1.3)}&HEIGHT=${Math.round(HEIGHT * 1.3)}&BBOX=${X1},${Y1},${X2},${Y2}`,
        });
      }

      if (this.scale <= 1 && this.big) {
        this.setData({
          mapImageSrc: `${SERVER}/${URL_CONTENT}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&BBOX=${X1},${Y1},${X2},${Y2}`,
        });
      }
    }
  },
});
