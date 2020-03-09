import Config from '../../utils/Config';
// import util from '../../utils/util';

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
    // wx.reLaunch({
    //   url: '../analysis/analysis',
    //   // url: '../traffic/traffic',
    // });
    wx.login({
      success(res) {
        wx.request({
          url: Config.common.url.user + Config.logIn.url.login,
          method: 'POST',
          data: {
            wxJsCode: res.code,
          },
          success(resSession) {
            // that.data.userIsVaild = resSession.data.valid;
            const { success, code, data } = resSession.data;
            if (success) {
              const { accessToken, refreshToken } = data;
              app.globalData.accessToken = accessToken;
              app.globalData.refreshToken = refreshToken;
              wx.reLaunch({
                url: '../traffic/traffic',
              });
            } else if (code === '120006') {
              // 用户未注册，则打开授权面板
              that.setData({
                hideAuthButton: false,
                showLoading: false,
              });
            } else if (code === '120008') {
              // jscode不合法
              that.logInWithJSCode();
            } else {
              // TODO:目前还没确定accessToken过期会返回什么结果，当前做法是过期的话，就重新登录一次
              that.logInWithJSCode();
            }
          },
          fail() {
            that.logInWithJSCode();
            // wx.showModal({
            //   title: '提示',
            //   showCancel: false,
            //   content: '无法连接服务器，请打开调试模式后重新加载小程序！',
            //   // success(resOption) {
            //   //   if (resOption.confirm) {
            //   //     that.logInWithJSCode();
            //   //   }
            //   // },
            // });
          },
        });
      },
    });
  },
  register() {
    const that = this;
    wx.login({
      success(res) {
        wx.getSetting({
          success(resSetting) {
            if (resSetting.authSetting['scope.userInfo']) {
              // 如果用户已授权，则获取用户信息
              wx.getUserInfo({
                success(resInfo) {
                  const { nickName, avatarUrl } = resInfo.userInfo;
                  app.globalData.userInfo.nickName = nickName;
                  app.globalData.userInfo.avatarUrl = avatarUrl;
                  // 对用户进行注册
                  wx.request({
                    url: Config.common.url.user + Config.logIn.url.register,
                    method: 'POST',
                    data: {
                      userName: nickName,
                      avatarUrl,
                      wxJsCode: res.code,
                    },
                    success(resSession) {
                      // 如果注册成功，则将accessToken和refreshToken存到全局变量中，然后跳转页面
                      const { success, data, code } = resSession;
                      if (success) {
                        const { accessToken, refreshToken } = data;
                        app.accessToken = accessToken;
                        app.refreshToken = refreshToken;
                        wx.reLaunch({
                          url: '../traffic/traffic',
                        });
                      } else if (code === '120008') {
                        // 如果jscode不合法，则再次执行注册流程
                        that.register();
                      } else if (success === false) {
                        // 该过程是之前的登录逻辑，当isValid为false的时候，执行的步骤，目前不清楚该步骤的作用，暂且放在这里
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
                              that.register();
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
                            that.register();
                          }
                        },
                      });
                    },
                  });
                },
                fail() {
                  console.log('获取用户信息失败');
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
    this.register();
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
