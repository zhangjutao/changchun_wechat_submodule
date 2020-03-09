// news.js
import Config from '../../utils/Config';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleList: Config.news.titleList,
    // 图片位置
    searchImageSrc: Config.analysis.search.searchImage,
    commentsSrc: Config.news.icon.comments,
    collectSrc: Config.news.icon.collect,
    arrowRightSrc: Config.news.icon.arrowRight,
    mode: 'development',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const that = this;
    that.judgeMode();
  },

  tapSearch() {
    wx.navigateTo({
      url: `${Config.news.searchUrl}?type=news`,
    });
  },
  enterPage(event) {
    const that = this;
    const id = parseInt(event.currentTarget.id, 10);
    wx.navigateTo({
      url: `${Config.news.pageUrl}?name=${that.data.titleList[id].text}`,
    });
  },
  enterComments(event) {
    wx.navigateTo({
      url: `${Config.news.commentsUrl}?type=${event.currentTarget.id}`,
    });
  },
  judgeMode() {
    const that = this;
    wx.REQUEST({
      url: Config.policyUrl + Config.news.modeUrl,
      data: {},
      method: 'POST',
      success(res) {
        if (res.statusCode === 200) {
          const { mode } = res.data;
          console.log('------------------res------------------');
          console.log(mode);
          that.setData({
            mode,
          });
        } else {
          console.log('Failed to quest data.', Config.traffic.url + Config.traffic.trafficIndex.url);
        }
      },
      fail() {
        console.log('Failed to quest data.', Config.traffic.url + Config.traffic.trafficIndex.url);
      },
    });
  },
});
