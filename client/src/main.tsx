import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add menu-active class styles to global CSS
const styleElement = document.createElement('style');
styleElement.innerHTML = `
  .menu-active {
    color: hsl(214, 100%, 50%);
    border-left: 3px solid hsl(214, 100%, 50%);
    background-color: rgba(0, 98, 255, 0.08);
  }
`;
document.head.appendChild(styleElement);

createRoot(document.getElementById("root")!).render(<App />);
