import Config from '../../../../utils/Config';

Page({
  data: {
    systermList: Config.traffic.aboutUs.systermConstruction.systermList,
  },
  enterDetailPage(event) {
    console.log('event----------------', event);
    const {id} = event.currentTarget;
    wx.navigateTo({
      url: `${Config.traffic.aboutUs.systermConstruction.systermDetail.pageUrl}?systermId=${id}`,
    });
  },
})
;
