import { makeAutoObservable, runInAction } from "mobx";
import { computeWeiToSymbol, interception } from "@utils/common";

import {
  fetchPartnerData,
  fetchMMRSData,
  fetchMMRData,
  fetchAprData,
  fetchData,
} from "@common/api";
class Server {
  partner_wait = 0; //待领取收益
  partner_already = 0; //累计已领取
  partner_all_product = 0; //全网总产量
  partner_all_perf = 0; //全网总业绩
  partner_small_perf = 0; //我的小区业绩

  // MMRS页面
  MMRS_wait = "0.0000"; //待领取收益
  MMRS_already = "0.0000"; //累计已领取
  MMRS_all = "0.0000"; //昨日全网小区总和
  MMRS_myData_yd = "0.0000"; //昨日个人小区业绩
  MMRS_myData_today = "0.0000"; //今日个人小区业绩
  MMRS_myData_total = "0.0000"; // 累计个人小区业绩

  // 空投页面
  MMR_wait = "0.0000";
  fil_price = 0;
  mmr_price = 0;
  ratio = "100.00"; // 固定收益率
  ratio2 = "100.00"; // 质押挖矿综合收益率
  block_reward = 0; // 每个块的奖励
  earnings_mmr = 0; // 24小时综合收益mmr
  earnings_fil = 0; // 24小时综合收益fil
  block_reward_mmr = 0; //每块区块奖励mmr
  block_reward_fil = 0; //每块区块奖励fil
  ratio_mmr = 0; //固定收益率mmr
  ratio_fil = 0; //固定收益率fil
  tvl_director = 0;
  apr_director = 0;
  tvl_lp = 0;
  apr_lp = 0;
  tvl_computcomputational = 0;
  apr_computcomputational = 0;
  constructor() {
    makeAutoObservable(this);
  }
  async queryPartnerData(address) {
    try {
      const data = await fetchPartnerData(address);
      // console.log('data===>', data)
      runInAction(() => {
        this.partner_wait = data.partner_wait;
        this.partner_already = data.partner_already;
        this.partner_all_product = data.partner_all_product;
        this.partner_all_perf = data.partner_all_perf;
        this.partner_small_perf = data.partner_small_perf;
      });
    } catch {}
  }
  async queryMMRSData(address) {
    try {
      const data = await fetchMMRSData(address);
      console.log("data===>", data);
      runInAction(() => {
        if (data) {
          this.MMRS_wait = data.mmrs_dynamic;
          this.MMRS_already = data.mmrs_dynamic_already;
          this.MMRS_all = data.perf_yesterday_all;
          // this.MMRS_myData_yd = data.perf_yesterday;
          this.MMRS_myData_today = data.perf_today;
          this.MMRS_myData_total = data.perf_total;
        }
      });
    } catch {}
  }
  async queryMMRData(address) {
    try {
      const data = await fetchMMRData(address);
      runInAction(() => {
        if (data) {
          this.MMR_wait = data.mmrs;
        }
      });
    } catch {}
  }
  async queryData() {
    try {
      const data = await fetchData();
      runInAction(() => {
        this.is_transfer = data.is_transfer;
        this.fil_price = data.fil_price;
        this.block_reward = data.block_reward;
        this.mmr_price = data.mmr_price;
        this.block_reward_mmr = data.block_reward_mmr;
        this.block_reward_fil = data.block_reward_fil;
        this.ratio_mmr = (Math.floor(data.ratio_mmr * 10000) / 10000).toFixed(
          4
        );
        this.ratio_fil = (Math.floor(data.ratio_fil * 10000) / 10000).toFixed(
          4
        );
      });
    } catch {}
  }

  async queryAprData() {
    try {
      const data = await fetchAprData();
      runInAction(() => {
        this.tvl_director = interception(data.tvl_director || 0);
        this.apr_director = interception(data.apr_director || 0);
        this.tvl_lp = interception(data.tvl_lp || 0);
        this.apr_lp = interception(data.apr_lp || 0);
        this.tvl_computcomputational = interception(
          data.tvl_computcomputational || 0
        );
        this.apr_computcomputational = interception(
          data.apr_computcomputational || 0
        );
      });
    } catch {}
  }
}

export default new Server();
