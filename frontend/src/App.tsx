import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import MainPage from './pages/MainPage/MainPage';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import ProductPage from './pages/ProductPage/ProductPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import CartPage from './pages/CartPage/CartPage';
import SearchPage from './pages/SearchPage/SearchPage';
import ContactsPage from './pages/ContactsPage/ContactsPage';
import AboutPage from './pages/AboutPage/AboutPage';
import WarrantyPage from './pages/WarrantyPage/WarrantyPage';
import PersonalDataPage from './pages/PersonalDataPage/PersonalDataPage';
import AuthPage from './pages/AuthPage/AuthPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import DownloadsPage from './pages/DownloadsPage/DownloadsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
            <ScrollToTop />
            <div className="app">
            <Header />
            <main>
                <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/catalog/:category" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/warranty" element={<WarrantyPage />} />
                <Route path="/personal-data" element={<PersonalDataPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/downloads" element={<DownloadsPage />} />
                <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
            </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
