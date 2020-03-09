// newsTable.js
import Config from '../../../utils/Config';
import util from '../../../utils/util';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    barTitle: '',
    newsList: [],
    imageSrc: Config.url,
    category: '',
    fileList: [],
    // 分别用于记录最新和最旧的时间戳
    timeNew: 0,
    timeOld: 999999999999999,
    // 默认的缩略图
    defaultThumbnailString: Config.policy.policyTable.defaultThumbnail.string,
    defaultThumbnailDocument: Config.policy.policyTable.defaultThumbnail.document,
    // 提示文字
    tipText: '上滑加载更多',
    tipAddMoreData: '上滑加载更多',
    tipNoMoreData: '已经到底啦',
  },

  onLoad(options) {
    this.setData({
      barTitle: options.type,
    });
    // wx.setNavigationBarTitle({
    //   title: this.data.barTitle,
    // });
    this.data.category = Config.policy.categories.find(x => x.chinese === options.type).english;
    this.requestTimes = 0;
    this.requestingMore = false;
    this.requestPolicyTable();
  },
  requestPolicyTable(time, refresh) {
    if (this.requestingMore) {
      return;
    }
    if (this.requestTimes > 10) {
      return;
    }
    this.requestTimes += 1;
    const that = this;
    this.requestingMore = true;
    // 请求文件列表
    const getFileList = type => new Promise((resolve, reject) => {
      const urlAppendix = type === 'file' ? Config.policy.fileURL : Config.policy.webURL;
      wx.REQUEST({
        url: `https://znjtxxpt.whtpi.com/${Config.policy.url}${urlAppendix}`,
        // url: Config.url + Config.policy.url + urlAppendix,
        method: 'POST',
        data: {
          category: that.data.category,
          time: time || 9999999999999,
        },
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject();
          }
        },
        fail() {
          reject();
        },
      });
    });
    Promise.all([getFileList('file'), getFileList('string')])
      .then((sources) => {
        this.requestingMore = false;
        const result = [].concat(sources[0], sources[1]);
        const times = result.map(e => e.time);
        that.data.timeOld = refresh ? Math.min(...times) : Math.min(...times, that.data.timeOld);
        that.data.timeNew = Math.max(...times, that.data.timeNew);
        const newResult = result.map((item) => {
          const defaultImgUrl = item.fileurl ?
            that.data.defaultThumbnailDocument :
            that.data.defaultThumbnailString;
          return {
            ...item,
            fileType: item.fileurl ? 'document' : 'string',
            imgurl: item.imgurl ? Config.url + item.imgurl : defaultImgUrl,
            formatTime: util.formatTime(new Date(item.time)).split(' ')[0],
          };
        }).sort((a, b) => b.time - a.time);
        // 如果是刷新则使用返回的数组，否则添加数组
        that.data.fileList = refresh ? newResult : [...that.data.fileList, ...newResult];
        // 没有新内容时设置文字
        if (result.length === 0) {
          that.data.tipText = that.data.tipNoMoreData;
        }
        that.setData({
          fileList: that.data.fileList,
          timeNew: that.data.timeNew,
          timeOld: that.data.timeOld,
          tipText: that.data.tipText,
        });
        wx.stopPullDownRefresh();
      })
      .catch(() => {
        this.requestingMore = false;
        that.requestPolicyTable();
      });
  },
  enterDetail(event) {
    const that = this;
    const i = parseInt(event.currentTarget.id, 10);
    // 根据文件类型， 选择下载文件，或者进入新页面展示文件内容
    if (that.data.fileList[i].fileType === 'document') {
      // 直接下载文件
      wx.showLoading({
        title: '文件打开中...',
        mask: true,
      });
      that.data.fileList[i].isDownload = true;
      that.setData({
        fileList: that.data.fileList,
      });
      const fileName = that.data.fileList[i].fileurl;
      // 下载并打开文件
      that.data.fileList[i].downloadTask = wx.downloadFile({
        url: Config.policyUrl + fileName,
        success(resPath) {
          that.data.fileList[i].isDownload = false;
          that.setData({
            fileList: that.data.fileList,
          });
          if (that.data.fileList[i].downloadProgress >= 100) {
            wx.hideLoading();
            that.data.fileList[i].downloadProgress = 0.0;
            that.setData({
              fileList: that.data.fileList,
            });
            // wx.showModal({
            //   title: '提示',
            //   content: '下载完成，是否打开文件',
            //   success(resOpen) {
            //     if (resOpen.confirm) {
            //       wx.openDocument({
            //         filePath: resPath.tempFilePath,
            //         fail() {
            //           console.log('Failed to open file.', resPath.tempFilePath);
            //         },
            //       });
            //     }
            //   },
            // });
            wx.openDocument({
              filePath: resPath.tempFilePath,
              fail() {
                console.log('Failed to open file.', resPath.tempFilePath);
              },
            });
          }
        },
        fail() {
          wx.hideLoading();
          console.log('Failed to download file:', Config.url + fileName);
        },
      });
      that.data.fileList[i].downloadTask.onProgressUpdate((resDownload) => {
        that.data.fileList[i].downloadProgress = resDownload.progress * 100.0;
        // that.setData({
        //   fileList: that.data.fileList,
        // });
      });
      // wx.showModal({
      //   title: '提示',
      //   content: '是否确认下载文件',
      //   success(res) {
      //     if (res.confirm) {
      //       wx.showLoading({
      //         title: '文件下载中...',
      //         mask: true,
      //       });
      //       that.data.fileList[i].isDownload = true;
      //       that.setData({
      //         fileList: that.data.fileList,
      //       });
      //       const fileName = that.data.fileList[i].fileurl;
      //       // 下载并打开文件
      //       that.data.fileList[i].downloadTask = wx.downloadFile({
      //         url: Config.policyUrl + fileName,
      //         success(resPath) {
      //           that.data.fileList[i].isDownload = false;
      //           that.setData({
      //             fileList: that.data.fileList,
      //           });
      //           if (that.data.fileList[i].downloadProgress >= 100) {
      //             wx.hideLoading();
      //             that.data.fileList[i].downloadProgress = 0.0;
      //             that.setData({
      //               fileList: that.data.fileList,
      //             });
      //             wx.showModal({
      //               title: '提示',
      //               content: '下载完成，是否打开文件',
      //               success(resOpen) {
      //                 if (resOpen.confirm) {
      //                   wx.openDocument({
      //                     filePath: resPath.tempFilePath,
      //                     fail() {
      //                       console.log('Failed to open file.', resPath.tempFilePath);
      //                     },
      //                   });
      //                 }
      //               },
      //             });
      //           }
      //         },
      //         fail() {
      //           wx.hideLoading();
      //           console.log('Failed to download file:', Config.url + fileName);
      //         },
      //       });
      //       that.data.fileList[i].downloadTask.onProgressUpdate((resDownload) => {
      //         that.data.fileList[i].downloadProgress = resDownload.progress * 100.0;
      //         // that.setData({
      //         //   fileList: that.data.fileList,
      //         // });
      //       });
      //     }
      //   },
      // });
    } else if (that.data.fileList[i].fileType === 'string') {
      // 进入新页面
      app.globalData.stringTypeFileData = that.data.fileList[i];
      wx.navigateTo({
        url: '../policyDetail/policyDetail',
      });
    } else {
      console.log('fileType有误', that.data.fileList[i]);
    }
  },
  // 取消下载任务
  cancelDownload(event) {
    const i = parseInt(event.currentTarget.id, 10);
    this.data.fileList[i].downloadTask.abort();
  },

  onPullDownRefresh() {
    this.requestTimes = 0;
    this.requestPolicyTable(9999999999999, true);
  },

  onReachBottom() {
    const that = this;
    this.requestTimes = 0;
    this.requestPolicyTable(that.data.timeOld);
  },
});
