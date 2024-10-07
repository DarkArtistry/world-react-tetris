import * as reducerType from "../../unit/reducerType";

const initState = {
  isTheme: false,
  backgroundColor: "transparent",
  buttonColor: "transparent",
  arrowPosition: "left",
};

const theme = (state = initState, action) => {
  switch (action.type) {
    case reducerType.THEME:
      return { ...state, isTheme: action.data };

    case reducerType.BACKGROUND_COLOR:
      return { ...state, backgroundColor: action.data };

    case reducerType.BUTTON_COLOR:
      return { ...state, buttonColor: action.data };

    case reducerType.ARROW_POSITION:
      return { ...state, arrowPosition: action.data };

    default:
      return state;
  }
};

export default theme;
