import { useState } from "react";
import Header from "./components/header";
import ProductList from "./components/ProductList";
import Button from "./components/Button";
import "./App.css";

const products = [
  { id: 1, name: "iPhone 15", price: 1000, inStock: true },
  { id: 2, name: "Samsung Galaxy S24", price: 1200, inStock: true },
  { id: 3, name: "Google Pixel 8", price: 800, inStock: true },
  { id: 4, name: "One Plus 12", price: 800, inStock: false },
  { id: 5, name: "Oppo Find X7", price: 800, inStock: false },
  { id: 6, name: "Vivo X100", price: 800, inStock: true },
  { id: 7, name: "Realme c3", price: 200, inStock: true },
  { id: 8, name: "Samsung s21", price: 500, inStock: false },
  { id: 9, name: "Samsung s22", price: 600, inStock: false },
];

function App() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [filterText, setFilterText] = useState(""); // ✅ NEW

  const showFeedback = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const addToCart = (product) => {
    if (cart.some((item) => item.id === product.id)) return;
    setCart((prev) => [...prev, product]);
    showFeedback(`Added "${product.name}" to cart!`);
  };

  const removeFromCart = (id) => {
    const itemToRemove = cart.find((item) => item.id === id);
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (itemToRemove) {
      showFeedback(`Removed "${itemToRemove.name}" from cart.`);
    }
  };

  const clearCart = () => {
    setCart([]);
    showFeedback("Cart cleared.");
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // ✅ NEW: filtering logic (case-insensitive, partial match)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Header />
      {message && <div className="feedback-toast">{message}</div>}

      <section className="cart-summary">
        <div className="cart-header">
          <h2>🛒 Shopping Cart ({cart.length})</h2>
          <Button
            variant="danger-outline"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Cart ko Clear krlo
          </Button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-icon">🛍️</span>
            <p>Your cart is currently empty.</p>
            <small>
              Browse items below and click "Add to Cart" to start shopping!
            </small>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-details">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-unit-price">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="cart-item-controls">
                    <Button
                      variant="danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-total-banner">
              <span>Total Price:</span>
              <span className="highlight-price">
                ${total.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </section>

      {/* Catalog Grid */}
      <section className="catalog-section">
        <h2>📱 Product Catalog</h2>

        {/* ✅ NEW: search input */}
        <input
          type="text"
          placeholder="Search products..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            width: "100%",
          }}
        />

        <ProductList
          products={filteredProducts}
          cart={cart}
          onAddToCart={addToCart}
        />
      </section>
    </div>
  );
}

export default App;