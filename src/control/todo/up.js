import { want } from "../../unit";
import event from "../../unit/event";
import actions from "../../actions";
import states from "../states";
import { music } from "../../unit/music";

const down = (store) => {
  store.dispatch(actions.keyboard.drop(true));
  event.down({
    key: "up",
    once: true,
    callback: () => {
      const state = store.getState();
      if (state.get("lock")) {
        return;
      }
      const cur = state.get("cur");
      if (cur !== null) {
        // 置底
        if (state.get("pause")) {
          states.pause(false);
          return;
        }
        if (music.fall) {
          music.fall();
        }
        let index = 0;
        let bottom = cur.fall(index);
        while (want(bottom, state.get("matrix"))) {
          bottom = cur.fall(index);
          index++;
        }
        let matrix = state.get("matrix");
        bottom = cur.fall(index - 2);
        store.dispatch(actions.moveBlock(bottom));
        const { shape } = bottom;
        const { xy } = bottom;
        shape.forEach((m, k1) =>
          m.forEach((n, k2) => {
            if (n && xy[0] + k1 >= 0) {
              // 竖坐标可以为负
              let line = matrix.get(xy[0] + k1);
              line = line.set(xy[1] + k2, 1);
              matrix = matrix.set(xy[0] + k1, line);
            }
          })
        );
        store.dispatch(actions.drop(true));
        setTimeout(() => {
          store.dispatch(actions.drop(false));
        }, 100);
        states.nextAround(matrix);
      } else {
        music.move();
        let startLines = state.get("startLines");
        startLines = startLines + 1 > 10 ? 0 : startLines + 1;
        store.dispatch(actions.startLines(startLines));
      }
    },
  });
};

const up = (store) => {
  store.dispatch(actions.keyboard.drop(false));
  event.up({
    key: "up",
  });
};

export default {
  down,
  up,
};
