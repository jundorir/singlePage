import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
// import Button from '../Pledge'
import { interception } from "@utils/common";

function Center(props) {
  const { chain, server } = props;
  const { MMRS_all, MMRS_myData_today, MMRS_myData_total } = server;
  // React.useEffect(() => {
  //   if (chain.address) {
  //     server.queryMMRSData(chain.address);
  //   }
  // }, [chain.address, server]);
  return (
    <div className={css.get}>
      <div className={css.inner}>
        <div className={css.innerBox}>
          <div className={css.left}>
            <div className={css.leftT}>昨日全网累计业绩:</div>
          </div>
          <div className={css.innerNum}>
            {MMRS_all}
            <span className={css.unit}> USDT</span>
          </div>
        </div>
        <div className={css.line}></div>
        {/* <div className={css.innerBox}>
          <div className={css.left}>
            <div className={css.leftT}>昨日个人小区业绩:</div>
          </div>
          <div className={css.innerNum}>
            {MMRS_myData_yd}
            <span className={css.unit}> USDT</span>
          </div>
        </div>
        <div className={css.line}></div> */}
        <div className={css.innerBox}>
          <div className={css.left}>
            <div className={css.leftT}>今日个人小区业绩:</div>
          </div>
          <div className={css.innerNum}>
            {MMRS_myData_today}
            <span className={css.unit}> USDT</span>
          </div>
        </div>
        <div className={css.line}></div>
        <div className={css.innerBox}>
          <div className={css.left}>
            <div className={css.leftT}>累计个人小区业绩:</div>
          </div>
          <div className={css.innerNum}>
            {MMRS_myData_total}
            <span className={css.unit}> USDT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("chain", "server")(observer(Center));
