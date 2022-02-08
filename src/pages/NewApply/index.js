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
      chain.queryBindParent();
      chain.getBalanceAsync();
      chain.getUserId();
      queryAllowanceAll();
    }
  }, [chain.address]);
  // 判断是否绑定邀请人
  useEffect(() => {
    console.log("邀请人---》", chain.bindParnet === null);
    if (
      (chain.bindParnet === "0x0000000000000000000000000000000000000000" ||
        chain.bindParnet === null) &&
      chain.address
    ) {
      setShowInvite(true);
    } else {
      setShowInvite(false);
    }
  }, [chain.address, chain.bindParnet]);
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
  // 绑定邀请人
  async function query() {
    let content = formData.trim();
    try {
      const queryResult = await chain.queryParnetFunction(content);
      if (queryResult === "0x0000000000000000000000000000000000000000") {
        Toast.fail(`Address wrong`);
      } else {
        try {
          const result = await chain.bindParnetFunction(content);
          if (result) {
            // closeWindow();
            chain.queryBindParent();
            Toast.success("success");
          }
        } catch (error) {
          Toast.fail("failed");
          // loading.hidden();
        }
      }
    } catch (error) {
      Toast.fail("Address wrong");
      // loading.hidden();
    }
  }
  function renderModal() {
    if (showInvite) {
      return (
        <Modal
          // impower={"取消"}
          noInpower={true}
          size={"middle"}
          title={"Binding inviter"}
          confirmText={"Binding"}
          content={
            <div className={css.name}>
              <input
                placeholder="Please enter the inviter's address"
                autoComplete="off"
                name="name"
                onChange={(e) => {
                  changeHandle(e.target.value);
                }}
                value={formData}
                type="text"
              />
            </div>
          }
          onInpower={() => {
            // setShowInvite(false);
          }}
          onConfirm={() => {
            query();
          }}
          closeModal={() => {
            // console.log(12344);
          }}
        />
      );
    }
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
                1、Blind box subscription registration is required to pay 25
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
                    USDT_APPROVE_AMOUNT - 25 >= 0 && css.no
                  )}
                  onClick={() => {
                    if (USDT_APPROVE_AMOUNT - 25 < 0) {
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
                      USDTBalance - 25 < 0 ||
                      USDT_APPROVE_AMOUNT - 25 < 0) &&
                      css.disabled
                  )}
                  onClick={() => {
                    if (
                      USDTBalance - 25 >= 0 &&
                      isSignUp - 0 <= 0 &&
                      USDT_APPROVE_AMOUNT - 25 >= 0
                    ) {
                      signup();
                    }
                  }}
                >
                  {isSignUp - 0 > 0 ? "applied" : "apply"}
                </div>
              </div>
              <div className={css.need}>
                need cost：<span className={css.needNum}>25 USDT</span>
              </div>
              <div className={css.balance}>
                balance：{chain.USDTBalance} USDT
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderModal()}
    </Fragment>
  );
}

export default inject("chain")(observer(Apply));
