import { createSlice } from "@reduxjs/toolkit";
import { useStore } from "react-redux";
import {store} from '../../app/store';


interface InitialState {
  [k:string]: any | null;
  meetJoiners:any[];
  showStream:boolean;

}
const INITIAL_STATE:InitialState = {
  meetJoiners: [],
  showStream: false,
  screenStream: null,
  leaveMeetDetails: null,
  mainStream: null,
};

const meetReducerSlice = createSlice({
  name: "meetSlice",
  initialState:INITIAL_STATE,
  reducers: {
    setMainStream: (state, action) => {
      // console.log(action,'setStream action')
      state.mainStream = action.payload;
    },
    closeStreams: (state, _action) => {
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
      // const currentUser = store.getState().user?.currentUser;
      // console.log(state,'state');
      console.log(action,'meetjoin action');
      

      const meetJoiners = {...state.meetJoiners};
      const joiner = { ...action.payload };

      // if(joiner._id !== currentUser._id){

      // }else{
      //   joiner.currentUser = true;
      // }

      // // @ts-ignore
      // // meetJoiners.push(joiner);
      state.meetJoiners = [...meetJoiners,joiner];
    },
    updateMeetingJoiners: (state, action) => {
      const newJoiners = [...action.payload];
      state.meetJoiners = [...newJoiners];
    },
  },
});

export const {
  setMainStream,
  closeStreams,
  setScreenStream,
  setLeaveMeetDetails,
  setShowStream,
  updateMeetingJoiners,
} = meetReducerSlice.actions;

export default meetReducerSlice.reducer;
