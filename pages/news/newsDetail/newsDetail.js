// newsDetail.js
import Config from '../../../utils/Config';
import util from '../../../utils/util';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    barTitle: '',
    inputValue: '',
    category: '',
    news: {},
    userInfo: {
      id: app.globalData.userId,
      userId: app.globalData.userId,
      name: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      userRelation: [],
      isCollect: false,
    },
    // 前端展示的新闻内容和根据用户分组展示的评论列表
    newsContent: [],
    commentsList: [],
    // 评论可见区域
    delta: {
      down: 1,
      up: 1,
    },
    // 图片位置
    imageSrc: Config.url,
    collectImgSrc: Config.news.newsDetail.icon.star.normal,
    commentsSrc: Config.news.newsDetail.icon.comments,
    likeSrc: Config.news.newsDetail.icon.like,
    messageUpSrc: Config.news.newsDetail.icon.triangle,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.news.id = options.id;
    this.data.category = options.category;
    this.data.listID = options.listID;
    this.setData({
      barTitle: options.name,
      news: this.data.news,
    });
    const that = this;
    wx.setNavigationBarTitle({
      title: that.data.barTitle,
    });
    this.requestNewsDetailData();
  },
  requestNewsDetailData() {
    const that = this;
    wx.REQUEST({
      url: `https://znjtxxpt.whtpi.com/${Config.news.url}${Config.news.newsDetail.url}`,
      // url: Config.url + Config.news.url + Config.news.newsDetail.url,
      method: 'POST',
      data: {
        newsId: that.data.news.id,
        id: 3104172,
        userId: 3104172,
        // id: app.globalData.userId,
        // userId: app.globalData.userId,
      },
      // header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      success(res) {
        if (res.statusCode === 200) {
          that.data.news = {
            ...res.data.news,
            ...that.data.news,
          };
          // 评论根据时间排序
          that.data.news.commentsList.sort((a, b) => a.date > b.date);
          that.data.userInfo = res.data.userInfo;
          if (that.data.userInfo.isCollect) {
            that.setData({
              collectImgSrc: Config.news.newsDetail.icon.star.active,
            });
          }
          // 评论列表筛选
          that.data.news.commentsList.forEach((element) => {
            if (element.userRelation) {
              that.data.commentsList.push(element);
            }
          }, this);
          // 返回新闻内容修改格式
          // 先把图片分离出来
          const textAndImage = that.data.news.content.content
            .split('|and1234567890-=|')
            .filter(e => e !== '');

          textAndImage.forEach((e) => {
            if (util.isHttpImage(e)) {
              that.data.newsContent.push({
                type: 'image',
                content: e,
              });
            } else {
              let newContent = e.replace(/ +g/, '\n'); //eslint-disable-line
              newContent = newContent.replace(/　+g/, '\n'); //eslint-disable-line
              const subString = newContent.split('\n');
              subString.forEach((s) => {
                that.data.newsContent.push({
                  type: 'text',
                  content: s,
                });
              });
            }
          });
          that.setData({
            newsContent: that.data.newsContent,
            news: that.data.news,
            userInfo: that.data.userInfo,
            commentsList: that.data.commentsList,
          });
        } else if (res.statusCode === 304) {
          that.data.news = {
            ...res.data.news,
            ...that.data.news,
          };
          // 评论根据时间排序
          that.data.news.commentsList.sort((a, b) => a.date > b.date);
          that.data.userInfo = res.data.userInfo;
          if (that.data.userInfo.isCollect) {
            that.setData({
              collectImgSrc: Config.news.newsDetail.icon.star.active,
            });
          }
          // 评论列表筛选
          that.data.news.commentsList.forEach((element) => {
            if (element.userRelation) {
              that.data.commentsList.push(element);
            }
          }, this);
          // 返回新闻内容修改格式
          // 先把图片分离出来
          const textAndImage = that.data.news.content.content
            .split('|and1234567890-=|')
            .filter(e => e !== '');

          textAndImage.forEach((e) => {
            if (util.isHttpImage(e)) {
              that.data.newsContent.push({
                type: 'image',
                content: e,
              });
            } else {
              let newContent = e.replace(/ +g/, '\n'); //eslint-disable-line
              newContent = newContent.replace(/　+g/, '\n'); //eslint-disable-line
              const subString = newContent.split('\n');
              subString.forEach((s) => {
                that.data.newsContent.push({
                  type: 'text',
                  content: s,
                });
              });
            }
          });
          that.setData({
            newsContent: that.data.newsContent,
            news: that.data.news,
            userInfo: that.data.userInfo,
            commentsList: that.data.commentsList,
          });
        } else {
          console.log('response err (not 200), re-request');
          that.requestNewsDetailData();
        }
      },
      fail() {
        console.log('request failed, re-request');
        that.requestNewsDetailData();
      },
    });
  },
  bindKeyConfirm(event) {
    const date = new Date();
    const that = this;
    // todo
    wx.REQUEST({
      url: Config.url + Config.news.url + Config.news.newsDetail.sendUrl,
      method: 'POST',
      data: {
        // callback: Config.news.callback,
        newsId: that.data.news.id,
        // userId: that.data.userInfo.id,
        id: app.globalData.userId,
        userId: app.globalData.userId,
        comment: event.detail.value,
        date: date.getTime(),
      },
      success(res) {
        if (!res.data.success) {
          wx.showModal({
            showCancel: false,
            title: '发送评论失败，请稍后重试',
          });
          return;
        }
        that.data.news.commentsList.push({
          // id: that.data.userInfo.id,
          id: app.globalData.userId,
          userId: app.globalData.userId,
          name: that.data.userInfo.name,
          userRelation: that.data.userInfo.userRelation,
          comment: event.detail.value,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          date: util.formatTime(date),
        });
        that.data.commentsList.push({
          // id: that.data.userInfo.id,
          id: app.globalData.userId,
          userId: app.globalData.userId,
          name: that.data.userInfo.name,
          userRelation: that.data.userInfo.userRelation,
          comment: event.detail.value,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          date: util.formatTime(date),
        });
        that.setData({
          news: that.data.news,
          commentsList: that.data.commentsList,
          inputValue: '',
        });
      },
    });
  },
  tapStar() {
    const that = this;
    wx.REQUEST({
      url: Config.url + Config.news.url + Config.news.newsDetail.sendUserUrl,
      method: 'POST',
      data: {
        newsId: that.data.news.id,
        id: app.globalData.userId,
        userId: app.globalData.userId,
        isCollect: !that.data.userInfo.isCollect,
      },
      success(res) {
        if (res.data.success) {
          if (that.data.userInfo.isCollect) {
            that.data.userInfo.isCollect = false;
            that.data.collectImgSrc = Config.news.newsDetail.icon.star.normal;
            wx.showToast({
              title: '取消收藏',
            });
            app.globalData.newsChangedItem = {
              listID: that.data.listID,
              isCollect: false,
              valid: true,
            };
          } else {
            that.data.userInfo.isCollect = true;
            that.data.collectImgSrc = Config.news.newsDetail.icon.star.active;
            wx.showToast({
              title: '收藏成功',
            });
            app.globalData.newsChangedItem = {
              listID: that.data.listID,
              isCollect: true,
              valid: true,
            };
          }
          that.setData({
            collectImgSrc: that.data.collectImgSrc,
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
});
