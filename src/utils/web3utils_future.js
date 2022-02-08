import { digitWei, computeSymbolToWei, computeWeiToSymbol } from "./common";
import loading from "@utils/loading";

import chain from "../store/chain";
import lang from "../store/lang";
import {
  assignToken as assignTokenAbi,
  netDB as netDBAbi,
  pledge as pledgeAbi,
  WfilErc20 as WfilErc20Abi,
  BaseERC20 as BaseERC20Abi,
  MMRERC20 as MMRAbi,
  Board as BoardAbi,
  WmiswapV1Router01 as WmiswapV1Router01Abi,
  WmiswapV1RouterRead as WmiswapV1RouterReadAbi,
  LpMintPool as LpMintPoolAbi,
  Shop as ShopAbi,
  minerToken as minerTokenAbi,
  subscribe as subscribeAbi,
  VerifySignatrue as VerifySignatrueAbi,
  SpecialMintPool as SpecialMintPoolAbi,
  verifyMmrsOrUsdt as verifyMmrsOrUsdtAbi,
  WhiteList as WhiteListAbi,
} from "../abi";
import { Toast } from "antd-mobile";

let web3_Provider = null;
if (typeof window.web3 !== "undefined") {
  web3_Provider = new window.Web3(window.web3.currentProvider);
  window.utils = web3_Provider.utils;
  window.web3_Provider = web3_Provider;
}

export async function getAccounts() {
  return window.ethereum?.request({ method: "eth_accounts" });
}

let Global_Contract = {};
let Contract = {
  AssignToken: "AssignToken",
  Pledge: "Pledge",
  BaseERC20: "BaseERC20",
  NetDB: "NetDB",
  MMR: "MMR",
  Board: "Board",
  WmiswapV1Router01: "WmiswapV1Router01",
  WmiswapV1RouterRead: "WmiswapV1RouterRead",
  LpMintPool: "LpMintPool",
  Shop: "Shop",
  TLpMintPool: "TLpMintPool",
  minerToken: "minerToken",
  subscribe: "subscribe",
  VerifySignatrue: "VerifySignatrue",
  Special: "Special",
  verifyMmrsOrUsdt: "verifyMmrsOrUsdt",
  WhiteList: "WhiteList",
};
let Abi = {
  AssignToken: assignTokenAbi,
  Pledge: pledgeAbi,
  BaseERC20: BaseERC20Abi,
  NetDB: netDBAbi,
  MMR: MMRAbi,
  Board: BoardAbi,
  WmiswapV1Router01: WmiswapV1Router01Abi,
  WmiswapV1RouterRead: WmiswapV1RouterReadAbi,
  LpMintPool: LpMintPoolAbi,
  TLpMintPool: LpMintPoolAbi,
  Shop: ShopAbi,
  minerToken: minerTokenAbi,
  subscribe: subscribeAbi,
  VerifySignatrue: VerifySignatrueAbi,
  Special: SpecialMintPoolAbi,
  WhiteList: WhiteListAbi,
  verifyMmrsOrUsdt:verifyMmrsOrUsdtAbi
};

function getNowUserAddress() {
  return chain.address;
}

export function enable() {
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum === "undefined") {
      console.log("MetaMask没有安装!");
      return;
    }
    if (typeof window.web3 === "undefined") {
      console.log("看起来你需要一个Dapp浏览器来启动。");
      return;
    }
    if (window.ethereum.enable) {
      window.ethereum
        .enable()
        .then((accounts) => {
          resolve(accounts[0]);
        })
        .catch(function (reason) {
          reject(reason.message);
        });
      return;
    } else {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          resolve(accounts[0]);
        })
        .catch(function (reason) {
          reject(reason.message);
        });
    }
  });
}

function getContract(contractName, contractAddress) {
  if (contractAddress === undefined) {
    Toast.info(lang.networkError);
    return null;
  }
  // console.log("web3_Provider", web3_Provider);
  if (web3_Provider === null) {
    if (typeof window.web3 !== "undefined") {
      web3_Provider = new window.Web3(window.web3.currentProvider);
      window.utils = web3_Provider.utils;
      window.web3_Provider = web3_Provider;
    }
  }
  if (web3_Provider === null) return null;
  if (
    [
      Contract.AssignToken,
      Contract.Pledge,
      Contract.BaseERC20,
      Contract.NetDB,
      Contract.MMR,
      Contract.Board,
      Contract.WmiswapV1Router01,
      Contract.WmiswapV1RouterRead,
      Contract.LpMintPool,
      Contract.Shop,
      Contract.IMinerToken,
      Contract.TLpMintPool,
      Contract.minerToken,
      Contract.subscribe,
      Contract.VerifySignatrue,
      Contract.Special,
      Contract.verifyMmrsOrUsdt,
      Contract.WhiteList,
    ].includes(contractName)
  ) {
    if (!Global_Contract[contractAddress])
      Global_Contract[contractAddress] = new web3_Provider.eth.Contract(
        Abi[contractName],
        contractAddress
      );
    return Global_Contract[contractAddress];
  }
  return null;
}

function sendAsync(params, needLog = false) {
  //   loading.show();
  return new Promise((resolve, reject) => {
    window.ethereum.sendAsync(
      {
        method: "eth_sendTransaction",
        params: params,
        from: getNowUserAddress(),
      },
      function (err, result) {
        // return;
        loading.show();
        if (!!err) {
          reject(err);
          loading.hidden();
          return;
        }
        let a = null;
        if (result.error) {
          reject(result.error.message);
          if (!!a) clearInterval(a);
          loading.hidden();
          return;
        }
        if (result.result) {
          a = setInterval(() => {
            web3_Provider.eth
              .getTransactionReceipt(result.result)
              .then((res) => {
                // console.log("getTransactionReceipt ==>", res);
                if (res) {
                  loading.hidden();
                  clearInterval(a);
                  if (!needLog) {
                    resolve(res.status); // res.status true or false;
                  } else {
                    resolve({
                      status: res.status,
                      logs: res.logs,
                    }); // res.status true or false;
                  }
                } else {
                }
              });
          }, 200);
        }
      }
    );
  });
}

/**
 * 获取绑定的父节点
 * @returns
 */
export async function getParent(query = null) {
  console.log("地址", Contract.NetDB, chain.contractAddress?.DBAddress);
  const contract = getContract(
    Contract.NetDB,
    chain.contractAddress?.DBAddress
  );
  return new Promise((resolve) => {
    contract?.methods
      ?.getParent(query ? query : getNowUserAddress())
      .call((err, result) => {
        if (err) {
          resolve(false);
        }
        if (result) {
          console.log("getParent ===> ", result);
          resolve(result);
        }
      });
  });
}

/**
 * 绑定的父节点
 * @returns
 */
export async function bindParentAsync(parentAddress) {
  const contract = getContract(
    Contract.NetDB,
    chain.contractAddress?.DBAddress
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.DBAddress,
      value: "0x0",
      data: contract?.methods
        ?.bindParent(getNowUserAddress(), parentAddress)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}

/**
 * 代币交易授权
 * @returns
 */
export function approve(TokenAddress, contractAddress) {
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  let params = [
    {
      from: getNowUserAddress(),
      to: TokenAddress,
      value: "0x0",
      data: contract?.methods
        ?.approve(
          contractAddress,
          web3_Provider.utils.toHex(
            web3_Provider.utils.toBN("1000000000000000000000000000000000")
          )
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params, true);
}

window.approveTest = approveTest;
export function approveTest(symbol, type) {
  const map = {
    verifyMmrsOrUsdt: chain.contractAddress?.verifyMmrs,
    WhiteList: chain.contractAddress?.WhiteList,
  };
  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  const contractAddress = map[type];
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  let params = [
    {
      from: getNowUserAddress(),
      to: TokenAddress,
      value: "0x0",
      data: contract?.methods
        ?.approve(
          contractAddress,
          web3_Provider.utils.toHex(
            web3_Provider.utils.toBN("1000000000000000000000000000000000")
          )
        )
        .encodeABI(),
    },
  ];
  return sendAsync(params, true);
}

/**
 * 是否允许调用钱包地址
 * @returns
 */
export function allowance(TokenAddress, contractAddress) {
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods
      ?.allowance(getNowUserAddress(), contractAddress)
      .call((err, result) => {
        if (err) {
          resolve(-1);
        }
        // console.log("allowance result ====> ", result);
        if (result < 10000000000000000000000000000000) {
          resolve(false);
        } else {
          resolve(result);
        }
      });
  });
}

window.queryAllowance = queryAllowance;
export async function queryAllowance({ type, symbol }) {
  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  console.log("TokenAddress--->", TokenAddress);
  const contractAddress = chain.contractAddress?.WhiteList;
  const contract = getContract(Contract.BaseERC20, TokenAddress);

  const result = await new Promise((resolve) => {
    contract?.methods
      ?.allowance(getNowUserAddress(), contractAddress)
      .call((err, result) => {
        if (err) {
          resolve(-1);
        }
        resolve(result);
      });
  });
  return result / Math.pow(10, 18);
}

/**
 * 授权合约允许代币交易流程
 * @param {*} type 1代表MediaAddress,2代表MarketAddress
 * @param {*} TokenAddress 默认为U地址,后续增加更多地址
 * @returns
 */
window.isApproveFlow = isApproveFlow;
export async function isApproveFlow({ type, symbol }) {
  const map = {
    WhiteList: chain.contractAddress?.WhiteList,
  };

  try {
    let isAllowance = await allowance(
      chain.contractAddress.currencyMap?.[symbol],
      map[type]
    );
    if (isAllowance) {
      return {
        status: true,
        approveAmount: isAllowance / Math.pow(10, 18),
      };
    }

    let { status, logs } = await approve(
      chain.contractAddress.currencyMap?.[symbol],
      map[type]
    );
    if (status) {
      return {
        status: status,
        approveAmount: logs[0].data / Math.pow(10, 18),
      };
    }
  } catch (e) {
    return {
      status: false,
      approveAmount: 0,
    };
  }
}

/**
 * 根据代币地址获取
 * @param {*} TokenAddress
 */
export async function getBalanceAsync(symbol = "AFIL") {
  // console.log("symbol", symbol);
  // loading.show();
  //USDTAddress
  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  console.log("TokenAddress", TokenAddress);
  const contract = getContract(Contract.BaseERC20, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?.balanceOf(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}

/**
 * Partner领取
 */
export async function getReward({ amount, id, timstamp, userAddress }) {
  const contract = getContract(
    Contract.VerifySignatrue,
    chain.contractAddress?.partneAddress
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.partneAddress,
      // to: userAddress,
      value: "0x0",
      data: contract.methods
        .reward("0x" + userAddress, "0x" + amount, id, timstamp)
        .encodeABI(),
    },
  ];

  return sendAsync(params);
}
/**
 *MMRS领取
 */
export async function getMMRSReward({
  amount,
  mmrsAmount,
  id,
  timstamp,
  userAddress,
}) {
  const contract = getContract(
    Contract.verifyMmrsOrUsdt,
    chain.contractAddress?.verifyMmrs
  );
  console.log("contract",contract);
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.verifyMmrs,
      // to: userAddress,
      value: "0x0",
      data: contract.methods
        .reward(userAddress, "0x" + amount, "0x" + mmrsAmount, id, timstamp)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
window.getMMRBalanceAsync = getMMRBalanceAsync;
export async function getMMRBalanceAsync(
  symbol = "MMR",
  address = chain.contractAddress?.assignTokenAddress
) {
  console.log("1111", chain.contractAddress?.assignTokenAddress);
  // console.log("TokenAddress", chain.contractAddress.currencyMap?.[symbol]);
  const TokenAddress = chain.contractAddress.currencyMap?.[symbol];
  const contract = getContract(Contract.MMR, TokenAddress);
  return new Promise((resolve) => {
    contract?.methods?.balanceOf(address).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(computeWeiToSymbol(result, 4));
      }
    });
  });
}
/**
 *报名
 */
window.signUpAbi = signUpAbi;
export async function signUpAbi() {
  const contract = getContract(
    Contract.WhiteList,
    chain.contractAddress?.WhiteList
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.WhiteList,
      value: "0x0",
      data: contract?.methods?.signUp().encodeABI(),
    },
  ];
  return sendAsync(params);
}
/**
 * 查询是否报名 getUserId
 */
export async function getUserIdAsync() {
  const contract = getContract(
    Contract.WhiteList,
    chain.contractAddress?.WhiteList
  );
  return new Promise((resolve) => {
    contract?.methods?.getUserId(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        console.log("是否报名查询", result);
        resolve(result);
      }
    });
  });
}

/**
 * 获取首页信息
 * @returns
 */
export async function getMMRPageInfo() {
  const contract = getContract(
    Contract.AssignToken,
    chain.contractAddress?.assignTokenAddress
  );
  return new Promise((resolve) => {
    contract?.methods?.mmrPageInfo(getNowUserAddress()).call((err, result) => {
      if (err) {
        resolve(false);
      }
      if (result) {
        resolve(result);
      }
    });
  });
}
/**
 *空投领取
 */
export async function getMMRReward({
  amount,
  mmrsAmount,
  id,
  timstamp,
  userAddress,
}) {
  const contract = getContract(
    Contract.verifyMmrsOrUsdt,
    chain.contractAddress?.verifyMmrs
  );
  let params = [
    {
      from: getNowUserAddress(),
      to: chain.contractAddress?.verifyMmrs,
      // to: userAddress,
      value: "0x0",
      data: contract.methods
        .reward(userAddress, "0x" + amount, "0x" + mmrsAmount, id, timstamp)
        .encodeABI(),
    },
  ];
  return sendAsync(params);
}
