import Config from '../../utils/Config';
// import util from '../../utils/util';
import GraphConfig from '../../utils/GraphConfig';

let time = 0;
const app = getApp();

Page({
  staticData: {
    moveData: {
      startY: 0,
      startTime: '',
      deltaTime: 350,
      // controlTouch: true,
      // delBtnWidth: 140,
    },
  },
  data: {
    // 收藏栏默认宽度
    // width: 890,
    searchImageSrc: Config.analysis.search.searchImage,
    buttonSrc: Config.analysis.button.imageUrl,
    list: GraphConfig.list,
    // collectionList: app.globalData.collectionList,
    collectionList: [],
    version: (new Date()).valueOf(),
  },
  onLoad() {
    // this.requestCollectedIndicator();
  },
  requestCollectedIndicator() {
    const that = this;
    wx.REQUEST({
      url: Config.url + Config.analysis.url + Config.analysis.collectUrl,
      method: 'POST',
      data: {
        userId: app.globalData.userId,
      },
      success(res) {
        if (res.statusCode === 200) {
          app.globalData.collectionList = res.data;
          app.globalData.collectionList.forEach((item, index) => {
            that.data.collectionList[index] = item.split('_')[3];
          });
          that.setData({
            collectionList: that.data.collectionList,
          });
        } else {
          that.requestCollectedIndicator();
        }
      },
      fail() {
        that.requestCollectedIndicator();
      },
    });
  },
  onShow() {
    this.data.collectionList = [];
    app.globalData.collectionList.forEach((item, index) => {
      this.data.collectionList[index] = item.split('_')[3];
    });
    this.setData({
      collectionList: this.data.collectionList,
    });
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
  // 长按删除，短按进入
  touchStart(event) {
    const that = this;
    const id = parseInt(event.currentTarget.id, 10);
    // 判断是否只有一个触摸点
    if (event.touches.length === 1) {
      // 记录触摸起始时间位置
      this.staticData.moveData.startTime = event.timeStamp;
      this.staticData.moveData.startY = event.touches[0].clientY;
      time = setTimeout(() => { that.showModal(id, that); }, 500);
    }
  },
  touchMove() {
    clearTimeout(time);
  },
  touchEnd(event) {
    const id = parseInt(event.currentTarget.id, 10);
    clearTimeout(time);
    if (event.changedTouches.length === 1 &&
      event.changedTouches[0].clientY === this.staticData.moveData.startY) {
      const endTime = event.timeStamp;
      const disTime = endTime - this.staticData.moveData.startTime;
      if (disTime < this.staticData.moveData.deltaTime) {
        wx.navigateTo({
          url: `detailCharts/detailCharts?&title=${app.globalData.collectionList[id]}`,
        });
      }
    }
  },
  showModal(id, that) {
    wx.showModal({
      title: '提示',
      content: '是否确认删除此收藏条目',
      success(res) {
        if (res.confirm) {
          wx.REQUEST({
            url: Config.url + Config.analysis.url + Config.analysis.detailCharts.url,
            method: 'POST',
            data: {
              userId: app.globalData.userId,
              title: app.globalData.collectionList[id],
              isCollect: false,
            },
            success(resInfo) {
              if (resInfo.data.success) {
                app.globalData.collectionList.splice(id, 1);
                that.setData({
                  collectionList: app.globalData.collectionList.map(e => e.split('_')[3]),
                });
              } else {
                wx.showModal({
                  title: '服务器修改失败，请重试',
                });
              }
            },
            fail() {
              wx.showModal({
                title: '无法连接服务器，请重试',
              });
            },
          });
        }
      },
    });
  },
});
