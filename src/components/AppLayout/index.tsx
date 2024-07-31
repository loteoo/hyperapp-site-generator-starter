import { VNode } from 'hyperapp';
import { State } from 'hyperstatic/src/types';

import Header from '/src/components/Header';
import Footer from '/src/components/Footer';
import StateViewer from '/src/components/StateViewer';

import '/src/lib/global.css';
import utils from '/src/lib/utils.module.css';
import styles from './layout.module.css';

const AppLayout = (state: State, children: VNode<State>) => {
  return (
    <div class={styles.layout}>
      <Header />
      <main>
        {children}
        <div class={utils.container}>
          <StateViewer state={state} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
