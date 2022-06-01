import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes,Route, BrowserRouter } from "react-router-dom";

import App from './App';
import Page from './component/page'
import PageId from './component/router/pageId'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  {/*https://github.com/remix-run/react-router/blob/main/docs/getting-started/tutorial.md 
  https://reactrouter.com/docs/en/v6/getting-started/concepts#history-and-locations
  */}
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="categorias" element={<Page page={"categorias"}/>}/>    
      <Route path="categorias/:pageId" element={<PageId/>}></Route>
    </Routes>
  </BrowserRouter>
);
