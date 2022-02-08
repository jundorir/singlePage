import React from 'react'
import Home from './Home'
import css from './index.module.less'
import { inject, observer } from 'mobx-react'

function Partner() {
  return (
    <div className={css.contain}>
      <Home />
    </div>
  )
}

export default inject('chain')(observer(Partner))
