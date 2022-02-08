import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { Toast } from "antd-mobile";
import classNames from "classnames";

function Header(props) {
  const { chain } = props;
  const [display, setDisplay] = React.useState(false);
  const [address, setaddress] = React.useState("");
  const [useraddress, setuseraddress] = React.useState("");
  React.useEffect(() => {
    if (chain.address) {
      setuseraddress(chain.address);
      setDisplay(true);
    } else {
      setDisplay(false);
    }
  }, [chain.address]);
  React.useEffect(() => {
    if (chain.quiteAddress) {
      setaddress(chain.quiteAddress);
    } else {
      setaddress("");
    }
  }, [chain.quiteAddress]);
  function copy() {
    if (useraddress !== "") {
      var tag = document.createElement("input");
      tag.setAttribute("id", "cp_hgz_input");
      tag.value = useraddress;
      document.getElementsByTagName("body")[0].appendChild(tag);
      document.getElementById("cp_hgz_input").select();
      document.execCommand("copy");
      document.getElementById("cp_hgz_input").remove();
      Toast.success("复制成功");
    } else {
      Toast.fail("内容为空");
    }
  }
  function connect() {
    chain.login();
  }
  return (
    <div className={css.contain}>
      <div className={css.inner}>
        <div className={css.left}>
          <div className={css.title}>Airdrop Plans</div>
          <div className={css.info}>Pick up the MMR</div>
          <div className={css.describle}>
            <span className={css.address}>
              The current address：
              {address}
            </span>
            <div className={css.copy} onClick={copy}></div>
          </div>
          <div
            className={classNames(css.connect, display && css.none)}
            onClick={connect}
          >
            连接钱包
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("lang", "chain")(observer(Header));
