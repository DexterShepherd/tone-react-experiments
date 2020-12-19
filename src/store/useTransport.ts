import create from "zustand";

const useTransport = create((set) => ({
  beat: 0,
  bar: 0
}));
