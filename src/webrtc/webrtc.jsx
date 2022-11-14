

const sendOffer = (peerConnection,creatorId,receiverId) => {
  // accesss meetjoiners collections in the backend 

  // get receiverId data;

  // LISTEN FOR ICECANDIDATE EVENT
  // peerConnection.onicecandidate = (event) => {
    // if(event.candidate){
    //   //send offerCandidates ot the receiver
    //   in form of event.candidate.toJSON(),userId:creatorId
    // }
  // }



  // create offer

}



const sendAnswer = async (answerSenderId,userId) => {
  // get answerSenderId
  // access their db
  // listen to icecandidate event
  // send  {event.candidate in json and userId} to their db

  // create answer
  // setLocalDescription
  // create answerData

  // send it to the answers in the db
}


const updateUserSettings = () => {
  // get access to db their settings update it 

  
}