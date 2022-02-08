import React, { useEffect } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { enable } from "@utils/web3utils_future";
import classNames from "classnames";
import { Toast } from "antd-mobile";
function Apply(props) {
  const { chain } = props;
  const { MMRBalance, USDTBalance, isSignUp } = chain;
  // const [USDT_APPROVE_AMOUNT, setMMRApprove] = React.useState(0);
  const [USDT_APPROVE_AMOUNT, setUSDTApprove] = React.useState(0);
  const [needU, setNeedU] = React.useState(20);
  const [PC, setPC] = React.useState(true);
  async function queryAllowanceAll() {
    const MMRAllowance = await chain.queryAllowanceAsync({
      type: "WhiteList",
      symbol: "USDT",
    });
    console.log("MMRAllowance", MMRAllowance);
    setUSDTApprove(MMRAllowance);
  }
  console.log("USDT_APPROVE_AMOUNT===>", USDT_APPROVE_AMOUNT);
  //重新进入页面不需要再次授权
  React.useEffect(() => {
    if (chain.address) {
      chain.getBalanceAsync();
      chain.getUserId();
      queryAllowanceAll();
    }
  }, [chain.address]);
  // 授权MMR
  async function toApproveMMR() {
    if (!chain.address) {
      Toast.info("Please link the wallet address first");
      return;
    }
    let symbol = "USDT";
    let { status, approveAmount } = await chain.toApprove({
      type: "WhiteList",
      symbol,
    });
    if (status) {
      Toast.success("success");
      queryAllowanceAll();
    } else {
      Toast.fail("faild");
    }
  }
  async function signup() {
    if (!chain.address) {
      Toast.info("Please link the wallet address first");
      return;
    }
    const result = await chain.signUp();
    if (result) {
      Toast.success("success");
      chain.getUserId();
      chain.getBalanceAsync();
    } else {
      Toast.fail("faild");
    }
  }
  useEffect(() => {
    let mobile = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    const current = mobile != null;
    setPC(!current);
  }, []);
  // 监听MMR余额
  useEffect(() => {
    if (MMRBalance >= 1) {
      setNeedU(15);
    } else {
      setNeedU(20);
    }
  }, [MMRBalance]);
  return (
    <div className={classNames(css.contain, PC && css.containPC)}>
      <div className={classNames(css.apply, PC && css.applyPC)}>
        <div className={css.top}>
          <div className={css.applyWord}></div>
          <div className={css.applyTitle}>Blind box subscribe</div>
        </div>
        <div className={css.applyBox}>
          <div className={css.hat}></div>
          <div className={css.header}>
            <div className={css.now}>current address</div>
            <div className={css.address}>
              {chain.address ? (
                chain.address
              ) : (
                <div
                  onClick={() => {
                    enable();
                  }}
                  className={css.link}
                >
                  link wallet
                  <div className={css.linkMask}></div>
                </div>
              )}
            </div>
            <div className={css.contentUp}></div>
          </div>
          <div className={css.content}>
            <div className={classNames(css.word, css.wordTitle)}>
              Description:
            </div>
            <div className={css.word}>
              1、Addresses with 1 or more MMR will pay 15USDT to participate in
              one entry blind box lottery;
              <br />
              2、Addresses with less than 1 MMR paying 20USDT can participate in
              an entry blind box lottery registration;
              <br />
              3、The event will take place on December 25, 2021.
              {/* <span>https://open.eocryptoken.com</span> to participate in the */}
              {/* blind box draw */}
            </div>
          </div>
          <div className={css.footer}>
            <div className={css.contentDown}></div>
            <div className={css.buttonBox}>
              <div
                className={classNames(
                  css.button,
                  css.buttonLeft,
                  USDT_APPROVE_AMOUNT - needU >= 0 && css.no
                )}
                onClick={() => {
                  if (USDT_APPROVE_AMOUNT - needU < 0) {
                    toApproveMMR();
                  }
                }}
              >
                <div className={css.approve}></div>
                approve
              </div>
              <div
                className={classNames(
                  css.button,
                  (isSignUp - 0 > 0 ||
                    USDTBalance - needU < 0 ||
                    USDT_APPROVE_AMOUNT - needU < 0) &&
                    css.disabled
                )}
                onClick={() => {
                  if (
                    USDTBalance - needU >= 0 &&
                    isSignUp - 0 <= 0 &&
                    USDT_APPROVE_AMOUNT - needU >= 0
                  ) {
                    signup();
                  }
                }}
              >
                <div className={css.apply}></div>
                {isSignUp - 0 > 0 ? "applied" : "apply"}
              </div>
            </div>
            <div className={css.need}>
              need cost：
              <span className={css.needNum}>{needU}&nbsp;&nbsp;USDT</span>
            </div>
            <div className={css.balance}>
              balance：{chain.USDTBalance}&nbsp;&nbsp;USDT
            </div>
          </div>
        </div>
      </div>
      <div
        className={classNames(css.christmasTop, PC && css.christmasTopPC)}
      ></div>
      <div
        className={classNames(css.christmasBottm, PC && css.christmasBottmPC)}
      ></div>
    </div>
  );
}

export default inject("chain")(observer(Apply));
