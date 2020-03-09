/* eslint-disable max-len */
import F2 from '@antv/wx-f2';
import Config from '../../../utils/Config';
import GraphConfig from '../../../utils/GraphConfig';
import transformData from '../../../utils/transform-data/index';

const app = getApp();

Page({
  data: {
    // os: 用于兼容安卓和 iOS 的 picker 组件闪退问题
    // WeChat 6.5.19 修复了这个bug，不过微信小程序这个问题之前曾反复出现过，因此 os 留下来备用
    // os: app.globalData.system.os,
    os: 'iOS',
    // dataList：当前页面需要画出来的图表数据
    dataList: [],
    // title
    title: '',
    // fullTitle: 指标完整标题
    fullTitle: '',
    isCollect: false,
    collectImgSrc: Config.news.newsDetail.icon.star.normal,
    pickerList: [],
    imgArrowDown: Config.analysis.detailCharts.arrowDown,
    url: [],
    // savedConfig: 四级指标所对应的配置信息
    savedConfig: {},
    // 用来展示一些文字, {title: string, content: string}
    textContent: null,
    opts: {
      onInit: '',
    },
  },

  // 图表数据源 url 对应表
  urlList: [],
  // 每个指标对应的图表的个数
  urlChartList: [],

  // 图表数据，包含所有年限
  fullYearChartData: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    this.setData({
      opts: {
        onInit: that.initChart,
      },
    });
    this.data.fullTitle = options.title;
    this.setData({
      title: options.title.split('_')[options.title.split('_').length - 1],
    });
    const collected = app.globalData.collectionList.find(e => e === options.title);
    if (collected) {
      this.setData({
        isCollect: true,
        collectImgSrc: Config.news.newsDetail.icon.star.active,
      });
    }
    const currentConfig = this.getConfig(options.title, GraphConfig);
    // currentConfig 为GraphConfig中该指标的配置
    that.data.savedConfig = { ...currentConfig };
    this.requestTimes = 0;
    // 判断此指标是否是有独立url的指标，如果是，将url存到url列表中
    if (!currentConfig.noIndicator) {
      that.requestIndicatorData(options, currentConfig);
    }
    if (currentConfig.summary) {
      that.requestSummary(currentConfig);
    }
  },
  // 工具函数，用来将时间戳转换为年份或分钟段
  getAllDate(year) {
    const yearPart = (new Date(year)).getFullYear();
    const monthPart = (new Date(year)).getMonth() + 1;
    const datePart = (new Date(year)).getDate();
    const hourPart = (new Date(year)).getHours();
    const minutePart = (new Date(year)).getMinutes();
    // return `${yearPart}-${monthPart}-${datePart}`;
    return {
      date: `${yearPart}-${monthPart}-${datePart}`,
      minutes: `${hourPart}:${minutePart}`,
    };
  },
  requestIndicatorData(options, currentConfig, update) {
    if (this.requestTimes > 10) {
      return;
    }
    this.requestTimes += 1;
    const that = this;
    // let idList = '';
    // currentConfig.id.forEach((id, index) => {
    //   if (index === 0) {
    //     idList += `?customerIds%5B%5D=${id}&`;
    //   } else {
    //     idList += `customerIds%5B%5D=${id}&`;
    //   }
    // });
    const newData = currentConfig.url ?
    currentConfig.dates : {
      // 'customerIds[]': currentConfig.id,
      customerIds: currentConfig.id,
      begin: currentConfig.begin || 0,
      end: 2345123451000,
      city: currentConfig.city,
    };
    const reportIndicatorUrl = Config.common.url.reportIndicator + Config.indicator.url.indicatorSearch;
    // const reportIndicatorUrl = Config.common.url.reportIndicator + Config.traffic.url.indicatorSearch + idList;
    const initialUrl = currentConfig.url ? currentConfig.url : reportIndicatorUrl;
    const updatedUrl = currentConfig.url ? (update && update.url || null) : reportIndicatorUrl;
    const Url = update ? updatedUrl : initialUrl;
    wx.REQUEST({
      url: Url,
      data: update ? update.data : newData,
      method: 'POST',
      success(res) {
        // 从服务器得到图表数据
        if (res.statusCode === 200) {
          const resData = res.data;
          console.log('resData:', resData);
          if (resData.series.length === 0) {
            wx.showModal({
              showCancel: false,
              title: '查询结果为空！',
            });
            return;
          }
          const finalData = transformData(currentConfig, resData);
          if (!update) {
            that.initPickerList(currentConfig);
          }
          that.finalData = finalData;
          that.drawChart(finalData);
        } else {
          that.requestIndicatorData(options, currentConfig, update);
        }
      },
      fail() {
        that.requestIndicatorData(options, currentConfig, update);
      },
    });
  },
  requestSummary(currentConfig) {
    const that = this;
    wx.REQUEST({
      url: `${Config.url}/statistics-summary/summary`,
      data: currentConfig.summary,
      method: 'POST',
      success(res) {
        if (res.statusCode === 200) {
          that.setData({
            textContent: {
              title: res.data.data[0].title,
              content: res.data.data[0].content.replace(' ', '').split('\n'),
            },
          });
        }
      },
    });
  },

  // drawChart的参数为当前页面需要画出来的图表数据
  drawChart(templateData, update) {
    // 更新表格
    this.setData({
      dataList: templateData,
    });
    // 处理 templateData 截取其中需要的时间部分, 传入数据到每个canvas
    // const arrayList = update ? update.list : templateData.map((e, i) => i);
    // arrayList.forEach((index) => {
    //   if (templateData[index].type !== 'table') {
    //     Charts.DrawChart(index.toString(), {
    //       ...templateData[index],
    //       graph: templateData[index].data,
    //     });
    //   }
    // });
  },

  // 收藏按钮
  tapCollect() {
    const that = this;
    wx.REQUEST({
      // url: Config.url + Config.analysis.url + Config.analysis.detailCharts.url,
      // url: Config.url + Config.analysis.collectUrl + that.data.fullTitle,
      url: Config.url + Config.analysis.collectUrl,
      method: that.data.isCollect ? 'DELETE' : 'POST',
      data: {
        name: that.data.fullTitle,
        // access_token: app.globalData.accessToken,
      },
      success(resInfo) {
        if (resInfo.data.success) {
          if (that.data.isCollect) {
            that.setData({
              isCollect: false,
              collectImgSrc: Config.news.newsDetail.icon.star.normal,
            });
            const originList = app.globalData.collectionList;
            app.globalData.collectionList = originList.filter(e => e !== that.data.fullTitle);
            wx.showToast({
              title: '取消收藏',
            });
          } else {
            that.setData({
              isCollect: true,
              collectImgSrc: Config.news.newsDetail.icon.star.active,
            });
            app.globalData.collectionList.unshift(that.data.fullTitle);
            wx.showToast({
              title: '收藏成功',
            });
          }
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
  },
  tapCollect1() {
    const that = this;
    wx.REQUEST({
      url: Config.common.url.user + Config.traffic.url.idicatorCollect,
      method: 'POST',
      data: {
        userId: app.globalData.userId,
        title: that.data.fullTitle,
        isCollect: !that.data.isCollect,
      },
      success(resInfo) {
        if (resInfo.data.success) {
          if (that.data.isCollect) {
            that.setData({
              isCollect: false,
              collectImgSrc: Config.news.newsDetail.icon.star.normal,
            });
            const originList = app.globalData.collectionList;
            app.globalData.collectionList = originList.filter(e => e !== that.data.fullTitle);
            wx.showToast({
              title: '取消收藏',
            });
          } else {
            that.setData({
              isCollect: true,
              collectImgSrc: Config.news.newsDetail.icon.star.active,
            });
            app.globalData.collectionList.push(that.data.fullTitle);
            wx.showToast({
              title: '收藏成功',
            });
          }
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
  },
  // picker 时间选择
  bindDateChange(event) {
    const ids = event.currentTarget.id.split('_').map(x => parseInt(x, 10));
    this.data.pickerList[ids[0]][ids[1]] = event.detail.value.toString();
    this.setData({
      pickerList: this.data.pickerList,
    });
  },

  /**
   * 查询更新图表数据
   */
  update(event) {
     // 从服务器获取图表数据
    // 请求相应 ID 的所有年限的数据
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '数据源不稳定，暂不可查询！',
    });
    // const that = this;
    // const currentConfig = this.data.savedConfig;
    // // id 就是 chartData 的数据编号
    // const id = parseInt(event.currentTarget.id, 10);
    // // pickerList 默认为 dataTimeStart 和 dataTimeEnd
    // // const startTimeStr = this.data.pickerList[id][0] || this.fullYearChartData[id].dataTimeStart.toString();
    // const startTimeStr = this.data.pickerList[id][0];
    // // const endTimeStr = this.data.pickerList[id][1] || this.fullYearChartData[id].dataTimeEnd.toString();
    // const endTimeStr = this.data.pickerList[id][1];
    // // 转换时间格式
    // const tableTimeNumber = currentConfig.table && currentConfig.table.timeNumber;
    // const chartTimeNumber = currentConfig.chart && currentConfig.chart.timeNumber;
    // const startTime = startTimeStr.split('-');
    // const endTime = tableTimeNumber === 1 || chartTimeNumber === 1 ? startTimeStr.split('-') : endTimeStr.split('-');
    // const formatStartTime = this.formatDate(startTime);
    // const formatEndTime = tableTimeNumber === 1 || chartTimeNumber === 1 ? this.formatDate(startTime) : this.formatDate(endTime);
    // let lendTime = 0;
    // let timeRange = 0;
    // if (currentConfig.maxRange && currentConfig.table.fields && currentConfig.table.fields === 'day') {
    //   timeRange = currentConfig.maxRange * 24 * 60 * 60 * 1000;
    //   lendTime = Number(new Date(endTime)) - Number(new Date(startTime));
    // } else if (currentConfig.maxRange && currentConfig.table.fields && currentConfig.table.fields === 'year') {
    //   timeRange = currentConfig.maxRange * 365 * 24 * 60 * 60 * 1000;
    //   lendTime = Number(new Date(endTime)) - Number(new Date(startTime));
    // }
    // if (formatStartTime > formatEndTime) {
    //   if (currentConfig.table.timeNumber === 2 || currentConfig.chart.timeNumber === 2) {
    //     wx.showModal({
    //       title: '提示',
    //       showCancel: false,
    //       content: '起始时间不能大于结束时间，请重新选择',
    //     });
    //     return;
    //   }
    // } else if (lendTime > timeRange) {
    //   if (currentConfig.table.timeNumber === 2 || currentConfig.chart.timeNumber === 2) {
    //     wx.showModal({
    //       title: '提示',
    //       showCancel: false,
    //       content: `时间查询范围最大为${currentConfig.maxRange}天，请重新选择`,
    //     });
    //     return;
    //   }
    // }
    // // // 从服务器获取图表数据
    // // // 请求相应 ID 的所有年限的数据
    // // const that = this;
    // // const currentConfig = this.data.savedConfig;
    // // 此处进行修改，原时间戳都传的是一年中1月日，先改为每年的12月30日；
    // const dataSendTmp = {
    //   begin: new Date(parseInt(startTime[0], 10), (parseInt(startTime[1], 10) - 1) || 0, parseInt(startTime[2], 10) || 1).getTime(),
    //   end: new Date(parseInt(endTime[0], 10), (parseInt(endTime[1], 10) - 1) || 11, parseInt(endTime[2], 10) || 30).getTime(),
    // };
    // const dataSend = currentConfig.url
    //   ? dataSendTmp
    //   : {
    //     ...dataSendTmp,
    //     id: currentConfig.id,
    //   };
    // that.requestIndicatorData(null, currentConfig, {
    //   data: dataSend,
    //   title: that.data.fullTitle,
    //   // eslint-disable-next-line
    //   // url: currentConfig.url ? ((currentConfig.type === 1) ? currentConfig.url : `${currentConfig.url.split('sdate')[0]}sdate=${formatStartTime}&edate=${formatEndTime}`) : null,
    //   url: currentConfig.url ? currentConfig.url : null,
    // });
  },
  // 初始化时间选择器
  initPickerList(currentConfig) {
    const { dates, spliteByTime } = currentConfig;
    if (this.data.os === 'iOS' && dates) {
      if (currentConfig.table.timeNumber === 1) {
        const timeEnd = this.transformDate(dates.end).date;
        this.data.pickerList[0] = [timeEnd, ''];
      } else if (currentConfig.table.timeNumber === 2) {
        const timeStart = this.transformDate(dates.begin).date;
        const timeEnd = this.transformDate(dates.end).date;
        this.data.pickerList[0] = [timeStart, timeEnd];
      } else {
        this.data.pickerList[0] = ['', ''];
      }
    } else if (spliteByTime) {
      const timeEnd = this.transformDate(dates.end).year;
      this.data.pickerList[0] = [timeEnd, ''];
    } else {
      this.data.pickerList[0] = ['', ''];
    }

    // Array().fill()好像是浅复制，此处不能使用
    // this.data.pickerList = Array(templateData.length).fill(['', '']);
    this.setData({
      pickerList: this.data.pickerList,
    });
  },
  transformDate(time) {
    const yearPart = (new Date(time)).getFullYear();
    let monthPart = ((new Date(time)).getMonth() + 1).toString();
    let datePart = ((new Date(time)).getDate()).toString();
    let hourPart = (new Date(time)).getHours().toString();
    let minutePart = (new Date(time)).getMinutes().toString();
    hourPart = hourPart.length === 1 ? `0${hourPart}` : hourPart;
    minutePart = minutePart.length === 1 ? `0${minutePart}` : minutePart;
    monthPart = monthPart.length === 1 ? `0${monthPart}` : monthPart;
    datePart = datePart.length === 1 ? `0${datePart}` : datePart;
    return {
      date: `${yearPart}-${monthPart}-${datePart}`,
      minutes: `${hourPart}:${minutePart}`,
      hours: hourPart,
      year: yearPart,
    };
  },
  // 格式化日期为 YYYYMMDD，例如：201710，20171013，传入为[ YYYY, MM, DD ]
  formatDate(date) {
    // 转换时间格式
    let formatDate;
    if (date.length === 1) {
      formatDate = `${date[0]}0101`;
    } else if (date.length === 2) {
      formatDate = `${date[0]}${date[1]}01`;
    } else {
      formatDate = `${date[0]}${date[1].length === 1 ? `0${date[1]}` : date[1]}${date[2].length === 1 ? `0${date[2]}` : date[2]}`;
    }
    return formatDate;
  },

  // get last element in array
  getLast(array) {
    if (!array || !array.length || array.length === 0) {
      return null;
    }
    return array[array.length - 1];
  },
  getConfig(path, totalConfig) {
    const pathArray = path.split('_');
    const currentConfig = totalConfig.data.find(n => n.name === pathArray[0]).data
      .find(n => n.name === pathArray[1]).data
      .find(n => n.name === pathArray[2]).data
      .find(n => n.name === pathArray[3]);
    return currentConfig;
  },
  initChart(canvas) {
    const that = this;
    // 获取当前图表的canvasId；每个图表在初始化的时候都会调用initChart函数
    const { canvasId } = canvas.ctx;
    const { data } = that.finalData[canvasId];
    // 获取当前指标的配置以及图表类型
    const { chart: chartConfig } = that.data.savedConfig;
    const { type: chartType, minY, maxY, minYRight, tickCount, height, series, series2, rotate } = chartConfig[Number(canvasId) - 1];
    // 获取一个f2实例
    const deviceWidth = wx.getSystemInfoSync().windowWidth - 37;
    that[`chart${canvasId}`] = new F2.Chart({
      el: canvas,
      width: deviceWidth,
      height: height ? deviceWidth * height : deviceWidth * 0.7,
    });
    // 将数据传入f2，并且设置y轴的最小值(column-line类型数据对应参数为data1，data2；其他类型为数据对应参数为data)
    that[`chart${canvasId}`].source(data, {
      data1: {
        min: 0,
      },
      data2: {
        min: minYRight || 0,
      },
      data: {
        min: minY || 0,
        max: maxY || null,
      },
    });
    //  设置legend图例在chart中的位置
    that[`chart${canvasId}`].legend('name', {
      position: 'top',
      align: 'left',
      nameStyle: {
        fontSize: 9,
      },
    });
    // 调节x轴label文字的旋转角度
    that[`chart${canvasId}`].axis('category', {
      label: {
        rotate: rotate? rotate : -0.8,
        textAlign: 'end',
      },
    });
    // 如果x轴label太密，可以通过设置tickCount进行调节
    if (tickCount) {
      that[`chart${canvasId}`].scale('category', {
        tickCount,
      });
    }
    // 根据chart类型的不同，进行不同的绘制
    switch (chartType) {
      case 'column':
        that[`chart${canvasId}`].interval().position('category*data').color('name').adjust({
          type: 'dodge',
          // marginRatio: 0.05, // 设置分组间柱子的间距
        });
        break;
      case 'cumulative':
        that[`chart${canvasId}`].interval().position('category*data').color('name').adjust({
        // stack：堆叠图；dodge：柱状图
          type: 'stack',
          // marginRatio: 0.05, // 设置分组间柱子的间距
        });
        break;
      case 'line':
        that[`chart${canvasId}`].line().position('category*data').color('name');
        break;
      case 'column-line':
        that[`chart${canvasId}`].axis('data2', {
          grid: null,
        });
        that[`chart${canvasId}`].interval().position('category*data1');
        that[`chart${canvasId}`].line().position('category*data2').color('#5ed470');
        that[`chart${canvasId}`].point().position('category*data2').style({
          stroke: '#5ed470',
          fill: '#fff',
          lineWidth: 2,
        });
        that[`chart${canvasId}`].legend({
          custom: true,
          items: [{
            name: series[0],
            marker: 'square',
            fill: '#1890FF',
            checked: true,
          }, {
            name: series2[0],
            marker: function marker(x, y, r, ctx) {
              ctx.lineWidth = 1;
              ctx.strokeStyle = ctx.fillStyle;
              ctx.moveTo(x - r - 3, y);
              ctx.lineTo(x + r + 3, y);
              ctx.stroke();
              ctx.arc(x, y, r, 0, Math.PI * 2, false);
              ctx.fill();
            },
            fill: '#5ed470',
            checked: true,
          }],
          nameStyle: {
            fontSize: 9,
          },
        });
        break;
      case 'pie':
        that[`chart${canvasId}`].coord('polar', {
          transposed: true,
          innerRadius: 0,
          radius: 0.95,
        });
        that[`chart${canvasId}`].interval().position('constant*data').color('name').adjust('stack')
        .style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round',
        });
        that[`chart${canvasId}`].axis(false);
        that[`chart${canvasId}`].legend({
          position: 'top',
          itemFormatter: function itemFormatter(val) {
            const target = data.find(item => item.name === val);
            return `${val} ${target.data}%`;
          },
          nameStyle: {
            fontSize: 9,
          },
        });
        break;
      default:
        that[`chart${canvasId}`].interval().position('category*data').color('name').adjust({
        // stack：堆叠图；dodge：柱状图
          type: 'dodge',
          // marginRatio: 0.05, // 设置分组间柱子的间距
        });
    }
    // 关闭tooltips
    that[`chart${canvasId}`].tooltip(false);
    // 进行绘制
    that[`chart${canvasId}`].render();
    // 输出实例
    return that[`chart${canvasId}`];
  },
});
