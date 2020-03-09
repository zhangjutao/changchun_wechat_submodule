// newsTable.js
/* eslint-disable max-len */
import Config from '../../../utils/Config';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    barTitle: '',
    category: '',
    // 选择框样式
    barStyle: [
      Config.news.newsTable.barStyle.active,
      Config.news.newsTable.barStyle.normal,
      Config.news.newsTable.barStyle.normal,
    ],
    // bar选择，默认0最新，1我的关注，2我的留言
    barSelect: 0,
    userInfo: {
      id: app.globalData.userId,
      userId: app.globalData.userId,
      newsList: [],
    },
    images: {
      icon: '../../../images/policy/policyTable/string.png',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('----------------options--------------------');
    console.log(options);
    this.setData({
      barTitle: options.name,
    });
    const that = this;
    // wx.setNavigationBarTitle({
    //   title: that.data.barTitle,
    // });
    this.data.category = Config.news.titleList.find(x => x.text === options.name).category;
    this.requestTimes = 0;
    this.requestingMore = false;
    this.requestNewsTableData();
  },
  // 根据 globalData 内缓存的收藏信息，更新页面
  onShow() {
    const item = app.globalData.newsChangedItem;
    if (item.valid) {
      this.data.userInfo.newsList[item.listID].isCollect = item.isCollect;
      this.data.userInfo.newsList[item.listID].borderColor = item.isCollect ? Config.news.newsTable.borderColor.collect : Config.news.newsTable.borderColor.normal;
      this.data.userInfo.newsList[item.listID].iconSrc = item.isCollect ? Config.news.newsTable.icon.star.active : Config.news.newsTable.icon.star.normal;
    }
    app.globalData.newsChangedItem = {
      listID: -1,
      valid: false,
      isCollect: false,
    };
    this.setData({
      userInfo: this.data.userInfo,
    });
  },
  requestNewsTableData() {
    if (this.requestTimes > 10) {
      return;
    }
    this.requestTimes += 1;
    const that = this;
    const myDate = new Date();
    wx.REQUEST({
      url: `https://znjtxxpt.whtpi.com/${Config.news.url}${Config.news.newsTable.url}`,
      // url: Config.url + Config.news.url + Config.news.newsTable.url,
      method: 'POST',
      data: {
        id: 3104172,
        userId: 3104172,
        // id: app.globalData.userId,
        // userId: app.globalData.userId,
        category: that.data.category,
        time: myDate.getTime(),
      },
      success(res) {
        if (res.statusCode === 200) {
          that.data.userInfo.newsList = res.data;
          // 根据是否关注修改样式，添加‘暂无留言’
          for (let i = 0; i < that.data.userInfo.newsList.length; i += 1) {
            if (that.data.userInfo.newsList[i].isCollect) {
              that.data.userInfo.newsList[i].borderColor = Config.news.newsTable.borderColor.collect;
              that.data.userInfo.newsList[i].iconSrc = Config.news.newsTable.icon.star.active;
            } else {
              that.data.userInfo.newsList[i].borderColor = Config.news.newsTable.borderColor.normal;
              that.data.userInfo.newsList[i].iconSrc = Config.news.newsTable.icon.star.normal;
            }
            if (!that.data.userInfo.newsList[i].comment) {
              that.data.userInfo.newsList[i].comment = '暂无留言';
            }
          }
          that.setData({
            userInfo: that.data.userInfo,
          });
        } else {
          console.log('response err (not 200), re-request');
          that.requestNewsTableData();
        }
      },
      fail() {
        console.log('request failed, re-request');
        that.requestNewsTableData();
      },
    });
  },
  tapCollect(event) {
    const id = parseInt(event.currentTarget.id, 10);
    const that = this;
    wx.REQUEST({
      url: Config.url + Config.news.url + Config.news.newsDetail.sendUserUrl,
      method: 'POST',
      data: {
        id: app.globalData.userId,
        userId: app.globalData.userId,
        newsId: that.data.userInfo.newsList[id].id,
        isCollect: !that.data.userInfo.newsList[id].isCollect,
      },
      success(res) {
        if (res.data.success) {
          if (that.data.userInfo.newsList[id].isCollect) {
            that.data.userInfo.newsList[id].isCollect = false;
            that.data.userInfo.newsList[id].borderColor = Config.news.newsTable.borderColor.normal;
            that.data.userInfo.newsList[id].iconSrc = Config.news.newsTable.icon.star.normal;
          } else {
            that.data.userInfo.newsList[id].isCollect = true;
            that.data.userInfo.newsList[id].borderColor = Config.news.newsTable.borderColor.collect;
            that.data.userInfo.newsList[id].iconSrc = Config.news.newsTable.icon.star.active;
          }
          that.setData({
            userInfo: that.data.userInfo,
          });
        } else {
          wx.showModal({
            showCancel: false,
            title: '服务器修改失败，请重试',
          });
        }
      },
      fail() {
        wx.showModal({
          showCancel: false,
          title: '网络连接失败，请重试',
        });
      },
    });
  },
  tapBar(event) {
    const id = parseInt(event.currentTarget.id, 10);
    this.data.barSelect = id;
    for (let i = 0; i < this.data.barStyle.length; i += 1) {
      if (i === id) {
        this.data.barStyle[i] = Config.news.newsTable.barStyle.active;
      } else {
        this.data.barStyle[i] = Config.news.newsTable.barStyle.normal;
      }
    }
    this.setData({
      barSelect: this.data.barSelect,
      barStyle: this.data.barStyle,
    });
  },
  enterDetail(event) {
    const id = parseInt(event.currentTarget.id, 10);
    const that = this;
    wx.navigateTo({
      url: `${Config.news.newsTable.pageUrl}?name=${that.data.barTitle}&id=${that.data.userInfo.newsList[id].id}&category=${that.data.category}&listID=${id}`,
    });
  },
  onPullDownRefresh() {
    this.requestTimes = 0;
    const that = this;
    const myDate = new Date();
    wx.REQUEST({
      url: Config.url + Config.news.url + Config.news.newsTable.url,
      method: 'POST',
      data: {
        id: app.globalData.userId,
        userId: app.globalData.userId,
        category: that.data.category,
        time: myDate.getTime(),
      },
      success(res) {
        if (res.statusCode === 200) {
          const formatData = res.data;
          that.data.userInfo.newsList = formatData;
          // 根据是否关注修改样式，添加‘暂无留言’
          for (let i = 0; i < that.data.userInfo.newsList.length; i += 1) {
            if (that.data.userInfo.newsList[i].isCollect) {
              that.data.userInfo.newsList[i].borderColor = Config.news.newsTable.borderColor.collect;
              that.data.userInfo.newsList[i].iconSrc = Config.news.newsTable.icon.star.active;
            } else {
              that.data.userInfo.newsList[i].borderColor = Config.news.newsTable.borderColor.normal;
              that.data.userInfo.newsList[i].iconSrc = Config.news.newsTable.icon.star.normal;
            }
            if (!that.data.userInfo.newsList[i].comment) {
              that.data.userInfo.newsList[i].comment = '暂无留言';
            }
          }
          that.setData({
            userInfo: that.data.userInfo,
          });
        }
        wx.stopPullDownRefresh();
      },
      fail() {
        wx.stopPullDownRefresh();
      },
    });
  },
  onReachBottom() {
    if (this.requestingMore) {
      return;
    }
    this.requestTimes = 0;
    const that = this;
    const lastDateString = String(that.data.userInfo.newsList[that.data.userInfo.newsList.length - 1].date);
    const newDateString = lastDateString.replace(' ', 'T').concat('.000Z');
    const newDate = new Date(newDateString);

    that.requestingMore = true;
    wx.REQUEST({
      url: Config.url + Config.news.url + Config.news.newsTable.url,
      method: 'POST',
      data: {
        id: app.globalData.userId,
        userId: app.globalData.userId,
        category: that.data.category,
        time: newDate.getTime() + newDate.getTimezoneOffset() * 60000, //eslint-disable-line
      },
      success(res) {
        that.requestingMore = false;
        if (res.statusCode === 200) {
          that.data.userInfo.newsList = that.data.userInfo.newsList.concat(res.data);
          // 根据是否关注修改样式，添加‘暂无留言’
          for (let i = 0; i < that.data.userInfo.newsList.length; i += 1) {
            if (that.data.userInfo.newsList[i].isCollect) {
              that.data.userInfo.newsList[i].borderColor = Config.news.newsTable.borderColor.collect;
              that.data.userInfo.newsList[i].iconSrc = Config.news.newsTable.icon.star.active;
            } else {
              that.data.userInfo.newsList[i].borderColor = Config.news.newsTable.borderColor.normal;
              that.data.userInfo.newsList[i].iconSrc = Config.news.newsTable.icon.star.normal;
            }
            if (!that.data.userInfo.newsList[i].comment) {
              that.data.userInfo.newsList[i].comment = '暂无留言';
            }
          }
          that.setData({
            userInfo: that.data.userInfo,
          });
        }
      },
      fail() {
        that.requestingMore = false;
      },
    });
  },
});
