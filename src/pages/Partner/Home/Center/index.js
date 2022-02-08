import React from 'react'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'
// import Button from '../Pledge'
import { interception } from '@utils/common'

function Center(props) {
  const { chain, server } = props
  const { partner_all_product, partner_all_perf, partner_small_perf } = server
  React.useEffect(() => {
    if (chain.address) {
      server.queryPartnerData(chain.address)
    }
  }, [chain.address, server])
  return (
    <div className={css.get}>
      <div className={css.inner}>
        <div className={css.innerBox}>
          <div className={css.left}>
            <div className={css.leftT}>全网总产量:</div>
            {/* <div className={css.leftB}>本周期业绩</div> */}
          </div>
          <div className={css.innerNum}>
            {partner_all_product}
            <span className={css.unit}>WFIL</span>
          </div>
        </div>
        <div className={css.line}></div>
        <div className={css.innerBox}>
          <div className={css.left}>
            <div className={css.leftT}>全网总业绩:</div>
            {/* <div className={css.leftB}>本周期业绩</div> */}
          </div>
          <div className={css.innerNum}>
            {partner_all_perf}
            <span className={css.unit}></span>
          </div>
        </div>
        <div className={css.line}></div>
        {/* <Button jumpPledge={props.jumpPledge} /> */}
        <div className={css.innerBox}>
          <div className={css.left}>
            <div className={css.leftT}>我的小区业绩:</div>
            {/* <div className={css.leftB}>本周期业绩</div> */}
          </div>
          <div className={css.innerNum}>
            {partner_small_perf}
            <span className={css.unit}></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('chain', 'server')(observer(Center))
