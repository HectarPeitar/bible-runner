import { startShell } from './shell/shell';

const app = document.querySelector<HTMLElement>('#app');
if (app === null) throw new Error('missing #app');
startShell(app);
