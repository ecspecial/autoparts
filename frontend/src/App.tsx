import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:category" element={<CatalogPage />} />
            <Route path="/product/:article" element={<ProductPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
