import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AppRoutes } from './layout/Routes';

import './scss/app.scss';

const container = document.getElementById('root');
const root = createRoot(container);

let comp = (
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
);

root.render(comp);
