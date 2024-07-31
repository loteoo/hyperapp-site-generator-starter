import { State } from 'hyperstatic/src/types';
import utils from '/src/lib/utils.module.css';

const IncrementPageCounter = (state: State) => ({
  ...state,
  pageCount: (state.pageCount ?? 0) + 1,
});

const HomePage = (state: State) => {
  return (
    <div class={utils.container}>
      <h1>👋 Welcome to hyperstatic</h1>
      <div class={utils.group}>
        <h4 style={{ margin: '0' }}>Current count: {String(state.pageCount)}</h4>
        <button onclick={IncrementPageCounter}>Increment</button>
      </div>
      <a href="/?a=2&b=2">Query params test</a>
    </div>
  );
};

export default HomePage;
