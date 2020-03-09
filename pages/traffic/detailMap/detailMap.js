/* eslint-disable max-len */

import Config from '../../../utils/Config';
import Utils from '../../../utils/util';
import areaMapping from '../../../utils/areaMapping';

const app = getApp();

// name: [
//   '交通指数',
//   '路况地图',
//   '道路出行',
//   '常发拥堵',
//   '轨道客流',
//   '停车来源',
//   '人群聚集',
//   '过江流量',
// ],

const urlAppendix = {
  3: 'fcd/k4/map',
  4: 'metro/flow',
  5: 'park/od/17',
  6: 'token/workhome/top',
  7: 'traffic/crossRiver/map',
};

Page({
  data: {
    // 地图高度，根据用户设备自动调整大小
    mapHeight: app.globalData.system.windowHeight * app.globalData.system.pixelRatio,
    polyline: [],
    circles: [],
    markers: [{
      iconPath: '../../../images/traffic/detailMap/myLocation.png',
      width: 80 / app.globalData.system.pixelRatio,
      height: 80 / app.globalData.system.pixelRatio,
      anchor: { x: 0.5, y: 0.5 },
    }],
    controls: [
      {
        id: 0,
        iconPath: '../../../images/traffic/detailMap/position.png',
        position: {
          left: app.globalData.system.windowWidth - 100 / app.globalData.system.pixelRatio,
          top: 1050 / app.globalData.system.pixelRatio,
          width: 80 / app.globalData.system.pixelRatio,
          height: 80 / app.globalData.system.pixelRatio,
        },
        clickable: true,
      },
      {
        id: 1,
        iconPath: '../../../images/traffic/detailMap/plus.png',
        position: {
          left: app.globalData.system.windowWidth - 100 / app.globalData.system.pixelRatio,
          top: 800 / app.globalData.system.pixelRatio,
          width: 78 / app.globalData.system.pixelRatio,
          height: 79 / app.globalData.system.pixelRatio,
        },
        clickable: true,
      },
      {
        id: 2,
        iconPath: '../../../images/traffic/detailMap/shrink.png',
        position: {
          left: app.globalData.system.windowWidth - 100 / app.globalData.system.pixelRatio,
          top: 880 / app.globalData.system.pixelRatio,
          width: 78 / app.globalData.system.pixelRatio,
          height: 89 / app.globalData.system.pixelRatio,
        },
        clickable: true,
      },
      {
        id: 4,
        iconPath: '../../../images/traffic/detailMap/close-button.png',
        position: {
          left: 0,
          top: 0,
          width: 100 / app.globalData.system.pixelRatio,
          height: 100 / app.globalData.system.pixelRatio,
        },
        clickable: true,
      },
    ],
    scale: 12,
    longitude: 114.3085,
    latitude: 30.5846,
    // 隐藏、显示排行列表
    showTable: false,
    // 排行列表数据
    rankData: [],
    // 表格大小和位置（上边缘距离）
    tableHeight: 0,
    tablePosition: 0,
    // 表格的单位
    unit: '辆/天',
  },
  staticData: {
    scale: 12,
    mapData: {},
    radius: 1000,
    R_EARTH: 6378000,
    currentMap: '停车热度',
    circles: null,
  },
  onLoad(options) {
    // 获得当前页面所对应的 地图 id
    const id = parseInt(options.id, 10);
    this.currentId = id;
    wx.showLoading({
      title: '数据拼命载入中',
      mask: true,
    });
    //  重设标题栏
    wx.setNavigationBarTitle({
      title: `${Config.traffic.button.name[id]}`,
    });
    this.currentMap = Config.traffic.button.name[id];
    // 获取地图上所加载的信息
    this.requestMapData(options);
    this.requestTimes = 0;
    const that = this;
    this.updateInterval = setInterval(() => {
      that.checkDataUpdate(options);
    }, 1000, options);
  },

  checkDataUpdate(options) {
    const id = parseInt(options.id, 10);
    const type = Config.traffic.button.name[id];
    if (app.globalData.mapData[id] != null) {
      if ((new Date()).getTime() - app.globalData.mapData[id].timestamp >= 60000) {
        return;
      }
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      // 开始渲染
      const that = this;
      const responseData = app.globalData.mapData[id].data;
      if (!responseData) {
        return;
      }
      console.log(responseData);
      responseData.data.sort((a, b) => (a.data < b.data));
      const unit = responseData.data.length > 0 ? responseData.data[0].unit : '';
      that.setData({
        rankData: responseData.data,
        tableHeight: (responseData.data.length * 60 + 120),
        tablePosition: app.globalData.system.windowHeight * app.globalData.system.pixelRatio - responseData.data.length * 60 - 160,
        unit,
      });

      wx.hideLoading();

      const displayMapData = responseData.map;

      if (responseData) {
        // 根据不同的地图采用不同的处理方法
        if (['常发拥堵', '过江流量'].includes(type)) {
          that.polylineMap(displayMapData.features, type);
        } else if (type === '人群聚集') {
          that.crowd(displayMapData);
        } else if (type === '轨道客流') {
          that.subwayFlow(displayMapData);
        } else if (type === '停车来源') {
          that.parkingOD(displayMapData);
        }
      }
      // 有图表就显示图表按钮
      if (responseData.data.length !== 0) {
        that.setData({
          controls: that.data.controls.concat({
            id: 3,
            iconPath: '../../../images/traffic/detailMap/table.png',
            position: {
              left: app.globalData.system.windowWidth - 104 / app.globalData.system.pixelRatio,
              top: 60 / app.globalData.system.pixelRatio,
              width: 86 / app.globalData.system.pixelRatio,
              height: 87 / app.globalData.system.pixelRatio,
            },
            clickable: true,
          }),
        });
      }
      if (type === '人群聚集') {
        that.setData({
          controls: that.data.controls.concat({
            id: 5,
            iconPath: '../../../images/traffic/detailMap/legend.png',
            position: {
              left: app.globalData.system.windowWidth - 360 / app.globalData.system.pixelRatio,
              top: 30 / app.globalData.system.pixelRatio,
              width: 338 / app.globalData.system.pixelRatio,
              height: 72 / app.globalData.system.pixelRatio,
            },
            clickable: true,
          }),
        });
      }
    }
  },

  requestMapData(options) {
    const id = parseInt(options.id, 10);
    // 如果有请求正在执行则退出
    if (app.globalData.mapDataPending[id] > 0) {
      return;
    }
    // 如果有很新的历史数据则退出
    if (app.globalData.mapData[id] &&
    (new Date()).getTime() - app.globalData.mapData[id].timestamp < 60000) {
      return;
    }
    if (this.requestTimes > 10) {
      return;
    }
    this.requestTimes += 1;
    // const type = Config.traffic.button.name[id];
    const that = this;
    // const newUrl = ['停车来源', '轨道客流', '人群聚集'].includes(type);
    // const urlAppendix = newUrl ? 'subway_crowd_parking/' : '';
    app.globalData.mapDataPending[id] += 1;

    wx.REQUEST({
      url: `${Config.traffic.detailMap.url}/${urlAppendix[id]}`,
      data: {
        // type,
      },
      method: 'POST',
      success(res) {
        app.globalData.mapDataPending[id] -= 1;
        if (res.statusCode === 200) {
          // 从服务器得到地图数据
          const responseData = res.data;
          // const responseData = JSON.parse(res.data);
          // 把数据存在globalData里
          app.globalData.mapData[id] = {
            timestamp: (new Date()).getTime(),
            data: responseData,
          };
        } else {
          // error in server, re-request after 2 seconds
          Utils.sleep(2000).then(() => {
            that.requestMapData(options);
          });
        }
      },
      fail() {
        // request failed, re-request after 2 seconds
        app.globalData.mapDataPending[id] -= 1;
        Utils.sleep(2000).then(() => {
          that.requestMapData(options);
        });
      },
    });
  },

  onReady() {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map');
  },

  onUnload() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },

  drawOverlay(mapData, params) {
    if (params.type === '停车热度') {
      this.heatMap(params.radius, mapData, params.update);
    } else {
      this.polylineMap(mapData, params.type);
    }
  },

  // 停车来源
  parkingOD(mapData) {
    // const ODValues = mapData.map(od => od.value);
    const sortedParkingOD = mapData.filter(e => e.fromcode !== e.tocode).slice().sort((a, b) => (a.value - b.value));


    console.log(sortedParkingOD);


    // const maxParkingOD = Math.max(...ODValues);
    const ODNumber = sortedParkingOD.length;
    const getColor = (top) => {
      switch (true) {
        case (top < 4):
          return '#ff0000';
        case (top >= 4 && top < 10):
          return '#bb00ff';
        default:
          return '#0000ff';
      }
    };
    const polylines = sortedParkingOD.map((od, index) => {
      const toPoint = areaMapping.find(e => e.code === Number(od.tocode)).coordinate;
      const fromPoint = areaMapping.find(e => e.code === Number(od.fromcode)).coordinate;
      const normalVector = Utils.normalVector(toPoint, fromPoint);
      const scale = 0.00001 * od.value;
      const points = [toPoint, fromPoint].map(point => ({
        longitude: point[0] + normalVector[0] * scale,
        latitude: point[1] + normalVector[1] * scale,
      }));
      return {
        points,
        color: getColor(ODNumber - index),
        width: od.value / 50,
      };
    });
    this.setData({
      polyline: polylines,
    });
    // 特殊处理表格
    const tableData = sortedParkingOD.reverse().slice(0, 10).map((e) => {
      const fromName = areaMapping.find(m => m.code === Number(e.fromcode)).name;
      const toName = areaMapping.find(m => m.code === Number(e.tocode)).name;
      return {
        data: e.value,
        name: `${fromName}->${toName}`,
      };
    });
    this.setData({
      rankData: tableData,
      tableHeight: (tableData.length * 60 + 120),
      tablePosition: app.globalData.system.windowHeight * app.globalData.system.pixelRatio - tableData.length * 60 - 160,
      unit: '标准车',
    });
  },

  // 人群聚集
  crowd(mapData) {
    const top10Data = mapData.top10;
    const top50Data = mapData.top50;

    // const top80Data = JSON.parse(mapData.top80);
    const top10 = top10Data.features.map(e => [...e.geometry.coordinates, 0]);
    const top50 = top50Data.features.map(e => [...e.geometry.coordinates, 1]);

    // TODO: 这里可能需要做一下聚类
    const getColor = (type) => {
      switch (type) {
        case 0:
          return '#ff000099';
        default:
          return '#00820099';
      }
    };

    const circles = top50.concat(top10).map(e => ({
      latitude: e[1],
      longitude: e[0],
      radius: 600 - e[2] * 10,
      strokeWidth: 0,
      fillColor: getColor(e[2]),
      color: getColor(e[2]),
    }));
    this.setData({
      circles,
    });
  },

  // 轨道客流
  subwayFlow(mapData) {
    const lines = mapData.line;
    const stations = mapData.point;
    const polyline = lines.features.map((feature) => {
      const points = feature.geometry.coordinates.map(coordinate => ({
        longitude: coordinate[0],
        latitude: coordinate[1],
      }));
      const intensity = parseInt(feature.properties.data, 10);
      return {
        points,
        color: '#bb00ff',
        width: Math.min(Math.max(intensity / 70000, 3), 10),
      };
    });
    const circles = stations.features.map(e => ({
      latitude: e.geometry.coordinates[1],
      longitude: e.geometry.coordinates[0],
      radius: e.properties.data / 100,
      strokeWidth: 1,
      fillColor: '#0DE9ECaa',
      color: '#000000',
    }));
    const circlesMini = circles.map(e => ({
      ...e,
      radius: 40,
      fillColor: '#ffa800',
      strokeWidth: 1,
      color: '#ffa800',
    }));
    this.setData({
      polyline,
    });
    setTimeout(() => {
      this.setData({
        circles: [...circles, ...circlesMini],
      });
    }, 100);
  },

  // 常发拥堵/过江流量
  // 画线，整理数据为微信polyline格式
  polylineMap(mapData, type) {
    // let count = 0;
    const polylines = mapData.map((feature) => {
      // count += feature.geometry.coordinates[0].length;
      const points = feature.geometry.coordinates[0].map(coordinate => ({
        longitude: coordinate[0],
        latitude: coordinate[1],
      }));

      let color;
      let width;
      if (type === '常发拥堵') {
        color = '#ff0000';
        width = 4;
      } else if (type === '过江流量') {
        const intensity = parseInt(feature.properties.data, 10);
        color = '#ff0000';
        width = Math.min(Math.max(intensity / 10000, 3), 10);
      }
      return {
        points,
        color,
        width,
      };
    });
    // console.log('count points', count);
    // console.log('count links', polylines.length);
    this.setData({
      polyline: polylines,
    }, () => {
      wx.hideLoading();
    });
  },
  // 画热力图，详见gridLayer说明
  heatMap(radius, mapData, update) {
    // 更新的时候太卡了
    if (update) {
      this.setData({
        circles: this.staticData.circles.map(e => ({
          ...e,
          radius: radius * 1.2,
        })),
      });
      return;
    }
    // find the geometric center of sample points
    const latMinMax = mapData.map(feature => feature.geometry.coordinates[1])
      .reduce(([min, max], b) => [Math.min(min, b), Math.max(max, b)], [Infinity, -Infinity]);
    const centerLat = (latMinMax[0] + latMinMax[1]) / 2;
    // calculate grid layer cell size in lat lon based on world unit size and current latitude
    const gridOffset = {
      yOffset: (radius / this.staticData.R_EARTH) * (180 / Math.PI),
      xOffset: (radius / this.staticData.R_EARTH)
        * (180 / Math.PI) / Math.cos(centerLat * Math.PI / 180),
    };
    // calculate count per cell
    const gridHash = mapData.reduce((accu, pt) => {
      const lat = pt.geometry.coordinates[1];
      const lng = pt.geometry.coordinates[0];
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return accu;
      }
      const latIdx = Math.floor((lat + 90) / gridOffset.yOffset);
      const lonIdx = Math.floor((lng + 180) / gridOffset.xOffset);
      const key = `${latIdx}-${lonIdx}`;
      // eslint-disable-next-line
      accu[key] = accu[key] || { count: 0, points: [] };
      // eslint-disable-next-line
      accu[key].count += 1;
      return accu;
    }, {});
    const layerData = this.getGridLayerDataFromGridHash(gridHash, gridOffset);
    layerData.sort((a, b) => b.count - a.count);
    const countMax = layerData[0].count;
    const circles = layerData.map(e => ({
      latitude: e.position[1],
      longitude: e.position[0],
      fillColor: Utils.colorRGBA2Hex(
        [
          255, 0, 0, Math.floor((e.count / countMax) * 255),
        ]),
      color: Utils.colorRGBA2Hex(
        [
          255, 0, 0, Math.floor((e.count / countMax) * 255),
        ]),
      radius: radius * 0.7,
      strokeWidth: 0,
    }));
    this.staticData.circles = circles;
    this.setData({
      circles,
    });
  },
  getGridLayerDataFromGridHash(gridHash, gridOffset) {
    return Utils.getObjectEntries(gridHash).map(([key, value], i) => {
      const idxs = key.split('-');
      const latIdx = Number(idxs[0]);
      const lonIdx = Number(idxs[1]);
      return {
        ...value,
        index: i,
        position: [
          -180 + gridOffset.xOffset * lonIdx,
          -90 + gridOffset.yOffset * latIdx,
        ],
      };
    });
  },

  controltap(event) {
    const that = this;
    const id = event.controlId;
    this.mapCtx.getScale({
      success(res) {
        if (id === 1) {
          that.setData({
            scale: res.scale + 1,
          });
        } else if (id === 2) {
          that.setData({
            scale: res.scale - 1,
          });
        }
      },
    });
    if (id === 0) {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude,
            markers: [{
              ...that.data.markers[0],
              latitude: res.latitude,
              longitude: res.longitude,
            }],
          });
        },
      });
    } else if (id === 3) {
      that.setData({
        showTable: !that.data.showTable,
      });
    }
    if (id === 4) {
      if (this.currentId === 1 || this.currentId === 2) {
        wx.switchTab({
          url: '/pages/traffic/traffic',
        });
      } else {
        wx.navigateBack({});
      }
    }
  },
});
