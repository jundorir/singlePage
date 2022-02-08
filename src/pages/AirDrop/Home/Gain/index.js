import React, { Fragment, useCallback } from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import GainWindow from "@components/GainWindow";
import { interception } from "@utils/common";
import { Toast } from "antd-mobile";
import { getMMRSReward } from "@utils/web3utils_future";
import { fetchMMRData } from "@common/api";
import loading from "@utils/loading";
import InfomationWindow from "@components/InfomationWindow"; //弹窗

function Gain(props) {
  const { chain, server } = props;
  const { MMR_wait } = server;
  const [gainDisplay, setGainDisplay] = React.useState("none");
  const [showInfomation, setShowInfomation] = React.useState(false);
  const [infomation, setInfomation] = React.useState("");
  React.useEffect(() => {
    if (chain.address) {
      server.queryMMRData(chain.address);
      server.queryAprData();
      server.queryData();
      chain.queryMMRPageInfo();
    }
  }, [chain.address]);
  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        server.queryMMRData(chain.address);
        server.queryAprData();
        server.queryData();
        chain.queryMMRPageInfo();
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  async function toGet() {
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
          Toast.info("successful");
          server.queryMMRData(chain.address);
        }
      } catch (error) {
        Toast.info("failed");
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
        // loading.show();
        const data = await fetchMMRData(chain.address);
        // loading.hidden();
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
                Toast.info("successful");
                server.queryMMRData(chain.address);
              }
            } catch (error) {
              Toast.info("failed");
            }
          }
        } else {
          Toast.info("No drop");
          return;
        }
      } catch (error) {
        loading.hidden();
        Toast.info("wrong network");
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
              <div className={css.one}>Available for collection</div>
              <div className={css.two}>
                <span className={css.number}>{MMR_wait}</span>
                <span>MMR</span>
              </div>
            </div>
            {/* <div className={css.topR}></div> */}
          </div>
          <div className={css.line}></div>
          <div
            className={css.bottom}
            onClick={() => {
              // handleGain();
              if (MMR_wait >= 0) {
                handleGain();
              } else {
                Toast.info("No profit");
              }
            }}
          >
            Receive
          </div>
        </div>
      </div>
      {renderModal()}
    </Fragment>
  );
}

export default inject("chain", "server")(observer(Gain));
