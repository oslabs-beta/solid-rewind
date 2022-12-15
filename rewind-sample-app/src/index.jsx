/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import Rewind from '../../dev-tool/Rewind.jsx'

render(() => 
<Rewind>
<App />
</Rewind>
, document.getElementById('root'));
