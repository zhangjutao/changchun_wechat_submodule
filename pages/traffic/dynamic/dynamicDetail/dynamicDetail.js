Page({
  data: {
    currentUrl: '',
  },
  onLoad(options) {
    this.setData({
      currentUrl: options.url,
    });
  },
})
;
