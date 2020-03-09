import Config from '../../../utils/Config';

const areaList = [
  '中心城区',
  '汉口',
  '武昌',
  '汉阳',
  '一环内',
  '二环内',
  '全市域',
  '四环内',
  '四环外',
  '一环内—汉口',
  '一环内—武昌',
  '一环内—汉阳',
  '二环内—汉口',
  '二环内—武昌',
  '二环内—汉阳',
  '全市域—汉口',
  '全市域—武昌',
  '全市域—汉阳',
  '四环内—汉口',
  '四环内—武昌',
  '四环内—汉阳',
];

Page({
  /**
   * 绑定页面的数据
   */
  data: {
    pointerImageSrc: Config.traffic.trafficIndex.pointerImageSrc,
    // chronoGraphSrc: Config.url + Config.traffic.trafficIndex.chronoGraphSrc,
    chronoGraphSrc: Config.policyUrl + Config.traffic.trafficIndex.chronoGraphSrc,
    // chronoGraphSrc: Config.traffic.trafficIndex.chronoGraphSrc,
    rotateDegree: -90,
    // 需要显示的交通指数
    viewDataTrafficIndex: 0.0,
    // 需要显示的平均时速
    averageSpeed: 0.0,
    // 详细的交通指数列表
    details: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 访问交通指数、平均时速、详细列表
    this.getTrafficIndexDataFromServer(options);
  },
  // 访问交通指数、平均时速、详细列表
  getTrafficIndexDataFromServer() {
    const that = this;
    // const id = parseInt(options.id, 10);
    wx.REQUEST({
      url: `${Config.url}/traffic/trafficIndex`,
      data: {},
      method: 'POST',
      success(res) {
        if (res.statusCode === 200) {
// 从服务器得到 交通指数数据
          const resData = res.data;
          that.data.viewDataTrafficIndex = (resData.allRoadIndex + 0.0).toFixed(1);
          that.data.averageSpeed = (resData.averageSpeed + 0.0).toFixed(1);
          that.data.rotateDegree = (that.data.viewDataTrafficIndex * 18) - 90;
          console.log(res.data);
          for (let i = 0; i < resData.detailList.length; i += 1) {
            const colorIndex = Math.floor(0.5 * resData.detailList[i].index);
            resData.detailList[i].color = Config.traffic.trafficIndex.color[colorIndex];
            resData.detailList[i].average = (resData.detailList[i].average + 0.0).toFixed(1);
            resData.detailList[i].index = (resData.detailList[i].index + 0.0).toFixed(1);
          }
          that.data.details = resData.detailList;

          const sortedDetails = [];
          areaList.forEach((e) => {
            const target = that.data.details.find(f => f.region === e);
            if (target) {
              sortedDetails.push(target);
            }
          });

          // that.data.details.sort((a, b) => b.region.length - a.region.length);
          that.setData({
            viewDataTrafficIndex: that.data.viewDataTrafficIndex,
            averageSpeed: that.data.averageSpeed,
            rotateDegree: that.data.rotateDegree,
            details: sortedDetails,
            // details: that.data.details,
          });
        } else {
          that.getTrafficIndexDataFromServer();
        }
      },
      fail() {
        that.getTrafficIndexDataFromServer();
      },
    });
  },
});
