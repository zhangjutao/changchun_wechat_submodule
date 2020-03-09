import Config from '../../../../../utils/Config';

Page({
  data: {
    systermDetails: Config.traffic.aboutUs.systermConstruction.systermDetail.systermIntroduction,
    currentSysterm: 0,
    systermImgs: Config.traffic.aboutUs.systermConstruction.systermDetail.systermImgList,
    systermList: Config.traffic.aboutUs.systermConstruction.systermList,
  },
  onLoad(options) {
    const { systermId } = options;
    this.setData({
      currentSysterm: Number(systermId),
    });
  },
});
