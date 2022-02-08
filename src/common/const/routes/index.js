import Home from '@pages/Home'
// import Vip from "@pages/Vip";
import Community from '@pages/Community'
import Invitation from '@pages/Invitation'
import Notice from '@pages/Notice'
import Swap from '@pages/Swap'
import Mining from '@pages/Mining'
import MobilityMining from '@pages/MobilityMining'
import MobilityPool from '@pages/MobilityPool'
// import Shop from "@pages/Shop";
import DAO from '@pages/DAO'
import Pledge from '@pages/Mining/Pledge'
import Details from '@pages/Mining/Details'
import NoticeDetail from '@pages/Notice/Detail'
import BoardroomPledge from '@pages/DAO/Details'
// import Lottery from '@pages/Lottery'
import ForceMining from '@pages/ForceMining'

const routes = [
  {
    path: '/home',
    label: {
      English: 'home',
      TraditionalChinese: '首頁',
      SimplifiedChinese: '首页'
    },
    icon: 'home',
    component: <Home />
  },
  {
    path: '/mining',
    label: {
      English: 'WFILMining',
      TraditionalChinese: 'WFIL挖礦',
      SimplifiedChinese: 'WFIL挖矿'
    },
    icon: 'block',
    component: <Mining />
  },
  {
    path: '/forceMining',
    label: {
      English: 'calculateSubscription',
      TraditionalChinese: '算力認購',
      SimplifiedChinese: '算力认购'
    },
    icon: 'slwk',
    component: <ForceMining />
  },
  {
    path: '/mobilityMining',
    label: {
      English: 'mobilityMining',
      TraditionalChinese: '流動性挖礦',
      SimplifiedChinese: '流动性挖矿'
    },
    icon: 'loop',
    component: <MobilityMining />
  },
  {
    path: '/boardroom',
    label: {
      English: 'boardroom',
      TraditionalChinese: '董事會',
      SimplifiedChinese: '董事会'
    },
    icon: 'dao',
    component: <DAO />,
    space: true
  },

  {
    path: '/swap',
    label: {
      English: 'swap',
      TraditionalChinese: '兌換',
      SimplifiedChinese: '兑换'
    },
    icon: 'swap',
    component: <Swap />
  },
  {
    path: '/lottery',
    label: {
      English: 'lottery',
      TraditionalChinese: '彩票',
      SimplifiedChinese: '彩票'
    },
    icon: 'lottery',
    _target: true,
    // component: <Lottery />
  },
  {
    path: '/mobilityPool',
    label: {
      English: 'mobilityPool',
      TraditionalChinese: '流動性池',
      SimplifiedChinese: '流动性池'
    },
    icon: 'mobility',
    component: <MobilityPool />,
    space: true
  },

  // {
  //   path: "/shop",
  //   label: {
  //     English: "mall",
  //     TraditionalChinese: "算力商城",
  //     SimplifiedChinese: "算力商城",
  //   },
  //   icon: "calculator",
  //   component: <Shop />,
  // },

  // {
  //   path: "/vip",
  //   label: {
  //     English: "Be VIP",
  //     TraditionalChinese: "會員",
  //     SimplifiedChinese: "会员",
  //   },
  //   icon: "vip",
  //   component: <Vip />,
  // },
  {
    path: '/community',
    label: {
      English: 'community',
      TraditionalChinese: '我的社區',
      SimplifiedChinese: '我的社区'
    },
    icon: 'community',
    component: <Community />
  },
  {
    path: '/invitation',
    label: {
      English: 'invitation',
      TraditionalChinese: '邀請好友',
      SimplifiedChinese: '邀请好友'
    },
    icon: 'invitation',
    component: <Invitation />
  },
  {
    path: '/notice',
    label: {
      English: 'notice',
      TraditionalChinese: '公告',
      SimplifiedChinese: '公告'
    },
    icon: 'notice',
    component: <Notice />
  },
  {
    path: 'https://www.baidu.com',
    label: {
      English: 'audit report',
      TraditionalChinese: '審計報告',
      SimplifiedChinese: '审计报告'
    },
    icon: 'audit',
    _target: true
  },
  {
    path: 'https://api.mmr.finance.com',
    label: {
      English: 'whitePaper',
      TraditionalChinese: '白皮書',
      SimplifiedChinese: '白皮书'
    },
    icon: 'whitePaper',
    _target: true,
    _special_path: true
  }
]

export default routes

export const SecondaryRoutes = [
  {
    path: '/pledge',
    mapPath: '/pledge',
    label: {
      English: 'pledge',
      TraditionalChinese: '質押',
      SimplifiedChinese: '质押'
    },
    component: <Pledge />
  },
  {
    path: '/pledgeDetail/:address',
    mapPath: '/pledgeDetail/',
    label: {
      English: 'pledge record',
      TraditionalChinese: '質押記錄',
      SimplifiedChinese: '质押记录'
    },
    component: <Details />
  },
  {
    path: '/noticeDetail/:id',
    mapPath: '/noticeDetail/',
    label: {
      English: 'Notice Detail',
      TraditionalChinese: '詳情',
      SimplifiedChinese: '详情'
    },
    component: <NoticeDetail />
  },
  {
    path: '/boardroomPledge',
    mapPath: '/boardroomPledge',
    label: {
      English: 'boardroom_pledge',
      TraditionalChinese: '董事會_質押',
      SimplifiedChinese: '董事会_质押'
    },
    component: <BoardroomPledge />
  }
]
