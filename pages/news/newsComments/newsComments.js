// newsComments.js
import Config from '../../../utils/Config';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    userInfo: {
      id: app.globalData.userId,
      commentsList: [],
      collectList: [],
    },
    // 选择框样式，0我的留言，1我的收藏
    barStyle: [
      Config.news.newsTable.barStyle.active,
      Config.news.newsTable.barStyle.normal,
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('calling onLoad');
    const barTitle = options.type === 'collect' ? '我的收藏' : '我的留言';
    this.data.type = options.type;
    if (this.data.type === 'collect') {
      this.data.barStyle[0] = Config.news.newsTable.barStyle.normal;
      this.data.barStyle[1] = Config.news.newsTable.barStyle.active;
    }
    this.setData({
      barTitle,
      barStyle: this.data.barStyle,
      type: this.data.type,
    });
    wx.setNavigationBarTitle({
      title: this.data.barTitle,
    });
    this.requestNewsCommentsTable();
  },

  // 根据 globalData 内缓存的收藏信息，更新页面
  onShow() {
    const item = app.globalData.newsChangedItem;
    if (this.data.type === 'comments') {
      if (item.valid) {
        this.data.userInfo.commentsList[item.listID].isCollect = item.isCollect;
        this.data.userInfo.commentsList[item.listID].borderColor = item.isCollect ? Config.news.newsTable.borderColor.collect : Config.news.newsTable.borderColor.normal;
        this.data.userInfo.commentsList[item.listID].iconSrc = item.isCollect ? Config.news.newsTable.icon.star.active : Config.news.newsTable.icon.star.normal;
      }
    } else if (this.data.type === 'collect') {
      if (item.valid && !item.isCollect) {
        this.data.userInfo.collectList.splice(item.listID, 1);
      }
    } else {
      return;
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

  requestNewsCommentsTable() {
    const that = this;
    wx.REQUEST({
      url: Config.url + Config.news.url + Config.news.newsComments.url,
      method: 'POST',
      data: {
        id: app.globalData.userId,
        userId: app.globalData.userId,
      },
      success(res) {
        if (res.statusCode === 200) {
          const formatData = res.data;
          that.data.userInfo.collectList = formatData.collectList;
          that.data.userInfo.commentsList = formatData.commentsList;
          // 根据是否关注修改样式
          const changeStyle = list => list.map((e) => {
            const borderCollect = Config.news.newsTable.borderColor.collect;
            const borderNormal = Config.news.newsTable.borderColor.normal;
            const iconActive = Config.news.newsTable.icon.star.active;
            const iconNormal = Config.news.newsTable.icon.star.normal;
            return {
              ...e,
              borderColor: e.isCollect ? borderCollect : borderNormal,
              iconSrc: e.isCollect ? iconActive : iconNormal,
            };
          });
          that.data.userInfo.collectList = changeStyle(that.data.userInfo.collectList);
          that.data.userInfo.commentsList = changeStyle(that.data.userInfo.commentsList);
          that.setData({
            userInfo: that.data.userInfo,
            barStyle: that.data.barStyle,
          });
        } else {
          that.requestNewsCommentsTable();
        }
      },
      fail() {
        that.requestNewsCommentsTable();
      },
    });
  },

  tapCollect(event) {
    const id = parseInt(event.currentTarget.id, 10);
    const that = this;
    const isCollectList = event.currentTarget.dataset.type === 'collect';
    const list = isCollectList ? 'collectList' : 'commentsList';
    wx.REQUEST({
      url: Config.url + Config.news.url + Config.news.newsDetail.sendUserUrl,
      method: 'POST',
      data: {
        id: app.globalData.userId,
        userId: app.globalData.userId,
        newsId: that.data.userInfo[list][id].id,
        isCollect: !that.data.userInfo[list][id].isCollect,
      },
      success(res) {
        if (res.data.success) {
          const borderCollect = Config.news.newsTable.borderColor.collect;
          const borderNormal = Config.news.newsTable.borderColor.normal;
          const iconActive = Config.news.newsTable.icon.star.active;
          const iconNormal = Config.news.newsTable.icon.star.normal;
          const isCollect = that.data.userInfo[list][id].isCollect;
          that.data.userInfo[list][id].isCollect = !isCollect;
          that.data.userInfo[list][id].borderColor = isCollect ? borderNormal : borderCollect;
          that.data.userInfo[list][id].iconSrc = isCollect ? iconNormal : iconActive;
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
    const barStyleNormal = Config.news.newsTable.barStyle.normal;
    const barStyleActive = Config.news.newsTable.barStyle.active;
    const isCollectList = event.currentTarget.id === 'collect';
    this.data.type = isCollectList ? 'collect' : 'comments';
    this.data.barStyle[0] = isCollectList ? barStyleNormal : barStyleActive;
    this.data.barStyle[1] = isCollectList ? barStyleActive : barStyleNormal;
    this.requestNewsCommentsTable();
    this.setData({
      barStyle: this.data.barStyle,
      type: this.data.type,
    });
  },
  enterDetail(event) {
    const id = parseInt(event.currentTarget.id, 10);
    const isCollectList = event.currentTarget.dataset.type === 'collect';
    const list = isCollectList ? 'collectList' : 'commentsList';
    const that = this;
    wx.navigateTo({
      url: `${Config.news.newsTable.pageUrl}?name=${that.data.barTitle}&id=${that.data.userInfo[list][id].id}&listID=${id}`,
    });
  },

  // 请求当前用户所有的收藏和评论列表
  // requestCollectAndComment() {
  //   // 请求用户的收藏列表和留言列表
  //   const that = this;
  //   wx.REQUEST({
  //     url: Config.url + Config.news.url + Config.news.newsComments.url,
  //     method: 'POST',
  //     data: {
  //       id: app.globalData.userId,
  //       userId: app.globalData.userId,
  //     },
  //     // header: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     success(res) {
  //       if (res.statusCode !== 200) {
  //         that.requestCollectAndComment();
  //       } else {
  //         const formatData = res.data;
  //         that.data.userInfo.collectList = formatData.collectList;
  //         that.data.userInfo.commentsList = formatData.commentsList;
  //         // 根据是否关注修改样式
  //         for (let i = 0; i < that.data.userInfo.collectList.length; i += 1) {
  //           if (that.data.userInfo.collectList[i].isCollect) {
  //             that.data.userInfo.collectList[i].borderColor = Config.news.newsTable.borderColor.collect;
  //             that.data.userInfo.collectList[i].iconSrc = Config.news.newsTable.icon.star.active;
  //           } else {
  //             that.data.userInfo.collectList[i].borderColor = Config.news.newsTable.borderColor.normal;
  //             that.data.userInfo.collectList[i].iconSrc = Config.news.newsTable.icon.star.normal;
  //           }
  //         }
  //         for (let i = 0; i < that.data.userInfo.commentsList.length; i += 1) {
  //           if (that.data.userInfo.commentsList[i].isCollect) {
  //             that.data.userInfo.commentsList[i].borderColor = Config.news.newsTable.borderColor.collect;
  //             that.data.userInfo.commentsList[i].iconSrc = Config.news.newsTable.icon.star.active;
  //           } else {
  //             that.data.userInfo.commentsList[i].borderColor = Config.news.newsTable.borderColor.normal;
  //             that.data.userInfo.commentsList[i].iconSrc = Config.news.newsTable.icon.star.normal;
  //           }
  //         }
  //         that.setData({
  //           userInfo: that.data.userInfo,
  //           barStyle: that.data.barStyle,
  //         });
  //       }
  //     },
  //     fail() {
  //       that.requestCollectAndComment();
  //     },
  //   });
  // },

  // 更新用户对某条新闻的的收藏状态
  // updateCollect(list, id) {
  //   const that = this;
  //   // 更新用户对某个新闻的收藏状态
  //   wx.REQUEST({
  //     url: Config.url + Config.news.url + Config.news.newsDetail.sendUserUrl,
  //     method: 'POST',
  //     data: {
  //       id: app.globalData.userId,
  //       userId: app.globalData.userId,
  //       newsId: that.data.userInfo[list][id].id,
  //       isCollect: that.data.userInfo[list][id].isCollect,
  //     },
  //     // header: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     success(res) {
  //       const formatData = res.data;
  //       console.log(formatData.reply);
  //       if (!formatData.reply) {
  //         that.requestCollectAndComment(list, id);
  //       }
  //     },
  //     fail() {
  //       that.updateCollect(list, id);
  //     },
  //   });
  // },
});
