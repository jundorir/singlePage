import React, { Fragment, useState } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { quiteAddress } from "@utils/common";
import { Toast } from "antd-mobile";
import { fetchBoxData } from "@common/api";
import None from "../None";

function Gain(props) {
  // 0x46753a87becdb39fa2ded99a463e1b06283279d2
  const [thisAddress, setthisAddress] = useState("");
  const [findAddress, setfindAddress] = useState("");
  const [data, setdata] = useState([]);
  async function toQuery() {
    setfindAddress(thisAddress);
    const result = await fetchBoxData(thisAddress);
    setdata(result);
  }
  function copy(useraddress) {
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
  async function find(address) {
    setfindAddress(address);
    setthisAddress(address);
    const result = await fetchBoxData(address);
    setdata(result);
  }
  function renderData() {
    if (data?.list) {
      return (
        <Fragment>
          <div className={css.center}>
            <div className={css.queryT}>
              <div className={css.query}>查询地址：</div>
              <div className={css.query}>{quiteAddress(findAddress)}</div>
            </div>
            <div className={css.queryB}>
              <div className={css.query}>伞下业绩：</div>
              <div className={css.query}>{data.pref}</div>
            </div>
          </div>
          <div className={css.title}>直推用户</div>
          {data.list?.length > 0 &&
            data.list?.map((item, index) => {
              return (
                <div className={css.bottom} key={index}>
                  <div className={css.title}>
                    <div className={css.query}>
                      {quiteAddress(item.user)}
                      <span
                        className={css.copy}
                        onClick={() => {
                          copy(item.user);
                        }}
                      ></span>
                    </div>
                    <div
                      className={css.queryBTN}
                      onClick={() => {
                        find(item.user);
                      }}
                    >
                      查询
                    </div>
                  </div>
                  <div className={css.line}>
                    <div className={css.query}>个人业绩：</div>
                    <div className={css.query}>{item.usdt_blind_box_perf}</div>
                  </div>
                  <div className={css.line}>
                    <div className={css.query}>伞下业绩：</div>
                    <div className={css.query}>
                      {item.usdt_blind_box_perf_team}
                    </div>
                  </div>
                </div>
              );
            })}
          <div className={css.title2}></div>
        </Fragment>
      );
    } else {
      return <None />;
    }
  }
  return (
    <Fragment>
      <div className={css.contain}>
        <div className={css.inner}>
          <div className={css.top}>
            <div className={css.topL}>
              <div className={css.one}>Address：</div>
              <div className={css.two}>
                <input
                  className={css.input}
                  placeholder="输入查询地址"
                  value={thisAddress}
                  onChange={(e) => {
                    setthisAddress(e.target.value.trim());
                  }}
                />
                <div
                  className={css.close}
                  onClick={() => {
                    setthisAddress("");
                  }}
                >
                  清空
                </div>
              </div>
            </div>
            {/* <div className={css.topR}></div> */}
          </div>
          <div className={css.line}></div>
          <div
            className={css.bottom}
            onClick={() => {
              toQuery();
            }}
          >
            查询
          </div>
        </div>
        {renderData()}
      </div>
      {/* {renderModal()} */}
    </Fragment>
  );
}

export default inject("chain", "server")(observer(Gain));
