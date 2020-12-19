import React, { useRef, useCallback, useEffect, useState } from "react";
import * as Tone from "tone";
import styled from "styled-components";

const match = /([a-zA-Z0-9-#]+)/g;
const Synth = () => {
  const loop = useRef<Tone.Sequence>(new Tone.Sequence());
  const src = useRef<Tone.MonoSynth>(new Tone.MonoSynth());
  const beat = useRef(0);

  const [pattern, setPattern] = useState(["c4", "c4", "c4", "c4"]);
  const [patternString, setPatternString] = useState("c4 c4 c4 c4");

  const onSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      console.log(patternString);
      const p = patternString
        .split(match)
        .map((p) => p.trim())
        .filter((p) => p.length)
        .map((p) => {
          if (["[", "]"].indexOf(p) > -1) {
            return p;
          }

          return `"${p}"`;
        })
        .join(",")
        .split("")
        .map((c, i, arr) => {
          if (c !== ",") {
            return c;
          }

          if (arr[i + 1] === "]") {
            return "";
          }

          if (arr[i - 1] === "[") {
            return "";
          }

          return c;
        })
        .join("");

      const pat = JSON.parse(`[${p}]`);
      console.log(pat);

      setPattern(pat);
    },
    [patternString]
  );

  const tick = useCallback((time, note) => {
    src.current.triggerAttackRelease(note, 0.1, time);
  }, []);

  useEffect(() => {
    src.current.toDestination();
    loop.current.callback = tick;
    loop.current.events = pattern;
    loop.current.start(0);

    return () => {
      loop.current.dispose();
    };
  }, [tick, pattern]);

  return (
    <Container>
      <p>Synth</p>
      <form onSubmit={onSubmit}>
        <input
          value={patternString}
          onChange={(evt) => setPatternString(evt.target.value)}
        />
      </form>
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid black;
`;
export default Synth;
