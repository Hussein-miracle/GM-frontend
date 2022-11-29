import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meetJoiners: [],
  showStream: false,
  screenStream: null,
  leaveMeetDetails: null,
  mainStream: null,
};

const meetReducerSlice = createSlice({
  name: "meetSlice",
  initialState,
  reducers: {
    setMainStream: (state, action) => {
      // console.log(action,'setStream action')
      state.mainStream = action.payload;
    },
    closeStreams: (state, action) => {
      const streams = state.mainStream;
      // @ts-ignore
      streams?.getAudioTracks()[0]?.stop();
      // @ts-ignore
      streams?.getVideoTracks()[0]?.stop();

      state.mainStream = streams;
    },
    setScreenStream: (state, action) => {
      state.screenStream = action.payload;
    },
    setShowStream: (state, action) => {
      state.showStream = action.payload;
    },
    setLeaveMeetDetails: (state, action) => {
      state.leaveMeetDetails = action.payload;
    },
    addMeetJoiner: (state, action) => {
      const meetJoiners = [...state.meetJoiners];
      const joiner = { ...action.payload };
      // @ts-ignore
      meetJoiners.push(joiner);
      state.meetJoiners = [...meetJoiners];
    },
  },
});

export const {
  setMainStream,
  closeStreams,
  setScreenStream,
  setLeaveMeetDetails,
  setShowStream,
} = meetReducerSlice.actions;

export default meetReducerSlice.reducer;
