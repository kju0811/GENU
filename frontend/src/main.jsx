import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {BrowserRouter} from "react-router-dom";
// import {GlobalContext} from;
import "./index.css";
import { GlobalProvider } from "./components/GlobalContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <GlobalProvider>
                <App/>
            </GlobalProvider>
        </BrowserRouter>
    </React.StrictMode>
);