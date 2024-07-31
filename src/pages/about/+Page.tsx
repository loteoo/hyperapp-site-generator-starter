import { State } from 'hyperstatic/src/types';
import utils from '/src/lib/utils.module.css';

const AboutPage = (state: State) => {
  return (
    <div class={utils.container}>
      <h1>About</h1>
      <p>{state.data.hello}</p>
    </div>
  );
};

export default AboutPage;
