import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router";

const App: React.FC = () => {
  return (
    <div className="dark:bg-gray-800 dark:text-white">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
};

export default App;
