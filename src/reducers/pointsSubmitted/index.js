import * as reducerType from "../../unit/reducerType";
import { lastRecord } from "../../unit/const";

const initState =
  lastRecord && lastRecord.pointsSubmitted !== undefined
    ? !!lastRecord.pointsSubmitted
    : false;

const pointsSubmitted = (state = initState, action) => {
  switch (action.type) {
    case reducerType.POINTS_SUBMITTED:
      return action.data;
    default:
      return state;
  }
};

export default pointsSubmitted;
