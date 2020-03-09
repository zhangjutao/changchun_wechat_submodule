import { refreshAccessToken } from './utils/util';

App({
  onLaunch() {
    const that = this;
    // 根据接口向后台请求收藏的指标
    that.globalData.collectionList = wx.getStorageSync('analysisCollection') || [];
    
    const viewListTemp = wx.getStorageSync('trafficCollectionViewFlagList');
    if (viewListTemp.length === 8) {
      that.globalData.viewFlagList = viewListTemp;
    }
    // 获取用户系统信息
    try {
      const res = wx.getSystemInfoSync();
      that.globalData.system = {
        ...res,
        pixelRatio: 750 / res.windowWidth,
        os: res.system.split(' ')[0],
      };
    } catch (error) {
      wx.getSystemInfo({
        success(res) {
          that.globalData.system = {
            ...res,
            pixelRatio: 750 / res.windowWidth,
            os: res.system.split(' ')[0],
          };
        },
      });
    }
    // 改写微信原生request方法，在每次接口请求过程，添加header参数,并且进行accessToken是否过期的验证
    wx.REQUEST = function (params) {
      // 此函数为再之前函数的基础上，添加header
      function headerAddedFunction(params1) {
        wx.request({ ...params1,
          header: { access_token: that.globalData.accessToken },
        });
      }
      // 获取请求函数中，第二个参数，即返回成功结果后的执行函数
      const { success: originSuccessFunction } = params;
      /*
      对该函数进行封装，封装内容为在拿到返回结果后，首先判断accessToken是否过期，如果未过期，则
      执行原函数。如果accessToken过期，则首先刷新accessToken，然后再次执行请求
       */
      function newSuccessFunction(res) {
        const { code } = res;
        if (code === '120003') {
          /*
          如果accessToken过期，则先刷新token，再执行函数。此处之所以把函数当做参数传过去，是因为
          refreshAccessToken是异步过程，需要保证在accessToken刷新完成后，才能继续执行后续步骤
           */
          refreshAccessToken(() => headerAddedFunction(params));
        } else {
          // 如果accessToken未过期，则执行原函数
          originSuccessFunction(res);
        }
      }
      wx.request({
        ...params,
        success: newSuccessFunction,
        header: { access_token: that.globalData.accessToken },
      });
    };
  },
  // MARK: 数据部分，每一条都要有注释
  globalData: {
    // 用户系统信息
    system: {
      windowWidth: 0,
      windowHeight: 0,
      pixelRatio: 0,
      // 有tabbar时获取屏幕高度
      screenHeight: 0,
      // os: 用户操作系统类型，'iOS'、'Android'
      os: '',
    },
    accessToken: '',
    refreshToken: '',
    // userId: '',
    // 用户验证信息
    userInfo: {
      avatarUrl: '',
      nickName: '',
    },
    // expiredTime: 5 * 24 * 3600 * 1000,
    // third_session: null,
    // 交通运行页面，我的收藏信息
    viewFlagList: [],
    // 数据在手页面我的收藏栏信息
    collectionList: [],
    // 'string'类型文件数据，用于 policyDetail页面展示，从 policyTable页面中获取值
    stringTypeFileData: {},
    // newsDetail 和 newsTable 跳转的收藏新闻
    newsChangedItem: {
      listID: -1,
      valid: false,
      isCollect: false,
    },
    // pending 的 map 请求
    mapDataPending: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
    },
    // 地图数据
    mapData: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
    },
  },
});

