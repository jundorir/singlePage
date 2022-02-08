import React, { Fragment, useCallback } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import GainWindow from "@components/GainWindow";
import { interception } from "@utils/common";
import { Toast } from "antd-mobile";
import { getMMRSReward } from "@utils/web3utils_future";
import { fetchMMRSGet } from "@common/api";
import loading from "@utils/loading";
import InfomationWindow from "@components/InfomationWindow"; //弹窗

function Gain(props) {
  const { chain, server } = props;
  const { MMRS_wait, MMRS_already } = server;
  const [gainDisplay, setGainDisplay] = React.useState("none");
  const [showInfomation, setShowInfomation] = React.useState(false);
  const [infomation, setInfomation] = React.useState("");
  React.useEffect(() => {
    if (chain.address) {
      server.queryMMRSData(chain.address);
    }
  }, [chain.address]);
  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        server.queryMMRSData(chain.address);
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  async function toGet() {
    console.log(infomation);
    if (infomation) {
      try {
        const data = await getMMRSReward({
          amount: infomation.usdtHex,
          mmrsAmount: infomation.mmrsHex,
          id: infomation.idx,
          timstamp: infomation.sign,
          userAddress: infomation.userAddress,
        });
        if (data) {
          Toast.info("领取成功");
          server.queryMMRSData(chain.address);
        }
      } catch (error) {
        Toast.info("交易取消");
      }
    }
  }
  function renderModal() {
    if (showInfomation === true) {
      return (
        <div>
          <InfomationWindow
            data={infomation.repeatTis}
            closeShowInfomation={() => {
              setShowInfomation(false);
            }}
            toGet={() => {
              setShowInfomation(false);
              toGet();
            }}
          />
        </div>
      );
    }
  }
  const handleGain = React.useCallback(async () => {
    if (chain.address) {
      try {
        loading.show();
        const data = await fetchMMRSGet(chain.address);
        loading.hidden();
        console.log("data--->", data);
        if (data) {
          const { mmrsHex, usdtHex, idx, sign, userAddress, isRepeat } = data;
          if (isRepeat - 0 === 1) {
            setShowInfomation(true);
            setInfomation(data);
          } else {
            try {
              const data = await getMMRSReward({
                amount: usdtHex,
                mmrsAmount: mmrsHex,
                id: idx,
                timstamp: sign,
                userAddress,
              });
              if (data) {
                Toast.info("领取成功");
                server.queryMMRSData(chain.address);
              }
            } catch (error) {
              Toast.info("交易取消");
            }
          }
        }
      } catch (error) {
        loading.hidden();
        Toast.info("网络异常");
      }
    }
  }, [chain.address]);
  const closeGainWindow = useCallback(() => {
    setGainDisplay("none");
  }, []);
  return (
    <Fragment>
      <div style={{ display: gainDisplay }}>
        <GainWindow closeGainWindow={closeGainWindow} />
      </div>
      <div className={css.contain}>
        <div className={css.inner}>
          <div className={css.top}>
            <div className={css.topL}>
              <div className={css.one}>待领取收益</div>
              <div className={css.two}>
                <span className={css.number}>{MMRS_wait}</span>
                <span>MMRS</span>
              </div>
            </div>
            <div className={css.topR}></div>
          </div>
          <div className={css.line}></div>
          <div className={css.bottom}>
            <div className={css.bottomLT}>
              累计已领取：
              {MMRS_already} MMRS
            </div>
            <div
              className={css.bottomR}
              onClick={() => {
                // handleGain();
                if (MMRS_wait > 0) {
                  handleGain();
                } else {
                  Toast.info("暂无收益");
                }
              }}
            >
              领取
            </div>
          </div>
        </div>
      </div>
      {renderModal()}
    </Fragment>
  );
}

export default inject("chain", "server")(observer(Gain));
