import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";


const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
