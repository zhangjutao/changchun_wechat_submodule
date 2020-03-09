// policyDetail.js
// import Config from '../../../utils/Config';
import util from '../../../utils/util';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileData: {},
    // userInfo: {
    //   id: app.globalData.userId,
    //   userId: app.globalData.userId,
    // },
    // 直接展示的文件内容，包含文字和网络图片
    filesContent: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 返回新闻内容修改格式
    // 先把图片分离出来
    const filesContentData = app.globalData.stringTypeFileData;
    const textAndImage = filesContentData.content
      .split('|and1234567890-=|')
      .filter(e => e !== '');

    textAndImage.forEach((e) => {
      if (util.isHttpImage(e)) {
        this.data.filesContent.push({
          type: 'image',
          content: e,
        });
      } else {
          let newContent = e.replace(/ +g/, '\n'); //eslint-disable-line
          newContent = newContent.replace(/　+g/, '\n'); //eslint-disable-line
        const subString = newContent.split('\n');
        subString.forEach((s) => {
          this.data.filesContent.push({
            type: 'text',
            content: s,
          });
        });
      }
    });
    this.setData({
      fileData: filesContentData,
      filesContent: this.data.filesContent,
    });
  },
});
