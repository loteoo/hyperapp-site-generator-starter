import { State } from 'hyperstatic/src/types';

interface StateViewerProps {
  state: State;
}

const StateViewer = ({ state }: StateViewerProps) => {
  return (
    <details open>
      <summary>Show app state</summary>
      <pre>
        <code>{`state: ${JSON.stringify(state, null, 2)}`}</code>
      </pre>
    </details>
  );
};

export default StateViewer;
