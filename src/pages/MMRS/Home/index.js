import React, { Fragment } from "react";
import Header from "./Header";
import Gain from "./Gain";
import Center from "./Center";
// import Pledge from './Pledge'

function Home(props) {
  return (
    <Fragment>
      <Header />
      <Gain />
      <Center jumpPledge={props.jumpPledge} />
    </Fragment>
  );
}

export default Home;
