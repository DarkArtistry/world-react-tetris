import event from "../../unit/event";
import states from "../states";
import actions from "../../actions";

const down = (store) => {
  store.dispatch(actions.keyboard.theme(true));
  event.down({
    key: "t",
    once: true,
    callback: () => {
      const state = store.getState();
      if (state.get("lock")) {
        return;
      }
      const isTheme = state.get("theme");
      states.theme(!isTheme);
    },
  });
};

const up = (store) => {
  store.dispatch(actions.keyboard.theme(false));
  event.up({
    key: "t",
  });
};

export default {
  down,
  up,
};
