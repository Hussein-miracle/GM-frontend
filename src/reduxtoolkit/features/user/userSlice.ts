import { createSlice } from "@reduxjs/toolkit";
import DUMMY_JOINERS from "../../../utils/meeters";

const INITIAL_STATE = {
  currentUser: { name: "" },
  // currentUser:{...DUMMY_JOINERS[0]},
  meetJoiners: {},
  mainStream: null,
  askName: !false,
  screenStream: null,
  leaveMeetDetails:null,
};

// INITIAL_STATE.meetJoiners

// const rest = DUMMY_JOINERS.slice(1);

// rest.forEach((item,index) => {
//   // console.log(item,index);
//   (INITIAL_STATE.meetJoiners as any)[item.id] = item;
// })

const userReducerSlice = createSlice({
  name: "userSlice",
  initialState: INITIAL_STATE,
  reducers: {
    setMainStream: (state, action) => {
      // console.log(action,'setStream action')
      state.mainStream = action.payload;
    },
    setCurrentUser: (state, action) => {
      const payload = action.payload;
      const user = { ...state.currentUser, ...payload };
      // console.log(user, "user");
      state.currentUser = user;
    },
    setUserName: (state, action) => {
      const user = { ...state.currentUser, name: action.payload };
      state.currentUser = user;
    },
    addMeetJoiner: (state, action) => {
      state.meetJoiners = { ...state.meetJoiners, ...action.payload };
    },
    getName: (state, action) => {
      state.askName = action.payload;
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
    }
    
  },
});

export const { setMainStream, setUserName, setCurrentUser, getName,    closeStreams,setScreenStream,setLeaveMeetDetails } =
  userReducerSlice.actions;

// export {setMainStream};

export default userReducerSlice.reducer;
