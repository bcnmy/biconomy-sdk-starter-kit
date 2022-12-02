import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const element = document.getElementById("root");
const root = createRoot(element!);

const Index = () => {
  return (
    <App />
  );
};

root.render(<Index />);
