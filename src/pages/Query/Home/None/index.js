import React from "react";
import css from "./index.module.less";
import { inject, observer } from "mobx-react";
import { interception } from "@utils/common";
import classNames from "classnames";

function Center(props) {
  return (
    <div className={css.get}>
      <div className={css.inner}></div>
      <div className={css.word}>暂无数据</div>
    </div>
  );
}

export default inject("chain", "server")(observer(Center));
