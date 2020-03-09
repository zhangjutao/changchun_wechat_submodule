import Config from '../../utils/Config';
import GraphConfig from '../../utils/GraphConfig';

const app = getApp();

Page({
  staticData: {
    searchFuzzy: GraphConfig.data,
    searchComparison: [],
    // 下载任务
    downloadTask: '',
  },

  /**
   * 页面的初始数据
   */
  data: {
    // 图片位置
    imageSrc: Config.url,
    searchSrc: Config.search.icon.search,
    deleteSrc: Config.search.icon.delete,
    deleteButtonSrc: Config.search.icon.deleteButton,
    eyeSrc: Config.search.icon.eye.normal,
    matchSrc: Config.analysis.icon.arrowRight,
    // 输入栏和搜索
    searchSuggestion: Config.search.searchSuggestion,
    inputValue: '',
    searchHistory: {
      analysis: [],
      news: [],
      'resource-file': [],
    },
    searchMatch: [],
    isMatch: false,
    eyeNormal: true,
    type: '',
    searchResult: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    this.setData({
      type: options.type,
    });
    wx.getStorage({
      key: 'searchHistory',
      success(res) {
        that.setData({
          searchHistory: res.data,
        });
      },
    });
  },
  /**
   * 事件处理函数
   */
  // 实时写入inputValue，模糊搜索
  bindKeyInput(event) {
    const that = this;
    let flag = false;
    if (event.detail.cursor > 0) {
      that.setData({
        isMatch: true,
        inputValue: event.detail.value,
        searchMatch: [],
      });
      if (this.data.type === 'analysis') {
        // 模糊搜索匹配
        const reg = new RegExp(`[${that.data.inputValue}]`, 'i');
        for (let i = 0; i < that.staticData.searchFuzzy.length; i += 1) {
          for (let j = 0; j < that.staticData.searchFuzzy[i].data.length; j += 1) {
            for (let k = 0; k < that.staticData.searchFuzzy[i].data[j].data.length; k += 1) {
              for (let l = 0;
                l < that.staticData.searchFuzzy[i].data[j].data[k].data.length;
                l += 1) {
                if (reg.test(that.staticData.searchFuzzy[i].data[j].data[k].data[l].name) && that.staticData.searchFuzzy[i].data[j].data[k].data[l].show !== 'none') {
                  // 检验搜索匹配结果有无重复
                  flag = false; // 每次匹配上重置flag
                  for (let m = 0; m < that.data.searchMatch.length; m += 1) {
                    if (that.data.searchMatch[m].name ===
                      that.staticData.searchFuzzy[i].data[j].data[k].data[l].name) {
                      flag = true;
                    }
                  }
                  if (!flag) {
                    that.data.searchMatch.push({
                      name: that.staticData.searchFuzzy[i].data[j].data[k].data[l].name,
                      title: `${that.staticData.searchFuzzy[i].name}_${that.staticData.searchFuzzy[i].data[j].name}_${that.staticData.searchFuzzy[i].data[j].data[k].name}_${that.staticData.searchFuzzy[i].data[j].data[k].data[l].name}`,
                    });
                  }
                }
              }
            }
          }
        }
        // 模糊匹配到的字符红色，其他字符黑色
        for (let i = 0; i < that.data.searchMatch.length; i += 1) {
          that.data.searchMatch[i].splitTitle = that.data.searchMatch[i].name.split('');
          that.data.searchMatch[i].isRed = [];
          that.data.searchMatch[i].num = 0;
          for (let j = 0; j < that.data.searchMatch[i].splitTitle.length; j += 1) {
            if (reg.test(that.data.searchMatch[i].splitTitle[j])) {
              that.data.searchMatch[i].isRed[j] = true;
              that.data.searchMatch[i].num += 1;
            } else {
              that.data.searchMatch[i].isRed[j] = false;
            }
          }
        }
        // 按照匹配的字符数多少排序
        that.data.searchMatch.sort((a, b) => b.num - a.num);
        that.setData({
          searchMatch: that.data.searchMatch,
        });
      }
    } else {
      that.setData({
        isMatch: false,
        searchMatch: [],
        searchResult: [],
      });
    }
  },
  // 点击取消
  tapSearchNote() {
    wx.navigateBack({
      delta: 1,
    });
  },
  // 清除历史记录
  clearHistory(event) {
    this.data.searchHistory[event.currentTarget.dataset.type] = [];
    this.setData({
      searchHistory: this.data.searchHistory,
    });
    wx.setStorage({
      key: 'searchHistory',
      data: this.data.searchHistory,
    });
  },
  // 点击历史／热门
  searchContent(event) {
    const input = {
      detail: {
        value: '',
        cursor: 0,
      },
    };
    const id = parseInt(event.currentTarget.id, 10);
    if (event.currentTarget.dataset.entry === 'history') {
      input.detail.value = this.data.searchHistory[this.data.type][id];
      input.detail.cursor = this.data.searchHistory[this.data.type][id].length;
    } else {
      // console.log('this.data.searchSuggestion[this.data.type][id]', this.data.searchSuggestion, this.data.type, id);
      input.detail.value = this.data.searchSuggestion[this.data.type][id];
      input.detail.cursor = this.data.searchSuggestion[this.data.type][id].length;
    }
    if (this.data.type === 'analysis') {
      // console.log('this.bindKeyInput(input)', input);
      this.bindKeyInput(input);
    } else {
      this.confirmInput(input);
    }
  },
  // 隐藏热门搜索
  clearSuggestion() {
    if (this.data.eyeNormal) {
      this.data.eyeNormal = false;
      this.data.eyeSrc = Config.search.icon.eye.notsee;
    } else {
      this.data.eyeNormal = true;
      this.data.eyeSrc = Config.search.icon.eye.normal;
    }
    this.setData({
      eyeNormal: this.data.eyeNormal,
      eyeSrc: this.data.eyeSrc,
    });
  },
  // 点击具体指标
  tapDetail(event) {
    let flag = false;
    const id = parseInt(event.currentTarget.id, 10);
    // 点击的指标存入历史搜索analysis中
    for (let i = 0; i < this.data.searchHistory.analysis.length; i += 1) {
      if (this.data.inputValue === this.data.searchHistory.analysis[i]) {
        flag = true;
      }
    }
    if (!flag) {
      this.data.searchHistory.analysis.push(this.data.inputValue);
      this.setData({
        searchHistory: this.data.searchHistory,
      });
      wx.setStorage({
        key: 'searchHistory',
        data: this.data.searchHistory,
      });
    }
    const that = this;
    wx.navigateTo({
      url: `../traffic/detailCharts/detailCharts?title=${that.data.searchMatch[id].title}`,
    });
  },
  // 点击清除搜索内容
  tapSearchDelete() {
    this.setData({
      inputValue: '',
      isMatch: false,
      searchMatch: [],
      searchResult: [],
    });
  },
  // 搜索资讯和文件时回车搜索
  confirmInput(event) {
    if (event.detail.cursor > 0) {
      this.setData({
        inputValue: event.detail.value,
      });
    }
    const that = this;
    // console.log('搜索：', app.globalData.userId, Config.url + Config.search.sendUrl, event.detail.value, that.data.type);
    wx.REQUEST({
      url: Config.url + Config.search.sendUrl,
      method: 'POST',
      data: {
        // callback: Config.callback,
        userId: app.globalData.userId,
        id: app.globalData.userId,
        search: event.detail.value,
        category: that.data.type,
      },
      success(res) {
        if (res.statusCode !== 200) return;
        // 模糊匹配到的字符红色，其他字符黑色
        const reg = new RegExp(`[${that.data.inputValue}]`, 'i');
        that.data.searchResult = res.data;
        for (let i = 0; i < that.data.searchResult.length; i += 1) {
          that.data.searchResult[i].splitTitle = that.data.searchResult[i].title.split('');
          that.data.searchResult[i].isRed = [];
          that.data.searchResult[i].num = 0;
          for (let j = 0; j < that.data.searchResult[i].splitTitle.length; j += 1) {
            if (reg.test(that.data.searchResult[i].splitTitle[j])) {
              that.data.searchResult[i].isRed[j] = true;
            } else {
              that.data.searchResult[i].isRed[j] = false;
            }
          }
        }
        that.setData({
          searchResult: that.data.searchResult,
        });
      },
    });
    // 搜索对应存入历史搜索policy/news/analysis中
    let flag = false;
    if (this.data.inputValue) {
      if (this.data.searchHistory[this.data.type]) {
        for (let i = 0; i < this.data.searchHistory[this.data.type].length; i += 1) {
          if (this.data.inputValue === this.data.searchHistory[this.data.type][i]) {
            flag = true;
          }
        }
      } else {
        this.data.searchHistory[this.data.type] = [];
      }
      if (!flag) {
        this.data.searchHistory[this.data.type].push(this.data.inputValue);
        this.setData({
          searchHistory: this.data.searchHistory,
        });
        wx.setStorage({
          key: 'searchHistory',
          data: this.data.searchHistory,
        });
      }
    }
  },
  // 下载文件
  viewFile(event) {
    const id = parseInt(event.currentTarget.id, 10);
    // console.log('下载文件：searchResult', this.data.searchResult, id);
    const that = this;
    if (this.data.searchResult[id].newsId) {
      wx.showModal({
        title: '提示',
        content: '是否确认下载文件',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '文件下载中...',
              mask: true,
            });
            that.data.searchResult[id].isDownload = true;
            that.setData({
              searchResult: that.data.searchResult,
            });
            const fileName = that.data.searchResult[id].fileurl;
            // console.log(`downloading...${Config.policyUrl}${fileName}`);
            // 下载文件
            that.data.searchResult[id].downloadTask = wx.downloadFile({
              url: Config.policyUrl + fileName,
              success(resPath) {
                // console.log('download file success.');
                that.data.searchResult[id].isDownload = false;
                that.setData({
                  searchResult: that.data.searchResult,
                });
                if (that.data.searchResult[id].downloadProgress >= 100.0) {
                  wx.hideLoading();
                  // wx.showModal({
                  //   title: '提示',
                  //   content: '下载完成，是否打开文件',
                  //   success(resOpen) {
                  //     if (resOpen.confirm) {
                  //       // console.log('ready to open file.');
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
            });
            that.data.searchResult[id].downloadTask.onProgressUpdate((resDownload) => {
              that.data.searchResult[id].downloadProgress = resDownload.progress * 100.0;
              that.setData({
                searchResult: that.data.searchResult,
              });
            });
          }
        },
      });
    } else {
      app.globalData.stringTypeFileData = {
        ...this.data.searchResult[id],
        filename: this.data.searchResult[id].title,
        formatTime: this.data.searchResult[id].date,
      };
      wx.navigateTo({
        url: '../policy/policyDetail/policyDetail',
      });
    }
  },
  // 取消下载任务
  cancelDownload(event) {
    const i = parseInt(event.currentTarget.id, 10);
    this.data.searchResult[i].downloadTask.abort();
  },
  // 进入 newsDetail 页面
  enterNewsDetail(event) {
    const id = parseInt(event.currentTarget.id, 10);
    const name = '资讯搜索';
    const newsId = this.data.searchResult[id].newsId;
    wx.navigateTo({
      url: `../news/newsDetail/newsDetail?name=${name}&id=${newsId}`,
    });
  },
});
