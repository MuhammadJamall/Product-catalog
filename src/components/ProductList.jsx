import ProductCard from "./ProductCard";

export default function ProductList({ products, cart, onAddToCart }) {
  return (
    <div className="container">
      {products.map((product) => {
        // Derive per-item added state
        const isAdded = cart.some((item) => item.id === product.id);

        return (
          <ProductCard
            key={product.id}
            {...product}
            isAdded={isAdded}
            onAddToCart={onAddToCart}
          />
        );
      })}
    </div>
  );
}

