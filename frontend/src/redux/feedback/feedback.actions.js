import axios from "axios";
import { FEEDBACK_FAIL, FEEDBACK_SUCCESS } from "./feedback.types";
import { setAlert } from "../alert/alert.actions";

export const feedbackPost = (formData, history) => async (dispatch) => {
  try {
    const { data } = await axios.post("/feedback", formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle the successful response here
    console.log("Response data:", data);

    // Dispatch success action and set success alert
    dispatch({ type: FEEDBACK_SUCCESS });
    dispatch(setAlert("Feedback sent successfully", "success"));

    // Navigate to the next page
    history.push("/");
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.data && error.response.data.errors) {
      const errors = error.response.data.errors;

      if (Array.isArray(errors)) {
        errors.forEach((errorItem) => dispatch(setAlert(errorItem.msg, "danger")));
      } else if (typeof errors === "object") {
        // Handle error as an object, e.g., extract and process properties
        dispatch(setAlert("An error object was encountered", "danger"));
        // Handle specific properties of the error object as needed
        // For example: dispatch(setAlert(errors.errorMessage, "danger"));
      }
    } else if (error && error.response && error.response.data && error.response.data.msg) {
      dispatch(setAlert(error.response.data.msg, "danger"));
    } else {
      // Handle other error cases
      dispatch(setAlert("An error occurred", "danger"));
    }
    dispatch({ type: FEEDBACK_FAIL });
  }
};
