import * as reducerType from "../../unit/reducerType";
import { unit } from "../../unit";

const initState = unit.isFocus();
const focus = (state = initState, action) => {
  switch (action.type) {
    case reducerType.FOCUS:
      return action.data;
    default:
      return state;
  }
};

export default focus;
