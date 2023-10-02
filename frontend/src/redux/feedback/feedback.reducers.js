import { FEEDBACK_FAIL, FEEDBACK_SUCCESS } from "./feedback.types";

const initialState = {
    success:null,
    fail :null,
    error:""
  };

  export default function feedbackreducer(state = initialState, action) {
    const { type,payload} = action;

    switch(type){
        case FEEDBACK_FAIL:
            return {...state , fail:true, success:null , error:payload}

        case FEEDBACK_SUCCESS:
            return {...state, fail:null, success:true}

        default:
            return state;
    }
  }