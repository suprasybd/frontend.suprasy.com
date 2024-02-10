// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import { Ui } from '@frontend.suprasy.com/ui';
import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <Ui />
      <NxWelcome title="web" />
    </div>
  );
}

export default App;
