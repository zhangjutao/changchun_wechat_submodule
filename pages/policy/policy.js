// policy.js
import Config from '../../utils/Config';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: Config.policy.categories,
    // 图片位置
    searchImageSrc: Config.analysis.search.searchImage,
    comingImageSrc: Config.policy.comingSrc,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  enterPage(event) {
    const type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: `${Config.policy.pageUrl}?type=${type}`,
    });
  },
  tapSearch() {
    wx.navigateTo({
      url: `${Config.policy.searchUrl}?type=resource-file`,
    });
  },
});

