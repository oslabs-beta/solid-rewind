/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import Rewind from '../../dev-tool-tree-approach/Rewind.jsx'

render(() => 
<Rewind>
<App />
</Rewind>
, document.getElementById('root'));
