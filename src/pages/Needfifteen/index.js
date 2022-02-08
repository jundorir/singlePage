import React, { Fragment, useEffect, useState } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { enable } from "@utils/web3utils_future";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import Modal from "@components/Modal/BuyModal";

function Apply(props) {
  const { chain } = props;
  const { USDTBalance, isSignUp } = chain;
  const [USDT_APPROVE_AMOUNT, setUSDTApprove] = React.useState(0);
  const [PC, setPC] = React.useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [formData, setFormData] = useState("");

  async function queryAllowanceAll() {
    const USDTAllowance = await chain.queryAllowanceAsync({
      type: "WhiteList",
      symbol: "USDT",
    });
    console.log("USDTAllowance", USDTAllowance);
    setUSDTApprove(USDTAllowance);
  }
  //重新进入页面不需要再次授权
  useEffect(() => {
    if (chain.address) {
      // chain.queryBindParent();
      chain.getBalanceAsync();
      chain.getUserId();
      queryAllowanceAll();
    }
  }, [chain.address]);
  // 授权MMR
  async function toApproveUSDT() {
    let symbol = "USDT";
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
  // 修改名称输入框
  function changeHandle(value) {
    setFormData(value);
  }
  return (
    <Fragment>
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
              <div className={css.title}>Description:</div>
              <div className={css.word}>
                1、Blind box subscription registration is required to pay 15
                USDT;
                <br />
                2、After successful subscription,in 2022-01-08 00:00:00&nbsp;
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
                    USDT_APPROVE_AMOUNT - 15 >= 0 && css.no
                  )}
                  onClick={() => {
                    if (USDT_APPROVE_AMOUNT - 15 < 0) {
                      toApproveUSDT();
                    }
                  }}
                >
                  approve
                </div>
                <div
                  className={classNames(
                    css.button,
                    (isSignUp - 0 > 0 ||
                      USDTBalance - 15 < 0 ||
                      USDT_APPROVE_AMOUNT - 15 < 0) &&
                      css.disabled
                  )}
                  onClick={() => {
                    if (
                      USDTBalance - 15 >= 0 &&
                      isSignUp - 0 <= 0 &&
                      USDT_APPROVE_AMOUNT - 15 >= 0
                    ) {
                      signup();
                    }
                  }}
                >
                  {isSignUp - 0 > 0 ? "applied" : "apply"}
                </div>
              </div>
              <div className={css.need}>
                need cost：
                <span className={css.needNum}>
                  15 USDT
                </span>
              </div>
              <div className={css.balance}>
                balance：{chain.USDTBalance} USDT
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {renderModal()} */}
    </Fragment>
  );
}

export default inject("chain")(observer(Apply));
