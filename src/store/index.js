import langStore from "./lang";
import chainStore from "./chain";
import viewStore from "./view";
import serverStore from "./server";
const Store = {
  lang: langStore,
  chain: chainStore,
  view: viewStore,
  server: serverStore,
};

export default Store;
