Page({
  data: {
    dataList: [
      {
        title: '专题报告————《武汉市综合交通体系规划（2017-2035年）》要点',
        data: '2019-05-10',
        url: 'https://mp.weixin.qq.com/s/2_1Hehbt_Sum7I9QsDp7-g',
      },
      {
        title: '交通研判',
        data: '2019-05-10',
        url: 'https://mp.weixin.qq.com/s/1b79Y4LWVoW0lcmUv4YiNw',
      },
      {
        title: '它山之石—伦敦公交可达性分析方法及应用',
        data: '2019-05-17',
        url: 'https://mp.weixin.qq.com/s/QwgecD5lecoIi3HIMYcNJA',
      },
    ],
    images: {
      icon: '../../../../images/policy/policyTable/string.png',
    },
  },
  enterPage(e) {
    const index = Number(e.currentTarget.id);
    wx.navigateTo({
      url: `../dynamicDetail/dynamicDetail?url=${this.data.dataList[index].url}`,
    });
  },
})
;
