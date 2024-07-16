
import React from 'react' ;
import ReactDom from 'react-dom/client' ;
import App from './App';
import './App.css' ;
import { BrowserRouter } from 'react-router-dom';
import { ContextAuthProvider } from './components/context/Contextauth';

ReactDom.createRoot(document.getElementById('root')).render(
  <ContextAuthProvider>
 <React.StrictMode>
  <BrowserRouter>
           <App></App>
  </BrowserRouter>
  
 </React.StrictMode>
 </ContextAuthProvider>
)