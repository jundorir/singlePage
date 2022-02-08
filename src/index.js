import React from "react";
import ReactDOM from "react-dom";
import "./assets/common/normalize.css";
// import Router from './router'
import { Provider } from "mobx-react";
import store from "./store";
import { Toast } from "antd-mobile";
import Partner from "@pages/Partner";
import MMRS from "@pages/MMRS";
import Apply from "@pages/Apply"; //1000MMR
import ApplyOverseas from "@pages/ApplyOverseas";
import NewApply from "@pages/NewApply"; //25USDT
import AirDrop from "@pages/AirDrop";
import Query from "@pages/Query";
import BlindBox from "@pages/BlindBox";
import ACE from "@pages/ACE"; //55USDT
import Needfifteen from "@pages/Needfifteen"; //15USDT
Toast.config({ duration: 1, mask: false });

ReactDOM.render(
  <Provider {...store}>
    <Apply />
  </Provider>,
  document.getElementById("root")
);
