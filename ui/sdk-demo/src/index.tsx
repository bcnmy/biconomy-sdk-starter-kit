import { createRoot } from "react-dom/client";
import React from 'react';
import './index.css';
import App from './App';

const element = document.getElementById('root');
const root = createRoot(element!);

const Index = () => {
  return (
    <App /> 
  );
};

root.render(<Index />);

//   root.render(
//     <React.StrictMode>
//     <App />
//     < /React.StrictMode>
//   );
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
