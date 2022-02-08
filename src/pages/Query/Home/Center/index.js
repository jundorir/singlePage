import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { interception } from "@utils/common";
import classNames from "classnames";

function Center(props) {
  const { chain, server } = props;
  const WFIL_TVL =
    interception(
      Math.floor(server.fil_price * chain.totalDeposit * 10000) / 10000,
      4
    ) || 0;
  let LP_TVL = 0;
  if (!!server.is_transfer) {
    LP_TVL = server.tvl_lp;
  }
  let DAO_TVL = server.tvl_director;

  let TOTAL_TVL = WFIL_TVL * 1 + LP_TVL * 1 + DAO_TVL * 1;
  TOTAL_TVL = TOTAL_TVL.toFixed(4);
  return (
    <div className={css.get}>
      <div className={css.inner}>
        <div className={css.innerBox}>
          <div className={css.left}>
            <div className={classNames(css.leftT, css.title)}>MMR Info:</div>
          </div>
        </div>
        <div className={css.line}></div>
        <div className={css.innerBox}>
          <div className={css.left}>
            <div className={css.leftT}>MMR TVL:</div>
          </div>
          <div className={css.innerNum}>
            <span className={css.unit}>$</span>
            {TOTAL_TVL}
          </div>
        </div>
        <div className={css.line}></div>
        <div className={css.innerBox}>
          <div className={css.left}>
            <div className={css.leftT}>MMR Price:</div>
          </div>
          <div className={css.innerNum}>
            <span className={css.unit}>$</span>
            {server.mmr_price}
          </div>
        </div>
        <div className={css.button}>
          <a href="https://dapp.mmr.finance/#/home" className={css.goto}>
            Go to Dapp
          </a>
        </div>
      </div>
    </div>
  );
}

export default inject("chain", "server")(observer(Center));
