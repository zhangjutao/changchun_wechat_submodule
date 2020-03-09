import Config from '../../../utils/Config';
import GraphConfig from '../../../utils/GraphConfig';

let time = 0;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  staticData: {
    moveData: {
      startY: 0,
      startTime: '',
      deltaTime: 350,
      // controlTouch: true,
      // delBtnWidth: 140,
    },
  },
  data: {
    name: '',
    itemIcon: Config.analysis.icon.itemIcon,
    arrowIconRight: Config.analysis.icon.arrowRight,
    arrowIconUp: Config.analysis.icon.arrowUp,
    arrowIconDown: Config.analysis.icon.arrowDown,
    list: [],
    navigatorList: [],
    removeCollectObject: {},  // 用来记录在我的收藏中被删除的指标，key是指标名，value为true
    // 当前大版块的名称
    currentBlockName: '',
    collectionList: [],
    globalCollectionList: [],
    // indexBackgroundUrl: Config.analysis.detailCharts.backgroudUrl,
    indicatorImageList: Config.traffic.indicatorList.images,
    indexIcon: Config.analysis.detailCharts.indexIcon,
    // 当前大板块在导航栏展示的title的个数
    navigaterCounts: 1,
    currentTitle: '',

     // 当前大板块对应的指标列表
    currentIndexList: [],
    currentCategoryId: 0,
    indexIconBasicUrl: Config.assetsUrl + Config.traffic.indicatorList.imageFilePath,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    app.globalData.collectionList.forEach((item, index) => {
      this.data.collectionList[index] = item.split('_')[3];
    });

    const lastList = [];
    for (let i = 0; i < this.data.collectionList.length; i += 1) {
      for (let j = 0; j < GraphConfig.data.length - 1; j += 1) {
        for (let k = 0; k < GraphConfig.data[j].data.length; k += 1) {
          for (let m = 0; m < GraphConfig.data[j].data[k].data.length; m += 1) {
            const saveName = GraphConfig.data[j].data[k].data[m];
            for (let n = 0; n < saveName.data.length; n += 1) {
              const finalList = saveName.data[n];
              if (finalList.name === this.data.collectionList[i]) {
                lastList.push(finalList);
              }
            }
          }
        }
      }
    }
    const newCollectionList = [{
      name: '我的收藏',
      display: true,
      iconFileName: 'collection',
      data: lastList,
    }];
    const useCollectionList = {
      name: '我的收藏',
      data: [
        {
          name: '我的收藏',
          data: newCollectionList,
        },
      ],
    };
    GraphConfig.data.splice(11, 1, useCollectionList);
    this.data.name = GraphConfig.data[options.id].name;
    wx.setNavigationBarTitle({
      title: this.data.name,
    });
    GraphConfig.data[options.id].data.forEach((element) => {
      const dataBlock = {
        name: element.name,
        data: [],
        show: element.show,
      };
      element.data.forEach((item) => {
        const data = Object.assign({}, item, {
          imagePath: `${Config.analysis.icon.imageUrl + item.iconFileName}.png`,
          imageNormal: `${Config.analysis.icon.imageUrl + item.iconFileName}.png`,
          imageActive: `${Config.analysis.icon.imageUrl + item.iconFileName}.png`,
          display: item.display,
        });
        // // 微信貌似暂时不支持 spread operator
        // const data = {
        //   ...item,
        //   imagePath: ResourceManager.analysis[item.name].normal,
        //   imageNormal: ResourceManager.analysis[item.name].normal,
        //   imageActive: ResourceManager.analysis[item.name].active,
        // };
        dataBlock.data.push(data);
      }, this);
      this.data.list.push(dataBlock);
    }, this);
    const navigatorList = this.data.list.filter(item => item.show !== 'none');
    console.log('--------navigatorList------', navigatorList[0]);
    this.setData({
      list: this.data.list,
      navigatorList,
      currentBlockName: GraphConfig.data[options.id].name,
      navigaterCounts: Config.analysis.detailCharts.navigatorCounts[`${GraphConfig.data[options.id].name}`],
      currentTitle: 0,
      currentIndexList: navigatorList[0],
      currentCategoryId: Number(options.id),
      removeCollectObject: {},
      globalCollectionList: app.globalData.collectionList,
    });
  },
  onShow() {
    if (this.data.list[0].name === '我的收藏') {
      const collectionNames = app.globalData.collectionList.map(item => item.split('_')[3]);
      const deleteConfig = this.data.collectionList.filter(item => collectionNames.indexOf(item) === -1);
      if (deleteConfig.length > 0) {
        const newList = this.data.list[0].data[0].data.filter(item => item.name !== deleteConfig[0]);
        const newCollect = [{
          name: '我的收藏',
          data: [{
            ...this.data.list[0].data[0],
            data: newList,
          }],
        }];
        const removeCollectObject = this.data.removeCollectObject;
        removeCollectObject[deleteConfig[0]] = true;
        const navigatorList = this.data.list.filter(item => item.show !== 'none');
        this.setData({
          removeCollectObject,
          collectionList: app.globalData.collectionList.map(e => e.split('_')[3]),
          list: [
            {
              name: '我的收藏',
              data: [{
                ...this.data.list[0].data[0],
                data: this.data.list[0].data[0].data.filter(item => item.name !== deleteConfig[0]),
              }],
            },
          ],
        });
      } else if (collectionNames.join('') !== this.data.collectionList.join('')) {
        const oldList = this.data.list[0].data[0].data;
        const newList = collectionNames.map((item) => {
          let mid = {};
          oldList.forEach((e) => {
            if (e.name === item) {
              mid = e;
            }
          });
          return mid;
        });
        const newCollect = [{
          name: '我的收藏',
          data: [{
            ...this.data.list[0].list[0],
            data: newList,
          }],
        }];

        this.setData({
          collectionList: collectionNames,
          list: newCollect,
        });
      }
    }
  },
  /**
   * 页面滚动到底部的行为
   */
  onReachBottom() {},
  /**
   * 点击项目分类时的响应，用于打开和关闭当前分类的详细列表
   * 仅用于显示的变换，包括列表的显示和隐藏和图标的变化
   *
   * @param {any} event 传入的touch event
   */
  tapItemLevel2(event) {
    const ids = event.currentTarget.id.split('_').map(x => parseInt(x, 10));
    if (this.data.list[ids[0]].data[ids[1]].display) {
      this.data.list[ids[0]].data[ids[1]].display = false;
      this.data.list[ids[0]].data[ids[1]].imagePath
        = this.data.list[ids[0]].data[ids[1]].imageNormal;
    } else {
      this.data.list[ids[0]].data[ids[1]].display = true;
      this.data.list[ids[0]].data[ids[1]].imagePath
        = this.data.list[ids[0]].data[ids[1]].imageActive;
    }
    this.setData({
      list: this.data.list,
    });
  },
  /**
   * 点击最下层具体的项目时的响应，用于跳转到指标详情页面
   * 用详情信息放在title中，用下划线_连接的层级结构
   *q
   * @param {any} event 传入的touch event
   */
  tapItemLevel3(event) {
    const ids = event.currentTarget.id.split('_').map(x => parseInt(x, 10));
    const title = `${this.data.name}_${this.data.list[ids[0]].name}_${this.data.list[ids[0]].data[ids[1]].name}_${this.data.list[ids[0]].data[ids[1]].data[ids[2]].name}`;
    if (this.data.list[ids[0]].data[ids[1]].data[ids[2]].missing) {
      wx.showToast({
        title: '指标尚在制作中……',
        icon: 'loading',
      });
      return;
    }
    // const title = this.data.list[ids[0]].list[ids[1]].list[ids[2]].name;
    wx.navigateTo({
      url: `../detailCharts/detailCharts?title=${title}`,
    });
  },
  // 长按删除，短按进入
  touchStart(event) {
    const that = this;
    const id = event.currentTarget.id.split('_').map(x => parseInt(x, 10))[2];
    const fullTitle = event.currentTarget.dataset.fulltitle;
    // 判断是否只有一个触摸点
    if (event.touches.length === 1) {
      // 记录触摸起始时间位置
      this.staticData.moveData.startTime = event.timeStamp;
      this.staticData.moveData.startY = event.touches[0].clientY;
      time = setTimeout(() => { that.showModal(id, fullTitle, that); }, 500);
    }
  },
  touchMove() {
    clearTimeout(time);
  },
  touchEnd(event) {
    // const id = event.currentTarget.id.split('_').map(x => parseInt(x, 10))[2];
    const title = event.currentTarget.dataset.fulltitle;
    clearTimeout(time);
    if (event.changedTouches.length === 1 &&
      event.changedTouches[0].clientY === this.staticData.moveData.startY) {
      const endTime = event.timeStamp;
      const disTime = endTime - this.staticData.moveData.startTime;
      if (disTime < this.staticData.moveData.deltaTime) {
        // wx.navigateTo({
        //   url: `../detailCharts/detailCharts?&title=${app.globalData.collectionList[id]}`,
        // });
        wx.navigateTo({
          url: `../detailCharts/detailCharts?&title=${title}`,
        });
      }
    }
  },
  showModal(id, fullTitle, that) {
    wx.showModal({
      title: '提示',
      content: '是否确认删除此收藏条目',
      success(res) {
        if (res.confirm) {
          wx.REQUEST({
            // url: Config.url + Config.analysis.url + Config.analysis.detailCharts.url,
            // method: 'POST',
            // data: {
            //   userId: app.globalData.userId,
            //   title: app.globalData.collectionList[id],
            //   isCollect: false,
            // },
            url: Config.url + Config.analysis.collectUrl,
            method: 'DELETE',
            data: {
              name: fullTitle,
            },
            success(resInfo) {
              if (resInfo.data.success) {
                const name = fullTitle.split('_')[3];
                const removeCollectObject = that.data.removeCollectObject;
                const index = app.globalData.collectionList.indexOf(fullTitle);
                app.globalData.collectionList.splice(index, 1);
                removeCollectObject[name] = true;
                that.setData({
                  removeCollectObject,
                  collectionList: app.globalData.collectionList.map(e => e.split('_')[3]),
                  list: [
                    {
                      name: '我的收藏',
                      data: [{
                        ...that.data.list[0].data[0],
                        data: that.data.list[0].data[0].data.filter((item, index) => index !== id),
                      }],
                    },
                  ],
                });
              } else {
                wx.showModal({
                  title: '服务器修改失败，请重试',
                });
              }
            },
            fail() {
              wx.showModal({
                title: '无法连接服务器，请重试',
              });
            },
          });
        }
      },
    });
  },

  tapTitle(event) {
    const { id } = event.target;
    this.setData({
      currentTitle: id,
      currentIndexList: this.data.navigatorList[id],
    });
  },
});
