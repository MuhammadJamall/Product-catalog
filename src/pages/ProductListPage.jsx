import {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import ProductCard from "../components/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct } from "../store/productsSlice";
import { selectIsAuthenticated } from "../store/authSlice";
import CreateProductForm from "../components/CreateProductForm";
import { Link } from "react-router-dom";
export default function ProductListPage() {
  const dispatch = useDispatch();

  // Redux state
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [deleteError, setDeleteError] = useState(null);

  const searchRef = useRef(null);

  // focus input on mount
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isAuthenticated && status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch, isAuthenticated]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        setDeleteError(null);
      } catch (err) {
        const message =
          typeof err === "string"
            ? err
            : err?.detail || err?.message || "Unable to delete product.";
        setDeleteError(message);
        alert(message);
      }
    },[dispatch]);
  // filter + sort
  const processedProducts = useMemo(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    return [...filtered].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
  }, [products, search, sortOrder]);

  // loading / error
  if (status === "loading") return <p>Loading products...</p>;
  if (status === "failed")
    return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="catalog-section">
      <h2>📦 Products</h2>
      {deleteError && (
        <p style={{ color: "red", marginBottom: "1rem" }}>
          {deleteError}
        </p>
      )}
      {!isAuthenticated && (
        <p style={{ color: "orange" }}>
          Please login to view products.
        </p>
      )}
      <input
        ref={searchRef}
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />
      <button
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        }
        style={{ marginBottom: "1rem" }}
      >
        Sort: {sortOrder === "asc" ? "⬆️ Low → High" : "⬇️ High → Low"}
      </button>

      <div className="product-grid">
        {processedProducts.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              in_stock={product.in_stock}
              onDelete={handleDelete}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}