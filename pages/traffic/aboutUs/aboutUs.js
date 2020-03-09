
import Config from '../../../utils/Config';

Page({
  data: {
    aboutUsSrc: Config.policyUrl + Config.traffic.aboutUs.aboutUsSrc,
    systermConstruct: Config.policyUrl + Config.traffic.aboutUs.systermConstructionSrc,
    dataResources: Config.policyUrl + Config.traffic.aboutUs.dataResourcesSrc,
  },
  enterSystermPage() {
    wx.navigateTo({
      url: `${Config.traffic.aboutUs.systermConstruction.pageUrl}`,
    });
  },
})
;
