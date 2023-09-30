import { createSlice } from "@reduxjs/toolkit";
import { socket } from '../../../App';
// import DUMMY_JOINERS from "../../../utils/meeters";
import { DEFAULT_SETTINGS } from "../../../utils/constants";

const INITIAL_STATE = {
  currentUser: {
    name: "", 
    _id: null,
    settings: { ...DEFAULT_SETTINGS }
  },
  askName: true,
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
    setCurrentUser: (state, action) => {
      const payload = action.payload;
      const user = { ...state.currentUser, ...payload };
      // console.log(user, "user");
      state.currentUser = user;
    },
    setUserName: (state, action) => {
      console.log({ name:action.payload });

      const user = { ...state.currentUser, name: action.payload };
      console.log({user});
      
      state.currentUser = user;
    },
    getName: (state, action:{payload:boolean}) => {
      state.askName = action.payload;
    },
    updateCurrentUserSettings: (state, action) => {
      const payload = action.payload;
      console.log(payload, 'paylod settings');
      const currentUser = state.currentUser;
      const settings = { ...currentUser.settings, ...payload };
      // @ts-ignore
      console.log(settings, 'new settingsPayload');
      const updatedCurrentUser = {
        ...currentUser,
        settings,
      };
      console.log(updatedCurrentUser, 'updated current user')
      state.currentUser = updatedCurrentUser;

      const userId = currentUser._id;

      if (!!userId) {
        socket?.emit('update-settings', { userId, settingsUpdate: settings });

      }

      socket.on('updated-settings', (result) => {
        console.log(result, 'settings update result');
      })
    },
  },
});

export const {
  setUserName,
  setCurrentUser,
  getName,
  updateCurrentUserSettings,
} = userReducerSlice.actions;


export default userReducerSlice.reducer;
