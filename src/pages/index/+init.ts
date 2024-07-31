import { Action } from "hyperapp";
import { State } from "hyperstatic/src/types";

const Init: Action<State> = (state) => {
  return { ...state, pageCount: state.pageCount ?? 0, }
}

export default Init