import Config from '../../utils/Config';
import { checkAccessToken } from '../../utils/util';

const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hideAuthButton: true,
    hideUpdateButton: true,
    showLoading: true,
    userIsValid: false,
    showPasswordDots: false,
    passwordLength: Config.logIn.passwordLength,
    inputPassword: [],
    // 设备信息
    windowHeight: app.globalData.system.windowHeight * app.globalData.system.pixelRatio,
    // 图片路径, 本地图片
    logoImage: Config.logIn.logoImage,
    sloganImage: Config.logIn.sloganImage,
    loadingImage: Config.logIn.loadingImage,
    deleteImage: Config.logIn.deleteImage,
    // logo 区域中心具体顶部位置
    // eslint-disable-next-line
    centerTop: 0.5 * (app.globalData.system.windowHeight * app.globalData.system.pixelRatio - Config.logIn.sloganHeight - 180),
    // 间隔距离
    intervalSpace: 0,
    // logo 光环的三个圈圈大小
    circleOutterSize: Config.logIn.circleOutterSize,
    circleCenterSize: Config.logIn.circleCenterSize,
    circleInnerSize: Config.logIn.circleInnerSize,
    // logo 大小
    logoImageWidth: Config.logIn.logoImageWidth,
    logoImageHeight: Config.logIn.logoImageHeight,
    // slogan 大小
    sloganWidth: Config.logIn.sloganWidth,
    sloganHeight: Config.logIn.sloganHeight,
    // 缩放比
    scaleRatio: 1,
    styleInput: Config.logIn.styleInput,

    dotsStyle: [],
    animationShakeDots: {},
    animationLoading: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() { },

  onReady() {
    this.logInWithJSCode();
  },

  logInWithJSCode() {
    const that = this;
    // app.globalData.userId = 'or1615M0X52BMYz1maVdJYyay_ys';
    // app.globalData.userId = 3104172;
    checkAccessToken(1, 2, 3);
    wx.reLaunch({
      url: '../analysis/analysis',
      // url: '../traffic/traffic',
    });
    // wx.login({
    //   success(res) {
    //     wx.REQUEST({
    //       url: Config.url + Config.logIn.url,
    //       method: 'POST',
    //       data: {
    //         // name: app.globalData.userInfo.nickName,
    //         // avatarUrl: app.globalData.userInfo.avatarUrl,
    //         js_code: res.code,
    //       },
    //       success(resSession) {
    //         that.data.userIsVaild = resSession.data.valid;
    //         if (that.data.userIsVaild) {
    //           app.globalData.userId = resSession.data.userId;
    //           wx.reLaunch({
    //             url: '../traffic/traffic',
    //           });
    //         } else if (resSession.data.msg === 'updating') {
    //           that.setData({
    //             hideUpdateButton: false,
    //             showLoading: false,
    //           });
    //         } else {
    //           that.setData({
    //             hideAuthButton: false,
    //             showLoading: false,
    //           });
    //         }
    //       },
    //       fail() {
    //         that.logInWithJSCode();
    //         // wx.showModal({
    //         //   title: '提示',
    //         //   showCancel: false,
    //         //   content: '无法连接服务器，请打开调试模式后重新加载小程序！',
    //         //   // success(resOption) {
    //         //   //   if (resOption.confirm) {
    //         //   //     that.logInWithJSCode();
    //         //   //   }
    //         //   // },
    //         // });
    //       },
    //     });
    //   },
    // });
  },

  onReachBottom() { },

  logIn() {
    const that = this;
    // 验证用户信息...
    wx.reLaunch({
      url: '../traffic/traffic',
    });
    wx.login({
      success(res) {
        wx.getSetting({
          success(resSetting) {
            if (resSetting.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success(resInfo) {
                  app.globalData.userInfo.nickName = resInfo.userInfo.nickName;
                  app.globalData.userInfo.avatarUrl = resInfo.userInfo.avatarUrl;
                  wx.REQUEST({
                    url: Config.url + Config.logIn.urlWithPassword,
                    method: 'POST',
                    data: {
                      name: resInfo.userInfo.nickName,
                      avatarUrl: resInfo.userInfo.avatarUrl,
                      js_code: res.code,
                      password: that.data.inputPassword.join('') || 222222,
                    },
                    success(resSession) {
                      that.data.userIsVaild = resSession.data.valid;
                      if (that.data.userIsVaild) {
                        wx.setStorage({
                          key: 'userIsVaild',
                          data: true,
                        });
                        app.globalData.userId = resSession.data.userId;
                        wx.reLaunch({
                          url: '../traffic/traffic',
                        });
                      } else if (that.data.userIsVaild === false) {
                        const ratio = app.globalData.system.pixelRatio;
                        const animation = wx.createAnimation();
                        animation.translate(-40 / ratio, 0).step({ duration: 50 });
                        animation.translate(40 / ratio, 0).step({ duration: 100 });
                        animation.translate(-20 / ratio, 0).step({ duration: 75 });
                        animation.translate(20 / ratio, 0).step({ duration: 50 });
                        animation.translate(0 / ratio, 0).step({ duration: 25 });
                        that.setData({
                          animationShakeDots: animation.export(),
                        });
                      } else {
                        wx.showModal({
                          title: '提示',
                          showCancel: false,
                          content: '无法连接服务器，请登录重试！',
                          success(resOption) {
                            if (resOption.confirm) {
                              that.logIn();
                            }
                          },
                        });
                      }
                    },
                    fail() {
                      wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '无法连接服务器，请点击登录重试！',
                        success(resOption) {
                          if (resOption.confirm) {
                            that.logIn();
                          }
                        },
                      });
                    },
                  });
                },
                fail() {
                  console.log('get user info fail');
                },
              });
            } else {
              console.log('尚未授权');
            }
          },
          fail() {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '无法获取微信授权，请检查网络或删除小程序重新加载',
            });
          },
        });
      },
    });
  },
  bindGetUserInfo(e) {
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      wx.showModal({
        title: '授权提示',
        showCancel: false,
        content: '本应用需要授权，请重新授权',
      });
      return;
    }

    this.setData({
      hideAuthButton: true,
    });
    // 无法直接登录小程序
    this.data.intervalSpace =
      (this.data.windowHeight - 704 - Config.logIn.scaleRatio * this.data.circleOutterSize) / 3;
    const newCenterTop =
      this.data.intervalSpace + 0.5 * Config.logIn.scaleRatio * this.data.circleOutterSize;
    this.setData({
      scaleRatio: Config.logIn.scaleRatio,
      centerTop: newCenterTop,
      intervalSpace: this.data.intervalSpace,
      // showPasswordDots: true,
      dotsStyle: Array(this.data.passwordLength).fill(''),
    });
    this.logIn();
  },

  buttonTouchStart(event) {
    const id = parseInt(event.currentTarget.id, 10);
    if (id === 10) {
      this.data.inputPassword = [];
    } else if (id === 12) {
      this.data.inputPassword.pop();
    } else if (this.data.inputPassword.length < this.data.passwordLength) {
      if (id === 11) {
        this.data.inputPassword.push(0);
      } else {
        this.data.inputPassword.push(id);
      }
    }
    // 更新密码点样式
    const inputLength = this.data.inputPassword.length;
    for (let i = 0; i < this.data.passwordLength; i += 1) {
      if (i < inputLength) {
        this.data.dotsStyle[i] = Config.logIn.activeDotStyle;
      } else {
        this.data.dotsStyle[i] = Config.logIn.normalDotStyle;
      }
    }
    // 更改 button 样式
    this.setData({
      dotsStyle: this.data.dotsStyle,
    });
    if (inputLength === this.data.passwordLength) {
      this.logIn();
    }
  },
});


// gfgfgfg
