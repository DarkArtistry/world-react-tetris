import * as reducerType from "../../unit/reducerType";

const initState = false;
const theme = (state = initState, action) => {
  switch (action.type) {
    case reducerType.THEME:
      return action.data;
    default:
      return state;
  }
};

export default theme;
