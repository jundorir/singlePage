import React, { Fragment, useEffect, useState } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { enable } from "@utils/web3utils_future";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import Modal from "@components/Modal/BuyModal";
import Icon from "@common/const/define/Icon";

function Apply(props) {
  const { chain } = props;
  const { USDTBalance, isSignUp } = chain;
  const [USDT_APPROVE_AMOUNT, setUSDTApprove] = React.useState(0);
  const [PC, setPC] = React.useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [formData, setFormData] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (
      chain.bindParnet === "0x0000000000000000000000000000000000000000" &&
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
            // query();
          }}
          closeModal={() => {
            // console.log(12344);
          }}
        />
      );
    }
  }
  const data = [
    {name:"GuildToken",id:0},
    {name:"GuildToken",id:1},
    {name:"GuildToken",id:2},
    {name:"GuildToken",id:7},
    {name:"GuildToken",id:10},
    {name:"GuildToken",id:3},
    {name:"GuildToken",id:6},
    {name:"GuildToken",id:5},
    {name:"GuildToken",id:4},
  ];
  function renderIcon() {
    return data.map((item) => {
      return (
        <div className={classNames(css.boxItem)} key={item.id}>
          <div
            className={classNames(
              css.boxItemImg,
              item.id === currentIndex && css.frame
            )}
          >
            <img src={Icon[item.name]?.images} />
          </div>
          <div className={css.boxItemT1}>{Icon[item.name]?.title}</div>
          <div className={css.boxItemT2}>0.1%</div>
        </div>
      );
    });
  }
  const intervalRef = React.useRef(null);
  const [open, setOpen] = useState(false);
  function todraw() {
    setOpen(true);
  }
  useEffect(() => {
    if (!open) return null;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(currentIndex + 1);
    }, 100);
    if(currentIndex===8){
      setCurrentIndex(0)
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [currentIndex, open]);
  return (
    <Fragment>
      <div className={css.contain}>
        <div className={classNames(css.apply, PC && css.applyPC)}>
          {/* <div className={css.top}>
            <div className={css.applyWord}></div>
            <div className={css.applyTitle}>Blind box subscribe</div>
          </div> */}
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
              <div className={css.box}>{renderIcon()}</div>
            </div>
            <div className={css.footer}>
              <div className={css.contentDown}></div>
              <div className={css.buttonBox}>
                <div
                  className={classNames(css.button, css.buttonLeft)}
                  // onClick={() => {
                  //   if (USDT_APPROVE_AMOUNT - 25 < 0) {
                  //     toApproveUSDT();
                  //   }
                  // }}
                >
                  查看概率
                </div>
                <div
                  className={classNames(css.button)}
                  onClick={() => {
                    todraw();
                  }}
                >
                  抽奖
                </div>
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
