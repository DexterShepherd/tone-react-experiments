import React, {
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import * as Tone from "tone";
import { motion as m, animate, useMotionValue } from "framer-motion";
import styled from "styled-components";
import er from "euclidean-rhythms";
import rotateArray from "rotate-array";

const useEuclidean = (beats: number, length: number, rotate: number) => {
  return useMemo(() => rotateArray(er.getPattern(beats, length), rotate * -1), [
    beats,
    length,
    rotate
  ]);
};

interface DrumProps {
  sample: string;
}

const Drum: React.FC<DrumProps> = ({ sample }) => {
  const loop = useRef<Tone.Loop>(new Tone.Loop());
  const src = useRef<Tone.Player>(new Tone.Player(sample));

  const [beatsForm, setBeatsForm] = useState(0);
  const [lengthForm, setLengthForm] = useState(4);
  const [rotateForm, setRotateForm] = useState(0);
  const [beats, setBeats] = useState(beatsForm);
  const [length, setLength] = useState(lengthForm);
  const [rotate, setRotate] = useState(0);
  const pattern = useEuclidean(beats, length, rotate);
  const [drag, setDrag] = useState(0);

  const onSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      setBeats(beatsForm);
      setLength(lengthForm);
      setRotate(rotateForm);
    },
    [beatsForm, lengthForm, rotateForm]
  );

  const tick = useCallback(
    (time: number) => {
      const [_, beats, sixteenths] = Tone.Transport.position.split(":");
      const pos = Math.floor(parseInt(beats) * 4 + parseFloat(sixteenths));

      if (pattern[pos % pattern.length]) {
        src.current.start(time + drag * 0.001);
      }
    },
    [pattern, drag]
  );

  useEffect(() => {
    src.current.toDestination();
    loop.current.callback = tick;
    loop.current.interval = "16n";
    loop.current.start(0);

    return () => {
      loop.current.dispose();
    };
  }, [tick]);

  return (
    <Container>
      <p>Drum</p>
      <p>{sample}</p>
      <form onSubmit={onSubmit}>
        <input
          type="number"
          value={beatsForm}
          onChange={(evt) => setBeatsForm(parseInt(evt.target.value))}
        />
        <input
          type="number"
          value={lengthForm}
          onChange={(evt) => setLengthForm(parseInt(evt.target.value))}
        />
        <input
          type="number"
          value={rotateForm}
          onChange={(evt) => setRotateForm(parseInt(evt.target.value))}
        />
        <input
          type="number"
          value={drag}
          onChange={(evt) => setDrag(parseInt(evt.target.value))}
        />

        <button type="submit" style={{ display: "none" }} />
      </form>
      {pattern.map((cell, i) => (
        <Indicator key={i} active={cell} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  input {
    width: 32px;
  }

  * {
    margin: 8px;
  }
`;

const Indicator = styled(m.div)`
  width: 8px;
  height: 8px;
  border-radius: 100%;
  border: 1px solid black;

  ${(props) =>
    props.active &&
    `
      background: black;

`}
`;
export default Drum;
