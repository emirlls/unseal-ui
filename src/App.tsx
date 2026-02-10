import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { Home } from './pages/Home';
import { CapsuleDetail } from './pages/CapsuleDetail';
import { Profile } from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/home" element={<Home />} />
<Route path="/profile/:id" element={<Profile />} />
  <Route path="/profile" element={<Profile />} />
        {/*detay sayfası*/}
        <Route path="/capsule/:id" element={<CapsuleDetail />} />

        {/* Tanımsız her yer login'e gider */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;