import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Leadership from './pages/Leadership'
import Compare from './pages/Compare'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Login from './pages/Login'
import Admin from './pages/Admin'
import AdminLocations from './pages/AdminLocations'
import AdminPeople from './pages/AdminPeople'
import AdminBlog from './pages/AdminBlog'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {/* Catch-all: renders the 404 page with robots noindex so mistyped
              and stale URLs are not indexed as empty pages. */}
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/locations" element={<AdminLocations />} />
        <Route path="/admin/people" element={<AdminPeople />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
