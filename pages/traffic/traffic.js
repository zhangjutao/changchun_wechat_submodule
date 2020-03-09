import Config from '../../utils/Config';
import GraphConfig from '../../utils/GraphConfig';

const cJlist = ['长江大桥', '长江公路桥', '白沙洲大桥', '长江隧道', '天兴洲大桥', '二七长江大桥', '鹦鹉洲长江大桥', '公铁隧道', '阳逻长江大桥'];
const hJList = ['江汉二桥', '江汉一桥', '晴川桥', '长丰桥'];

const app = getApp();
Page({
  data: {
    categories: Config.policy.categories,
    indicatorDots: false,
    partyTitle: Config.traffic.partyA,
    list: GraphConfig.data,
    buttonSrc: Config.analysis.button.imageUrl,
    buttonColors: Config.analysis.button.buttonColors,
    logoSrc: Config.traffic.logo,
    searchImageSrc: Config.analysis.search.searchImage,
    trafficIndexBackgroundSrc: Config.policyUrl + Config.traffic.trafficIndex.trafficIndexBackUrl,
    trafficIndexIcons: Config.traffic.trafficIndex.indexIcons,
     // 需要显示的：交通指数，默认为0
    viewDataTrafficIndex: {},
    // 交通指数卡片
    regionIndexList: Array(3).fill({
      region: '暂无数据',
      index: 0.0,
    }),
    frequentJamBackUrl: Config.policyUrl + Config.traffic.frequentJam.frequentJamBackUrl,
     // 拥堵排行
    topJamArea: Array(3).fill({
      name: '暂无数据',
      speed: 0.0,
    }),
    crossRiverBackUrl: Config.policyUrl + Config.traffic.crossRiver.backgroudUrl,
    bridgeIcon: Config.traffic.crossRiver.bridgeIconUrl,
    trailIcon: Config.common.url.staticFile + Config.trailPassengerFlow.imgUrl.trailIcon,
    crossRiverData: Array(3).fill({
      name: '暂无数据',
      data: 0,
    }),
    trailPassengerFlowData: Array(5).fill({
      name: '1号地铁线',
      length: 43,
      flow: 12.5,
    }),
    aboutUsBackgroundSrc: Config.policyUrl + Config.traffic.aboutUs.backgroudUrl,
    policyBackgroundSrc: Config.policy.backgroudUrl,
    indexBackgroundSrc: Config.policy.indexBackgroudUrl,
    trailPassengerFlowBackgroundSrc: Config.common.url.staticFile + Config.trailPassengerFlow.imgUrl.backgroundUrl,
    cJTotalBackgroundUrl: 'https://znjtxxpt.whtpi.com/static/images/traffic/crossRiver/cj-background.png',
    hJTotalBackgroundUrl: 'https://znjtxxpt.whtpi.com/static/images/traffic/crossRiver/hj-background.png',
    downArrow: '../../images/traffic/dataIndex/down-arrow.jpg',
  },
  onLoad() {
    const that = this;
    // 从接口获取当前用户收藏的指标
    wx.REQUEST({
      // url: Config.url + Config.analysis.url + Config.analysis.detailCharts.url,
      url: Config.url + Config.analysis.getCollectUrl,
      method: 'GET',
      data: {
        access_token: app.globalData.accessToken,
      },
      success(resInfo) {
        if (resInfo.data.success) {
          if (resInfo.data.data && resInfo.data.data.length > 0) {
            app.globalData.collectionList = resInfo.data.data.map(item => item.indicatorName);
          }
        } else {
          // 去除相关提示
          // wx.showModal({
          //   title: '服务器获取收藏指标失败，请重试',
          // });
        }
      },
      fail() {
        wx.showModal({
          title: '无法连接服务器，请重试',
        });
      },
    });
    // that.requestTrafficIndexBoxData();
    // that.requestFrequentJamBoxData();
    // that.requestCrossRiverBoxData();
  },
  tapSearch() {
    wx.navigateTo({
      url: `${Config.analysis.searchUrl}?type=analysis`,
    });
  },
  tapIndicator(event) {
    const id = parseInt(event.currentTarget.id, 10);
    wx.navigateTo({
      url: `indicatorList/indicatorList?id=${id}`,
    });
  },
  // 请求交通概况部分数据
  requestTrafficIndexBoxData() {
    if (this.requestTrafficIndexTimes > 10) {
      return;
    }
    this.requestTrafficIndexTimes += 1;
    const that = this;
    wx.REQUEST({
      url: Config.traffic.url + Config.traffic.trafficIndex.url,
      data: {},
      method: 'POST',
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data;
          const allRoadIndexColor = that.chooseColor(data.allRoadIndex);
          const indexOverviewList = ['中心城区', '武昌', '汉阳', '汉口'];
          const firstPageList = data.detailList
          .filter(item => indexOverviewList.includes(item.region));
          firstPageList.sort((a, b) => b.region.length - a.region.length);
          const firstPageDetailList = firstPageList.map(item => ({
            ...item,
            index: (item.index + 0.0).toFixed(1),
            color: that.chooseColor(item.index),
          }));
          that.setData({
            averageSpeed: Math.round(data.averageSpeed),
            viewDataTrafficIndex: {
              index: (data.allRoadIndex + 0.0).toFixed(1),
              color: allRoadIndexColor,
              speed: (data.averageSpeed + 0.0).toFixed(1),
            },
            regionIndexList: firstPageDetailList,
          });
        } else {
          console.log('Failed to quest data.', Config.traffic.url + Config.traffic.trafficIndex.url);
          // that.requestTrafficIndexBoxData();
        }
      },
      fail() {
        console.log('Failed to quest data.', Config.traffic.url + Config.traffic.trafficIndex.url);
        // that.requestTrafficIndexBoxData();
      },
    });
  },
  // 点击进入路网指数详细页面
  enterPage(event) {
    const id = parseInt(event.currentTarget.id, 10);
    if (id === 1 || id === 2) {
      wx.navigateTo({
        url: `mapImage/mapImage?id=${id}`,
      });
    } else {
      wx.navigateTo({
        url: `${Config.traffic.pageUrl[id]}?id=${id}`,
      });
    }
  },
  // 为交通指数选取对应的颜色，接收交通指数，返回颜色的十六进制码
  chooseColor(index) {
    let color;
    if (index <= 2) {
      color = '#008200aa';
    } else if (index <= 4) {
      color = '#a1cf00aa';
    } else if (index <= 6) {
      color = '#ffff00aa';
    } else if (index <= 8) {
      color = '#ffa800aa';
    } else {
      color = '#ff0000aa';
    }
    return color;
  },
  // 请求拥堵排行部分数据
  requestFrequentJamBoxData() {
    if (this.requestFrequentJamTimes > 10) {
      return;
    }
    this.requestFrequentJamTimes += 1;
    const that = this;
    wx.REQUEST({
      url: Config.traffic.url + Config.traffic.frequentJam.url,
      data: {
        type: 'string',
      },
      method: 'POST',
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data;
          data.forEach((item) => {
            item.speed = (item.speed + 0.0).toFixed(1); // eslint-disable-line
          });
          that.setData({
            topJamArea: data,
          });
        } else {
          console.log('拥堵排行数据请求失败', Config.traffic.url + Config.traffic.frequentJam.url);
          // that.requestFrequentJamBoxData();
        }
      },
      fail() {
        console.log('拥堵排行数据请求失败', Config.traffic.url + Config.traffic.frequentJam.url);
        // that.requestFrequentJamBoxData();
      },
    });
  },
  // 请求过江流量部分数据
  requestCrossRiverBoxData() {
    if (this.requestCrossRiverTimes > 10) {
      return;
    }
    this.requestCrossRiverTimes += 1;
    const that = this;
    wx.REQUEST({
      // '/traffic/crossRiver'
      url: Config.traffic.url + Config.traffic.crossRiver.url,
      data: {
        type: 'string',
      },
      method: 'POST',
      success(res) {
        if (res.statusCode === 200) {
          let cJTotalData = 0;
          let hJTotalData = 0;
          const data = res.data.length > 0 ? res.data : that.data.crossRiverData;
          const decimalHandledData = data.map(item => ({
            ...item,
            data: (item.data / 10000).toFixed(2),
          }));
          const cJData = cJlist.map((name) => {
            const result = decimalHandledData.find(item => item.name === name);
            return result;
          });
          const hJData = hJList.map((name) => {
            const result = decimalHandledData.find(item => item.name === name);
            return result;
          });
          cJData.forEach((item) => {
            cJTotalData += Number(item.data);
          });
          hJData.forEach((item) => {
            hJTotalData += Number(item.data);
          });
          that.setData({
            // crossRiverData: finalData.slice().sort((a, b) => (b.data - a.data)),
            crossRiverData: {
              cj: cJData.slice().sort((a, b) => (b.data - a.data)),
              hj: hJData.slice().sort((a, b) => (b.data - a.data)),
              cJTotal: cJTotalData.toFixed(2),
              hJTotal: hJTotalData.toFixed(2),
            },
          });
        } else {
          console.log('过江流量请求失败', Config.traffic.url + Config.traffic.crossRiver.url);
          // that.requestCrossRiverBoxData();
        }
      },
      fail() {
        console.log('过江流量请求失败', Config.traffic.url + Config.traffic.crossRiver.url);
        // that.requestCrossRiverBoxData();
      },
    });
  },
  enterPolicyPage(event) {
    const type = event.currentTarget.dataset.type;
    if (type === '交通动态') {
      wx.navigateTo({
        url: 'dynamic/dynamicTable/dynamicTable',
      });
    } else if (type === '关于我们') {
      wx.navigateTo({
        url: `${Config.traffic.aboutUs.pageUrl}`,
      });
    } else if (type === '决策参考') {
      wx.navigateTo({
        url: '../news/newsTable/newsTable?name=决策参考',
      });
    } else if (type === '国内外对比') {
      wx.navigateTo({
        url: '../news/newsTable/newsTable?name=地铁',
      });
    } else {
      wx.navigateTo({
        url: `${Config.policy.pageUrl}?type=${type}`,
      });
    }
  },
  // enterAboutUsPage() {
  //   wx.navigateTo({
  //     url: `${Config.traffic.aboutUs.pageUrl}`,
  //   });
  // },
});
