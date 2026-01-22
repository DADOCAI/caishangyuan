import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Toaster } from "./components/ui/sonner";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Updates } from "./pages/Updates";
import { Activity } from "./pages/Activity";
import { Profile } from "./pages/Profile";
import { Subscribe } from "./pages/Subscribe";
import { Library } from "./pages/Library";
import { VipAgreement } from "./pages/VipAgreement";
import { DStudio } from "./pages/DStudio";
import { Halftone } from "./pages/Halftone";
import { Ascii } from "./pages/Ascii";
import { Raster } from "./pages/Raster";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginDialog } from "./components/LoginDialog";
import { RegisterDialog } from "./components/RegisterDialog";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white min-w-[1440px]">
          <Header />
          <Toaster />
          <LoginDialog />
          <RegisterDialog />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/dstudio" element={<DStudio />} />
            <Route path="/halftone" element={<Halftone />} />
            <Route path="/ascii" element={<Ascii />} />
            <Route path="/raster" element={<Raster />} />
            <Route path="/library" element={<Library />} />
            <Route path="/vip-agreement" element={<VipAgreement />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
