export interface UserSettings{
  share_screen:  boolean,
  play_voice: boolean,
  show_cam: boolean,
  show_caption:boolean
}


export const enum UserSettingsActions{
  TOGGLE_SHARE_SCREEN = 'TOGGLE_SHARE_SCREEN',
  TOGGLE_SHOW_CAM = 'TOGGLE_SHOW_CAM',
  TOGGLE_SHOW_CAPTION = 'TOGGLE_SHOW_CAPTION',
  TOGGLE_PLAY_VOICE = 'TOGGLE_PLAY_VOICE',
}