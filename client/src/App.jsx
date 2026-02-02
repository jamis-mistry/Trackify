import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";


import AnimatedBackground from "./components/layout/AnimatedBackground";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen relative">
            <div className="fixed inset-0 -z-30 pointer-events-none">
              <AnimatedBackground />
            </div>
            <AppRoutes />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
