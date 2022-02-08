import { BaseERC20 } from "./BaseERC20";
import { assignToken } from "./assignToken";
import { netDB } from "./netDB";
import { pledge } from "./pledge";
import { WfilErc20 } from "./WfilErc20";
import { MMRERC20 } from "./MMRERC20";

import { Board } from "./Board";
import { WmiswapV1Router01 } from "./WmiswapV1Router01";
import { WmiswapV1RouterRead } from "./WmiswapV1RouterRead";
import { LpMintPool } from "./LpMintPool";
import { Shop } from "./Shop";
import { minerToken } from "./minerToken";
import { subscribe } from "./subscribe";
import { VerifySignatrue } from "./VerifySignatrue";
import { SpecialMintPool } from "./SpecialMintPool";
import { verifyMmrsOrUsdt } from "./verifyMmrsOrUsdt";
import { WhiteList } from "./WhiteList";

const abi = {
  assignToken,
  netDB,
  pledge,
  WfilErc20,
  BaseERC20,
  MMRERC20,
  Board,
  WmiswapV1Router01,
  WmiswapV1RouterRead,
  LpMintPool,
  Shop,
  minerToken,
  subscribe,
  VerifySignatrue,
  SpecialMintPool,
  verifyMmrsOrUsdt,
  WhiteList,
};
export {
  assignToken,
  netDB,
  pledge,
  WfilErc20,
  BaseERC20,
  MMRERC20,
  Board,
  WmiswapV1Router01,
  WmiswapV1RouterRead,
  LpMintPool,
  Shop,
  minerToken,
  subscribe,
  VerifySignatrue,
  SpecialMintPool,
  verifyMmrsOrUsdt,
  WhiteList,
};
export default abi;
