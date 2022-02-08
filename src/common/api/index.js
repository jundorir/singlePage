import ajax from "@common/ajax";

const API = {
  getContractAddress: "/index/getContractAddress",
  getReceive: "/index/receivePartner",
  getPartnerData: "/index/partnerData",
  getMMRSData: "/mmrs/dynamicData",
  getReceiveMMRS: "/mmrs/receiveAwardMmrsDynamic",
  getMMRData: "/airdrop/receiveAward",
  getData: "/index/getData",
  getAprData: "/index/aprData",
  getBoxData: "/blindbox/getData",
};

export async function fetchContractAddress(env = 1) {
  const api = API.getContractAddress;
  return ajax.get(api, { params: { env } }).then((res) => {
    return res.data;
  });
}

export async function fetchGet(address) {
  const api = API.getReceive;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    console.log("res", res);
    return res.data;
  });
}
export async function fetchPartnerData(address) {
  const api = API.getPartnerData;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    return res.data;
  });
}
export async function fetchMMRSData(address) {
  const api = API.getMMRSData;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    return res.data;
  });
}
export async function fetchMMRSGet(address) {
  const api = API.getReceiveMMRS;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    console.log("res", res);
    return res.data;
  });
}
export async function fetchMMRData(address) {
  const api = API.getMMRData;
  return ajax.get(api, { params: { user: address } }).then((res) => {
    return res.data;
  });
}
export async function fetchData() {
  const api = API.getData;
  return ajax.get(api).then((res) => {
    return res.data;
  });
}
export async function fetchAprData() {
  const api = API.getAprData;
  return ajax.get(api).then((res) => {
    return res.data;
  });
}
export async function fetchBoxData(address) {
  const api = API.getBoxData;
  return ajax
    .get(api, { params: { user: address, page: 1, pagesize: 10000 } })
    .then((res) => {
      return res.data;
    });
}
