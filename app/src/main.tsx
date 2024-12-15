import ReactDOM from "react-dom/client";
import App from "src/App.tsx";
import "src/index.scss";
import { BrowserRouter } from "react-router-dom";
import { GuitarChordProvider } from "src/context/GuitarChordsProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
      <GuitarChordProvider>
        <App />
      </GuitarChordProvider>
    </BrowserRouter>
);
