
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  (function () {
    try {
      var search = window.location.search;
      if (search) {
        var params = new URLSearchParams(search);
        var tool = params.get("tool");
        if (tool && ["dstudio", "halftone", "ascii", "raster"].indexOf(tool) !== -1) {
          var url = new URL(window.location.href);
          url.search = "";
          url.pathname = "/" + tool;
          window.history.replaceState(null, "", url.toString());
        }
      }
    } catch (e) {}
  })();

  createRoot(document.getElementById("root")!).render(<App />);
  
