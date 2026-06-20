import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Spots from './pages/Spots';
import SpotDetail from './pages/SpotDetail';
import Trips from './pages/Trips';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Auth pages - no layout */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Main pages - with layout */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="spots" element={
                            <ProtectedRoute>
                                <Spots />
                            </ProtectedRoute>
                        } />
                        {/* View One - dynamic route with :id param */}
                        <Route path="spots/:id" element={
                            <ProtectedRoute>
                                <SpotDetail />
                            </ProtectedRoute>
                        } />
                        <Route path="trips" element={
                            <ProtectedRoute>
                                <Trips />
                            </ProtectedRoute>
                        } />
                        <Route path="profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;