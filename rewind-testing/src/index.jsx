/* @refresh reload */
import { render } from 'solid-js/web';

import App from './App';
import Rewind from '../../rewind-devtool/src/Rewind';



render(() => 
  <Rewind>
    <App />
  </Rewind>
, document.getElementById('root'));
