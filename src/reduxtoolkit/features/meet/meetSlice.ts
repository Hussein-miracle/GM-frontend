import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  meetJoiners: {},
  screenStream: null,
  leaveMeetDetails:null,
  mainStream: null,
}


const meetReducerSlice = createSlice({
  name:'meetSlice',
  initialState,
  reducers:{
    setMainStream: (state, action) => {
      // console.log(action,'setStream action')
      state.mainStream = action.payload;
    },
    closeStreams: (state,action) => {
      const streams = state.mainStream;
      // @ts-ignore
      streams?.getAudioTracks()[0]?.stop();
      // @ts-ignore
      streams?.getVideoTracks()[0]?.stop();

      state.mainStream = streams;
    },
    setScreenStream: (state,action) => {
      state.screenStream = action.payload;
    },
    setLeaveMeetDetails: (state,action) => {
      state.leaveMeetDetails = action.payload;
    },
    addMeetJoiner: (state, action) => {
      state.meetJoiners = { ...state.meetJoiners, ...action.payload };
    },
  },

})


export const { setMainStream,closeStreams,setScreenStream,setLeaveMeetDetails } = meetReducerSlice.actions;

export default meetReducerSlice.reducer;