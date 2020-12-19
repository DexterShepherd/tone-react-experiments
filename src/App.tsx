import * as React from "react";
import "./styles.css";
import Transport from "./components/Transport";
import Drum from "./components/Drum";

export default function App() {
  return (
    <div className="App">
      <Transport />
      <Drum sample="/kick.wav" />
      <Drum sample="/clap.wav" />
      <Drum sample="/hat-short.wav" />
      <Drum sample="/hat-long.wav" />
    </div>
  );
}
