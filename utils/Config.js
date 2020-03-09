export default class Config {
}
// TODO:配置信息目前来看不太规整，后续可以采用页面、版块、类型的方式，对配置信息进行整理
/**
 * url 分为两类，一类是 wechat/，；另一类是 report/
 */
Config.common = {
  url: {
    // 用户登录、注册、token刷新部分的baseUrl
    user: 'http://traffic-decision-changchun.btismart.com/api/user-api',
    // 年报指标的baseUrl
    reportIndicator: 'http://traffic-decision-changchun.btismart.com/api/report-api',
    // 静态文件服务url
    staticFile: 'http://statics.btismart.com/changchun',
  },
};
// Config.url = 'http://192.168.8.128:9001/api/user-api';
Config.url = 'http://traffic-decision-changchun.btismart.com/api/user-api/';
// Config.url = 'https://znjtxxpt.whtpi.com/wechat/';
Config.fakeUrl = 'https://znjtxxpt.whtpi.com/';
Config.assetsUrl = 'https://znjtxxpt.whtpi.com/';
Config.policyUrl = 'https://znjtxxpt.whtpi.com/';
Config.callback = 'btrcwechatapp';

Config.app = {
  APPID: 'wx692b227bbde7b667',
  SECRET: 'a86190bc8892f6d52438992b8504c8c5',
  WXBizDataCrypt: '',
  pc: '',
  DEBUG: true,
};

Config.logIn = {
  url: {
    register: '/register/weixin',
    login: '/login/weixin',
    freshToken: '/login/access-token',
  },
  // 此处为分界线，此处之上为新配置，之后为旧配置
  // url: 'logIn/',
  urlWithPassword: 'logIn/password/',
  // 授权码位数
  passwordLength: 6,
  // 页面背景渐变
  background: 'background-image: linear-gradient(-180deg, #FA5538 0%, #FA3252 100%);',
  // 登录页面图片，本地图片
  logoImage: '../../images/logIn/logo.png',
  loadingImage: '../../images/logIn/load.png',
  sloganImage: '../../images/logIn/slogan.png',
  deleteImage: '../../images/logIn/delete.png',
  // logo 光环的三个圈圈大小
  circleOutterSize: 600,
  circleCenterSize: 460,
  circleInnerSize: 320,
  // logo 大小
  logoImageWidth: 144,
  logoImageHeight: 214,
  scaleRatio: 0.7,
  // slogan 图片大小
  sloganWidth: 328,
  sloganHeight: 200,
  // 输入点样式
  activeDotStyle: 'background-color:white;',
  activeKeyStyle: 'background-color:rgba(255,255,255,0.3);',
  normalDotStyle: '',
};

Config.analysis = {
  url: 'analysis/',
  // collectUrl: 'collect/',
  collectUrl: '/collect/indicator/name/',
  getCollectUrl: '/collect/indicator/mine',
  searchUrl: '/pages/search/search',
  // button.imageUrl 本地图片
  button: {
    imageUrl: [
      '../../images/analysis/button/city-development.png',
      '../../images/analysis/button/infrastructure.png',
      '../../images/analysis/button/demand.png',
      '../../images/analysis/button/traffic.png',
      '../../images/analysis/button/bus.png',
      '../../images/analysis/button/subway.png',
      '../../images/analysis/button/bicycle.png',
      '../../images/analysis/button/parking.png',
      '../../images/analysis/button/external.png',
      '../../images/analysis/button/other-index.png',
      '../../images/analysis/button/other-city.png',
      '../../images/analysis/button/my-collection-active@1x.png',
    ],
    buttonColors: [
      '#E2F4F3',
      '#FBEFE7',
      '#E1F4FD',
      '#F0ECF9',
    ],
  },
  icon: {
    imageUrl: '../../../images/analysis/icon/',
    arrowRight: '../../../images/analysis/icon/right_normal.png',
    arrowDown: '../../../images/analysis/icon/down_normal.png',
    arrowUp: '../../../images/analysis/icon/up_normal.png',
    itemIcon: '../../../images/analysis/icon/item_normal.png',
  },
  search: {
    url: 'search',
    searchImage: '../../images/analysis/search/search.png',
  },
  detailCharts: {
    url: 'send-collect',
    // 年报数据的 url
    reportDataUrl: `${Config.url}/indicator`,
    arrowDown: '../../../images/analysis/detailCharts/arrowDown.png',
    // TODO:对于指标部分的图片，数量较多，后续整理后都应放在服务器端
    indexIcon: '../../../images/analysis/detailCharts/frontIcon.png',
    backgroudUrl: '../../../images/analysis/detailCharts/background.png',
    navigatorCounts: {
      城市发展: 2,
      基础设施: 4,
      交通需求: 2,
      道路交通: 2,
      地面公交: 2,
      轨道交通: 2,
      慢行交通: 1,
      静态交通: 1,
      对外交通: 1,
      其他指标: 2,
      城市对比: 2,
      我的收藏: 1,
    },
  },
};

Config.search = {
  url: 'search/',
  sendUrl: 'search',
  newsPageUrl: '../news/newsDetail/newsDetail',
  icon: {
    search: '../../images/search/search.png',
    eye: {
      normal: '../../images/search/eye.png',
      notsee: '../../images/search/notsee.png',
    },
    delete: '../../images/search/delete.png',
    deleteButton: '../../images/search/delete_button.png',
  },
  searchSuggestion: {
    analysis: [
      // '武汉区地区生产总值增长图',
      // '武汉市现状公路指标变化图',
      // '近年来武汉市交通噪音变化图',
    ],
  },
};

Config.policy = {
  url: 'resource-file/',
  fileURL: 'file',
  webURL: 'web',
  searchUrl: '/pages/search/search',
  downloadUrl: 'static/doc/',
  // 文件种类对应的中英文
  categories: [
    {
      chinese: '交通动态',
      english: 'Realtime',
      imgSrc: '../../images/traffic/trafficDynamic/dynamic.jpg',
    },
    {
      chinese: '决策参考',
      english: 'Research report',
      imgSrc: '../../images/traffic/trafficDynamic/reference.jpg',
    },
    {
      chinese: '国内外对比',
      english: 'Comparison at home and abroad',
      imgSrc: '../../images/traffic/trafficDynamic/compare.jpg',
    },
    {
      chinese: '规范文件',
      english: 'Standard',
      imgSrc: '../../images/traffic/trafficDynamic/standard.jpg',
    },
    // {
    //   chinese: '关于我们',
    //   english: 'AboutUs',
    //   imgSrc: '../../images/traffic/trafficDynamic/aboutUs.jpg',
    // },
  ],
  pageUrl: '../policy/policyTable/policyTable',
  // pageUrl: 'policyTable/policyTable',
  policyTable: {
    // policyTable 页面默认的缩略图
    defaultThumbnail: {
      string: '../../../images/policy/policyTable/string.png',
      document: '../../../images/policy/policyTable/document.png',
    },
  },
  comingSrc: `${Config.assetsUrl}static/images/policy/coming.png`,
  // TODO:需要整理到配置中
  backgroudUrl: `${Config.assetsUrl}static/images/policy/background.png`,
  indexBackgroudUrl: `${Config.assetsUrl}static/images/policy/indexBackground.jpg`,
};

Config.news = {
  url: 'news/',
  searchUrl: '/pages/search/search',
  modeUrl: 'static/mode.json',
  titleList: [
    {
      text: '决策参考',
      category: 'construction',
      image: '../../images/news/construct.png',
    },
    {
      text: '地铁',
      category: 'subway',
      image: '../../images/news/subway.png',
    },
    {
      text: '新闻',
      category: 'news',
      image: '../../images/news/news.png',
    },
    {
      text: '规划',
      category: 'resources_plan',
      image: '../../images/news/plan.png',
    },
  ],
  dataUrl: 'data/',
  pageUrl: 'newsTable/newsTable',
  commentsUrl: 'newsComments/newsComments',
  icon: {
    comments: '../../images/news/icon/icon_message.png',
    collect: '../../images/news/icon/icon_star.png',
    arrowRight: '../../images/news/icon/button_arrow.png',
  },
  newsComments: {
    url: 'news-comments/',
  },
  newsTable: {
    url: 'news-list/',
    borderColor: {
      normal: '#C2C6DB',
      collect: '#FF0000',
    },
    userCollectUrl: 'users/',
    pageUrl: '../newsDetail/newsDetail',
    barStyle: {
      normal: 'color:#FF8F49;background:#FFFFFF',
      active: 'color:#FFFFFF;background:#FF8F49',
    },
    icon: {
      star: {
        normal: '../../../images/news/newsTable/icon/star_normal.png',
        active: '../../../images/news/newsTable/icon/star_active.png',
      },
    },
  },
  newsDetail: {
    url: 'news-detail/',
    sendUrl: 'send-comment/',
    sendUserUrl: 'send-collect/',
    splitString: '|and1234567890-=|',
    icon: {
      star: {
        normal: '../../../images/news/newsDetail/icon/star_normal.png',
        active: '../../../images/news/newsDetail/icon/star_active.png',
      },
      like: '../../../images/news/newsDetail/icon/like.png',
      comments: '../../../images/news/newsDetail/icon/comments.png',
      triangle: '../../../images/news/newsDetail/icon/triangle.png',
    },
    avatorImage: 'static/images/news/newsDetail/avator.png',
  },
};

Config.traffic = {
  // url: `${Config.url}/traffic/`,
  url: {
    indicatorSearch: '/statistic/query',
    idicatorCollect: '/collect/indicator/name',
  },
  trafficIndex: {
    url: 'trafficIndex/',
    // 拥堵等级所对应的颜色
    color: [
      'rgba(0,140,72,0.80)',
      'rgba(101,194,38,0.80)',
      'rgba(251,222,28,0.80)',
      'rgba(255,171,0,0.80)',
      'rgba(255,37,0,0.70)',
    ],
    // 指针图片，网络图片
    pointerImageSrc: '../../../images/traffic/trafficIndex/pointer.png',
    // 指示盘图片，网络图片
    chronoGraphSrc: 'static/images/traffic/trafficIndex/second_chronograph.png',
    trafficIndexBackUrl: 'static/images/traffic/trafficIndex/background.jpg',
    // trafficIndexBackUrl: '../../images/traffic/trafficIndex/background.jpg',
    indexIcons: [
      '../../images/traffic/trafficIndex/hankou.png',
      '../../images/traffic/trafficIndex/hanyang.png',
      '../../images/traffic/trafficIndex/wuchang.png',
    ],
  },
  button: {
    // imageUrl: 本地图片
    imageUrl: [
      '../../images/traffic/button/trafficIndex.png',
      '../../images/traffic/button/roadCondition.png',
      '../../images/traffic/button/tripIntensity.png',
      '../../images/traffic/button/frequentJam.png',
      '../../images/traffic/button/subwayFlow.png',
      '../../images/traffic/button/parkingOD.png',
      '../../images/traffic/button/crowd.png',
      '../../images/traffic/button/crossRiver.png',
    ],
    // colorNormal: '#7E7E7E',
    // colorActive: '#FF3C30',
    name: [
      '交通指数',
      '路况地图',
      '道路出行',
      '常发拥堵',
      '轨道客流',
      '停车来源',
      '人群聚集',
      '过江流量',
    ],
  },
  // 常发拥堵
  frequentJam: {
    // url：接口地址
    url: 'frequentJam/',
    // jamBoxImg: 本地图片
    frequentJamBackUrl: 'static/images/traffic/topJamBox/background.jpg',
    // frequentJamBackUrl: '../../images/traffic/topJamBox/background.jpg',
  },
  detailMap: {
    url: `${Config.url}`,
  },
  // 过江流量
  crossRiver: {
    url: 'crossRiver/',
    title: '过江流量',
    backgroudUrl: 'static/images/traffic/crossRiver/background.jpg',
    // backgroudUrl: '../../images/traffic/crossRiver/background.jpg',
    bridgeIconUrl: '../../images/traffic/crossRiver/bridge.png',
  },
  // pageUrl: 8个 button 所对应的跳转页面地址
  pageUrl: [
    'trafficIndex/trafficIndex',
    'detailMap/detailMap',
    'detailMap/detailMap',
    'detailMap/detailMap',
    'detailMap/detailMap',
    'detailMap/detailMap',
    'detailMap/detailMap',
    'detailMap/detailMap',
  ],
// ------------------------------------------------------------------------------------
  partyA: '长春市城乡规划设计研究院',
  aboutUs: {
    backgroudUrl: 'static/images/traffic/aboutUs/background.jpg',
    aboutUsSrc: 'static/images/traffic/aboutUs/aboutus.jpg',
    pageUrl: 'aboutUs/aboutUs',
    systermConstructionSrc: 'static/images/traffic/aboutUs/construction.jpg',
    dataResourcesSrc: 'static/images/traffic/aboutUs/resources.jpg',
    systermConstruction: {
      systermList: [
        { id: 0, name: '武汉市综合交通运行监测与展示系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/moniter.jpg` },
        { id: 1, name: '武汉市综合交通报表生成与展示系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/form-generator.jpg` },
        { id: 2, name: '武汉市路况分析评价系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/jam-evaluation.jpg` },
        { id: 3, name: '武汉市过江交通分析评价系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/cross-river.jpg` },
        { id: 4, name: '武汉市车流分析评价系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/car-flow.jpg` },
        { id: 5, name: '武汉市静态交通分析系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/static-traffic.jpg` },
        { id: 6, name: '武汉市轨道客流分析系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/trail-passenger-flow.jpg` },
        { id: 7, name: '武汉市常规公交分析系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/routine-bus.jpg` },
        { id: 8, name: '武汉市慢行交通分析系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/slow-traffic.jpg` },
        { id: 9, name: '武汉市职住分析评价系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/jobs-housing.jpg` },
        { id: 10, name: '武汉市交通调查分析系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/traffic-research.jpg` },
        { id: 11, name: '武汉市车辆排放分析系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/cars-discharge.jpg` },
        { id: 12, name: '武汉市社会车辆分析系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/social-vehicle.jpg` },
        { id: 13, name: '武汉市对外运输分析系统', src: `${Config.assetsUrl}static/images/traffic/aboutUs/systerm/external-transport.jpg` },
      ],
      pageUrl: 'systermList/systermList',
      systermDetail: {
        pageUrl: 'systermDetail/systermDetail',
        systermImgList: [
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/moniter.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/form-generator.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/jam-evaluation.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/cross-river.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/car-flow.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/static-traffic.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/trail-passenger-flow.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/routine-bus.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/slow-traffic.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/jobs-housing.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/traffic-research.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/cars-discharge.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/social-vehicle.jpg`,
          `${Config.assetsUrl}static/images/traffic/aboutUs/systermImg/external-transport.jpg`,
        ],
        systermIntroduction: [
          `综合交通运行监测与展示系统整合各专项分析子系统，以城市基础交通数据为基础，统计包括职住情况、交通调查、车流分析、路况分析、
          公共交通、轨道交通、静态交通、过江交通、慢行交通、排放分析、社会车辆分析、对外交通等多方面内容，实现城市交通的综合运行监测，
          并以周、月、季、年为周期，对城市综合交通信息进行定期收集与汇总。综合交通运行监测与展示系统主要包括城市发展、动态演变、交通实况、
          日分析、月分析、全息监测等功能模块。`,
          `综合交通报表生成与展示系统，以武汉市交通年报数据为基础，提供基本的查询、展示（统计图、数据表）和数据导出功能。
          接入由综合交通运行监测与展示系统整合的各专项分析子系统分析结果，以周报、月报、季报和年报的形式实现对城市综合交通信息的收集和展示。
          并以“请求-应答”模式完成综合交通报表的推送。综合交通报表生成与展示系统主要包括城市发展、基础设施、车辆/道路、公共交通、对外交通、
          管理/环境查询展示等功能模块。`,
          `路况分析评价系统通过浮动车GPS数据、社会车辆GPS数据、公交车GPS数据、电子警察和卡口系统输出数据等多源数据的融合计算和互验，
          从实时交通状况和历史趋势多方面综合分析道路交通运行情况，从拥堵强度、发生频率、拥堵持续时间、空间范围等特征出发，
          量化反映路网整体拥堵程度的指标（运行速度、运行时间、拥堵水平等），全方位评估城市路网运行情况，易于理解，简洁实用，
          便于社会公众了解交通运行整体状态，也为政府决策者提供了科学的度量指标。系统长期积累的路网运行历史数据，
          是掌握城市发展空间布局和交通运行演变趋势的重要数据依托，为城市制定行业政策、规划和交通建设项目量化分析评估提供重要的决策支持手段，
          从而避免盲目投资，提高资金投入的使用效率。路况分析评价系统主要包括交通实况、全路网及区域评价、重要道路评价、统计分析和数据质量等功能模块。`,
          `过江交通分析系统，基于公交、浮动车和七桥一隧ETC流量的实时数据，对过江的车流、客流和变化趋势进行多角度相结合的综合分析与可视化，
          并通过输出与接口模块将统计分析与可视化结果接入外部系统。主要内容包括：过江概述、过江车流分析、过江客流分析、过江趋势分析和数据质量监控等功能模块。`,
          `车流分析评价系统以武汉市主城区道路网的机动车流为对象，整合出租GPS数据、公交GPS数据、互联网公司等多车种GPS数据、各年交通流量调查数据、
          2016-2017交管卡口等断面流量监测历史数据，进行流量数据的互相验证、校核和融合，建立集成的武汉市实时道路流量系统，实现道路流量的实时监测、
          统计分析和查询展示。车流分析评价系统主要包括机动车发展、机动车流量、机动车OD分布、机动车出行特征、系统监控等功能模块。`,
          `静态交通分析系统以城市动态停车资源变化数据为基础，与不同的研究区域（如行政区、组团、环路）相结合，通过分析车辆停放位置、停放时间、
          室内外和路侧停车资源的动态变化规律，研究城市停车的动态演化规律。最终实现城市停车动态分析、评价与展示，从个体停车行为、停车特征等方面出发，
          对城市停车资源、停车现状进行描述、统计规律展示和动态展示。静态交通分析系统主要包括停车需求和停车资源两大功能模块。`,
          `轨道客流分析系统通过对轨道交通电子收费信息、站点客流量信息、轨道交通建设现状等数据的整合与分析，对城市轨道交通的客流情况、服务水平等进行综合分析与评价。
          轨道客流分析系统主要包括轨道满载率、轨道客流指标等功能模块。`,
          `常规公交分析系统通过对公共交通电子收费数据、公共交通卫星定位数据、出租汽车计价数据和卫星定位数据等数据的整合与分析，实现公交线网、
          公交客流特征、以及公交的运行状态、服务水平等多角度的综合分析，为公共交通的规划、管理与决策提供支持。常规公交分析系统主要包括公共交通线网、
          公共交通客流、道路交通状态、公交运行水平、专题应用分析等功能模块。`,
          `慢行分析系统以交通设施基础数据、摩拜骑行轨迹和骑行OD数据为基础，与不同的研究区域（如行政区、组团、街道）相结合，与不同的交通方式（如公交、轨道）相结合，
          对慢行交通系统的基本特征、时空分布、与轨道接驳特征进行多角度的综合分析与评价。慢行系统分析系统主要包括基础设施、骑行特征、
          骑行分布、区域分析、接驳分析等功能模块。`,
          `职住分析系统以城市居民的出行活动（尤其是通勤活动）为对象，以手机信令数据为基础，对人口的分布情况，以及出行特征进行综合分析，
          挖掘城市居民的居住、通勤、进出城市等出行活动规律，并进一步研究城市的职住分布特征，为城市规划提供重要依据，同时为城市交通仿真模型建设、
          面向城市居民的交通需求管理、信息服务等提供支持。职住分析系统主要包括人口分布、出行特征、重点区域、数值质量等功能模块。`,
          `交通调查分析系统以机动车拥有量、主城区道路交通流量的空间分布数据为基础，与不同的研究年份以及时间段相结合，
          与不同的城区（主要是武汉三镇）的路段和路口调查数据相结合，对机动车的拥有量、空间分布的道路流量和路口流量进行多角度的综合分析。
          交通调查分析系统主要包括流量调查、空间分布和数据上传等功能模块。`,
          `车辆排放分析系统通过接入测试车排放数据和固定检测器监测数据，对多种污染物（包括NOx、CO、HC、PM、CO2）在不同区域（包括全市域、环路、行政区）
          的排放情况，进行不同时间尺度（包括15分钟、1小时、全天）上的实时监测，辅助管理部门识别与管理。一方面，对污染物排放的时空分布特征进行统计分析，
          以及可视化展现；另一方面，将污染物的排放情况与汽车油耗、交通指数、空气质量等指标相结合，进行关联分析，从多个角度对车辆排放情况进行整体性分析
          和排放规律研究。通过机动车排放分析系统，积累武汉市机动车排放数据，以支撑交通政策制定和行业引导发展。车辆排放分析系统主要包括实时排放、
          区域排放、排放与指数、排放与空气质量、时间分析，以及空间分析等多个功能模块。`,
          `社会车辆分析系统以社会车辆的行程数据为基础，与不同的研究区域（如行政区、组团、环路）相结合，通过对社会小汽车行驶轨迹的匹配分析，
          挖掘其出行行为特征和驾驶偏好，进而分析社会车辆的出行行为、路径选择行为、机动车使用强度等，计算在网车辆数、路网速度等交通运行指标，
          为交通管理与规划、路况分析和评价等提供数据支撑和重要参考。社会车辆分析系统主要包括出行统计（出行强度、出行距离、出行时耗、出行速度）
          和数据质量两大功能模块。`,
          `对外运输分析系统提供了2011-2016年间，武汉市在公路、铁路、水路以及航空等多种运输方式上的客货运输量、客货周转量历史统计结果数据，
          数据主要来源于武汉市交委、统计局。以城市对外交通静态供给和动态运行变化数据为基础，通过分析公、铁、水、空等对外交通设施分布和运营等变化，
          研究城市对外交通运行的特征和规律，最终实现城市对外交通静态分析、动态研究、评价与展示，从对外交通基础设施布设、交通运输特征等方面出发，
          对城市对外交通资源和运行情况进行分析和展示。对外运输分析系统提供了相关的查询统计功能，可以根据指标类型、统计年份对公路、铁路、水路、
          航空等运输数据进行查询，采用统计图表进行展示，并支持数据的导出。`,
        ],
      },
    },
  },
  indicatorList: {
    imageFilePath: 'static/images/traffic/indicatorList/',
    images: [
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/city-development/economy.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/city-development/employment.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/city-development/land-use.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/city-development/public-service.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/city-development/year-books.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/infrastructure/road.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/infrastructure/slow.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/infrastructure/bus.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/infrastructure/trail.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/infrastructure/taxi.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/infrastructure/parking.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/traffic-demand/vehicles.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/traffic-demand/travel-features.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/road-traffic/flow.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/road-traffic/speed-index.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/bus/comprehensive.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/bus/passenger-flow.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/trail/comprehensive.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/trail/passenger-flow.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/slow/ride.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/static-traffic/parking-index.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/external-transport/comprehensive.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/external-transport/road.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/external-transport/water-transport.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/external-transport/trail.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/external-transport/airport.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/others/safe.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/others/conservation.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/others/taxi.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/city-compare/beijing.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/city-compare/guangzhou.jpg`,
        `${Config.assetsUrl}static/images/traffic/indicatorList/city-compare/shanghai.jpg`,
      ],
      [
        `${Config.assetsUrl}static/images/traffic/indicatorList/save/save.jpg`,
      ],
    ],
  },
  logo: '../../images/traffic/logo/logo.png',
};

// 指标版块

Config.indicator = {
  url: {
    indicatorSearch: '/statistic/query',
    indicatorCollect: '/collect/indicator/name',
  },
};

Config.trailPassengerFlow = {
  imgUrl: {
    trailIcon: '/images/trailPassengerFlow/trail-icon.png',
    backgroundUrl: '/images/trailPassengerFlow/background.png',
  },
};
