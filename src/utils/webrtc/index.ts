

export const sendOffer = (_peerConnection: any, _creatorId: any, _receiverId: any) => {

}



export const sendAnswer = async (_answerSenderId: any, _userId: any) => {

  
}




export const StopStreams = async (stream: MediaStream) => {
  try {
    stream.getAudioTracks()[0].stop();
    stream.getVideoTracks()[0].stop();
  } catch (err) {
    console.error(err);
    const error = new Error();
    error.message = 'Unable to stop streams';
    // error.status = 403;
    return error;
  }


  return true;
}