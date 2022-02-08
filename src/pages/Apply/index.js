import React, { useEffect } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { enable } from "@utils/web3utils_future";
import classNames from "classnames";
import { Toast } from "antd-mobile";
function Apply(props) {
  const { chain } = props;
  const { MMRBalance, isSignUp } = chain;
  const [MMR_APPROVE_AMOUNT, setMMRApprove] = React.useState(0);
  const [PC, setPC] = React.useState(true);
  async function queryAllowanceAll() {
    const MMRAllowance = await chain.queryAllowanceAsync({
      type: "WhiteList",
      symbol: "MMR",
    });
    console.log("MMRAllowance", MMRAllowance);
    setMMRApprove(MMRAllowance);
  }
  console.log("MMR_APPROVE_AMOUNT===>", MMR_APPROVE_AMOUNT);
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
    let symbol = "MMR";
    let { status, approveAmount } = await chain.toApprove({
      type: "WhiteList",
      symbol,
    });
    if (status) {
      Toast.success("success");
      queryAllowanceAll();
    }
  }
  async function signup() {
    const result = await chain.signUp();
    if (result) {
      Toast.success("success");
      chain.getUserId();
      chain.getBalanceAsync();
    }
  }
  useEffect(() => {
    let mobile = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    const current = mobile != null;
    setPC(!current);
  }, []);
  return (
    <div className={css.contain}>
      <div className={classNames(css.apply, PC && css.applyPC)}>
        <div className={css.top}>
          <div className={css.applyWord}></div>
          <div className={css.applyTitle}>Blind box subscribe</div>
        </div>
        <div className={css.applyBox}>
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
                >
                  link wallet
                </div>
              )}
            </div>
            <div className={css.contentUp}></div>
          </div>
          <div className={css.content}>
            <div className={css.word}>Description:</div>
            <div className={css.word}>
              1、Blind box subscription registration is required to pay 1000
              MMR;
              <br />
              2、After successful subscription, in 2022-01-08 00:00:00{" "}
              <span>https://open.eocryptoken.com</span> to participate in the
              blind box draw
            </div>
          </div>
          <div className={css.footer}>
            <div className={css.contentDown}></div>
            <div className={css.buttonBox}>
              <div
                className={classNames(
                  css.button,
                  css.buttonLeft,
                  MMR_APPROVE_AMOUNT - 1000 >= 0 && css.no
                )}
                onClick={() => {
                  if (MMR_APPROVE_AMOUNT - 1000 < 0) {
                    toApproveMMR();
                  }
                }}
              >
                approve
              </div>
              <div
                className={classNames(
                  css.button,
                  (isSignUp - 0 > 0 ||
                    MMRBalance - 1000 < 0 ||
                    MMR_APPROVE_AMOUNT - 1000 < 0) &&
                    css.disabled
                )}
                onClick={() => {
                  if (
                    MMRBalance - 1000 >= 0 &&
                    isSignUp - 0 <= 0 &&
                    MMR_APPROVE_AMOUNT - 1000 >= 0
                  ) {
                    signup();
                  }
                }}
              >
                {isSignUp - 0 > 0 ? "applied" : "apply"}
              </div>
            </div>
            <div className={css.need}>
              need cost：<span className={css.needNum}>1000 MMR</span>
            </div>
            <div className={css.balance}>balance:{chain.MMRBalance} MMR</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("chain")(observer(Apply));
