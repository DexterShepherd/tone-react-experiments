import React, { useState } from "react";
import * as Tone from "tone";

const Transport = React.memo(() => {
  const [playing, setPlaying] = useState(false);

  const start = async () => {
    if (playing) {
      return;
    }
    await Tone.start();
    Tone.Transport.bpm.value = 122;
    Tone.Transport.start();
    setPlaying(true);
    console.log("started");
  };

  const stop = () => {
    if (!playing) {
      return;
    }
    Tone.Transport.stop();
    setPlaying(false);
  };

  return (
    <div>
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
      <p>{playing ? "Playing" : "Stopped"}</p>
    </div>
  );
});

export default Transport;
