import { makeAutoObservable, runInAction, reaction } from "mobx";
import {
  getAccounts,
  getParent,
  bindParentAsync,
  isApproveFlow,
  enable,
  queryAllowance,
  getBalanceAsync,
  signUpAbi,
  getUserIdAsync,
  getMMRPageInfo,
} from "@utils/web3utils_future";
import { quiteAddress, computeWeiToSymbol } from "@utils/common";
import loading from "@utils/loading";
// import { curChainId } from "@common/const";
import { fetchContractAddress } from "@common/api";
// console.log("curChainId", curChainId);
const curChainId = "0x1b354"; //测试环境
// const curChainId = "0x5"; //测试环境
// const curChainId = "0x38"; //正式环境
class Chain {
  address = "";
  chainId = curChainId;
  initEnd = false;
  bindParnet = null;
  isApprove = false;
  isSignUp = "";
  sharer = "";
  MMRBalance = 0;
  USDTBalance = 0;
  totalDeposit = 0;
  contractAddress = {
    WhiteList: "0x64bAc65613f84C959dd95a513f812B3301ca86B3",//测试_1000MMR
    // WhiteList: "0x9ED202C9B3CD50E387d202eD7E5a207f3A3E40aD", //正式_国内_1000MMR
    // WhiteList: "0xd8bfc73318Aa773A35222884EDa4519C5Eeb6bA1", //测试_海外
    // WhiteList: "0x847C2262f489BF750FaB1EAab40aD1F864E1aF11", //正式_海外
    // WhiteList: "0x1BD4fa9E8283a0Af3a8748e4400EaEd639851064", //测试新的报名_25USDT
    // WhiteList: "0x1D2f3eae4611Fb9F9B424f39706706b15a48e479", //正式新的报名_25USDT
    assignTokenAddress: "0x99075Ad9E81D04899196d60B4B6AE0e727e6A1FF", //空投测试
    // assignTokenAddress: "0x6700049866Eb9A96D7D0502aCbC9d28Ec339A7d6", //空投正式
    verifyMmrs: "0xb5402f1Db0854adBD51e6aA918d5e7957D03ec16", //空投测试
    // verifyMmrs: "0x1F47C16F1394fDa3F3DCffe51Bdfce8feBf33e8d", //空投正式
    // WhiteList: "0xA3e58288815246Da84d70fAd1a7571c6a9FdF0E5", //测试需要55USDT
    // WhiteList: "0x8A087b0c5abFdB48C3466CF2566f7a3589DA5181", //正式需要55USDT
    // WhiteList: "0xc8518820101351a6352529034ea61f658Bd9495f", //测试需要15USDT
    // WhiteList: "0x71246DFDffE0333E314574E221F004A6b0E84a8f", //正式需要15USDT
    currencyMap: {
      MMR: "0x2B6e13Df0114D3AA3799BEE483c512BeBE1996d3", //测试
      // MMR: "0xD3c6e3a5e6268113C1CC92651165755333f15599", //正式
      USDT: "0x7dfFA370C1776f698DE0f03E6B910063EaeD92E0", //测试
      // USDT: "0x55d398326f99059ff775485246999027b3197955", //正式
    },
    DBAddress: "0xaF5D8bD4BA3c2bE4e6aeEcA1690936A199A8Dd63", //测试
    // DBAddress: "0x677E2a9E6Aa7ADfB2C7214DA5C9D3E8C809d5072", //正式
  };
  simpleUser = {};
  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.chainId,
      (current) => {
        if (current === undefined) {
          this.chainId = window.ethereum?.chainId;
        } else if (current !== curChainId) {
          loading.showNetWorkError();
        } else {
          loading.hidden();
        }
      }
    );
    this.init();
  }

  get isLogin() {
    return !!this.address;
  }

  get isCorrectChain() {
    return this.chainId === curChainId;
  }

  get isActive() {
    return (
      this.bindParnet !== null &&
      this.bindParnet !== "0x0000000000000000000000000000000000000000"
    );
  }

  setAddress(address) {
    this.address = address;
    if (address !== "") {
      localStorage.setItem("address", address);
      return;
    }
    localStorage.removeItem("address");
  }

  get quiteAddress() {
    if (!this.address) return "";
    return quiteAddress(this.address);
  }

  async init() {
    this.registerListener();
    this.chainId = window.ethereum?.chainId;

    // await this.queryContractAddress();

    const account = await this.getNowAccounts();

    this.initEnd = true;
  }

  async querySimpleUser() {
    let jsonString = localStorage.getItem("simple_user");
    if (jsonString !== null) {
      try {
        this.simpleUser = JSON.parse(jsonString);
      } catch {}
    } else {
      this.setSimpleUser({
        userSlippageTolerance: 0,
      });
    }
  }
  async setSimpleUser(simpleUser) {
    let jsonString = JSON.stringify(simpleUser);
    localStorage.setItem("simple_user", jsonString);
    this.simpleUser = simpleUser;
  }

  async requestChainData() {
    // console.log("chain refresh...");
    this.queryMMRPageInfo();
    this.getUnclaimed();
    this.getBalance();
    this.queryAmountReceived();
  }
  async getNowAccounts() {
    const accounts = await getAccounts();
    if (accounts?.length > 0) {
      this.setAddress(accounts[0]);
    }
    return accounts?.[0];
  }

  registerListener() {
    window.ethereum?.on("chainChanged", (newChainId) => {
      // console.log("chainChanged", newChainId);

      runInAction(() => {
        this.chainId = newChainId;
      });
    });

    window.ethereum?.on("accountsChanged", (accounts) => {
      let newAddress = "";
      if (accounts.length > 0) {
        newAddress = accounts[0];
      }
      this.setAddress(newAddress);
    });
    window.ethereum?.on("connect", (connectInfo) => {
      // console.log("connect", connectInfo);
      runInAction(() => {
        this.chainId = connectInfo.chainId;
      });
    });
  }

  login() {
    enable();
  }

  async queryBindParent() {
    let parent = localStorage.getItem(`${this.address}_bind_parent`);
    if (
      parent === null ||
      parent === "false" ||
      parent === "0x0000000000000000000000000000000000000000"
    ) {
      // console.log('111222233334444')
      parent = await getParent();
      if (parent === false) {
        return;
      }
      localStorage.setItem(`${this.address}_bind_parent`, parent);
    }

    runInAction(() => {
      this.bindParnet = parent;
    });
    // console.log("parent ==>", parent);
  }

  async bindParnetFunction(parentAddress) {
    // loading.show();
    // return;
    const bindResult = await bindParentAsync(parentAddress);

    if (bindResult) {
      localStorage.setItem(`${this.address}_bind_parent`, parentAddress);
    }
    return bindResult;

    // if (bindResult) {
    //   this.queryBindParent()
    // }
    // loading.hidden();
    // return bindResult;
  }
  //查询上级地址是否可绑定
  async queryParnetFunction(query) {
    const queryResult = await getParent(query);
    return queryResult;
  }

  async queryAllowanceAsync(symbol) {
    const allowance = await queryAllowance(symbol);
    return allowance;
  }
  async toApprove({ type, symbol, from = null }) {
    // console.log("chain.toApprove ===>", type, symbol);
    // loading.show();
    if (type === "Router1") {
    }

    const balace = await isApproveFlow({ type, symbol });
    if (balace && symbol === "WFIL" && from === "pledge") {
      runInAction(() => {
        this.isApprove = true;
        this.impowerAmount = balace.approveAmount;
      });
    }
    // loading.hidden();
    return balace;
  }

  async setSharer(sharer) {
    // console.log('sharer', sharer)
    this.sharer = sharer;
  }
  // 获取MMR余额、获取USDT余额
  async getBalanceAsync() {
    const MMRdata = await getBalanceAsync("MMR");
    const USDTdata = await getBalanceAsync("USDT");
    console.log("MMRdata_balance", MMRdata);
    console.log("USDTdat_balance", USDTdata);
    runInAction(() => {
      this.MMRBalance = MMRdata - 0;
      this.USDTBalance = USDTdata - 0;
    });
  }
  //报名
  async signUp() {
    const result = await signUpAbi();
    return result;
  }
  //是否授权
  async getUserId() {
    const result = await getUserIdAsync();
    console.log("是否授权--->", result);
    runInAction(() => {
      this.isSignUp = result;
    });
  }
  async queryMMRPageInfo() {
    const { totalDeposit } = await getMMRPageInfo();
    runInAction(() => {
      this.totalDeposit = computeWeiToSymbol(totalDeposit, 4);
    });
  }
  async queryContractAddress() {
    const list = await fetchContractAddress();

    runInAction(() => {
      let contractTempAddress = {};
      list.forEach((element) => {
        contractTempAddress[element.name] = element.address;
      });

      let currencyMap = {
        AFIL: contractTempAddress.AFILAddress,
        WFIL: contractTempAddress.WFILAddress,
        MMR: contractTempAddress.MmrAddress,
        USDT: contractTempAddress.UsdtAddress,
        Special_T: contractTempAddress.SpecialTAddress,
      };

      this.contractAddress = {
        ...contractTempAddress,
        // ShopAddress: '0x07ea6fabb326f0eBaaDE5Bb750775Bd2dE71dadf', //后面删除
        // TlppoolAddress: '0xb137f7C4f1D2a1367c4e256bc017CAa028076411', //后面删除
        currencyMap: currencyMap,
      };
      console.log("this.contractAddress", this.contractAddress);
    });
  }
}

export default new Chain();
