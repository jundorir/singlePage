import React, { Fragment, useCallback } from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
import GainWindow from '@components/GainWindow'
import { interception } from '@utils/common'
import { Toast } from 'antd-mobile'
import { getReward } from '@utils/web3utils_future'
import { fetchGet } from '@common/api'
import loading from '@utils/loading'

function Gain(props) {
  const { chain, server } = props
  const { partner_wait, partner_already } = server
  const [gainDisplay, setGainDisplay] = React.useState('none')

  React.useEffect(() => {
    let interval = setInterval(() => {
      if (chain.address) {
        server.queryPartnerData(chain.address)
      }
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleGain = React.useCallback(async () => {
    if (chain.address) {
      try {
        loading.show()
        const data = await fetchGet(chain.address)
        loading.hidden()
        console.log('data--->', data)
        if (data) {
          const { partner_hex, idx, sign, userAddress } = data
          try {
            const data = await getReward({
              amount: partner_hex,
              id: idx,
              timstamp: sign,
              userAddress
            })
            if (data) {
              Toast.info('领取成功')
              server.queryPartnerData(chain.address)
            }
          } catch (error) {
            Toast.info('交易取消')
          }
        }
      } catch (error) {
        loading.hidden()
        Toast.info('领取失败')
      }
    }
  }, [chain.address])
  const closeGainWindow = useCallback(() => {
    setGainDisplay('none')
  }, [])
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
                <span className={css.number}>{partner_wait}</span>
                <span>WFIL</span>
              </div>
            </div>
            <div className={css.topR}></div>
          </div>
          <div className={css.line}></div>
          <div className={css.bottom}>
            <div className={css.bottomLT}>
              累计已领取：
              {partner_already} WFIL
            </div>
            <div
              className={css.bottomR}
              onClick={() => {
                // handleGain()
                if (partner_wait > 0) {
                  handleGain()
                } else {
                  Toast.info('暂无收益')
                }
              }}
            >
              领取
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default inject('chain', 'server')(observer(Gain))
