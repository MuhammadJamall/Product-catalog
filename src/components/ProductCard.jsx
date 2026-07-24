import Button from "./Button";

export default function ProductCard({ id, name, price, inStock, isAdded, onAddToCart }) {
  const isButtonDisabled = !inStock || isAdded;

  const getButtonLabel = () => {
    if (!inStock) return "Out of Stock";
    if (isAdded) return "Added ✓";
    return "Add to Cart";
  };

  return (
    <div className={`card ${!inStock ? "card-out-of-stock" : ""}`}>
      <div className="card-header">
        <h3>{name}</h3>
        <span className={`badge ${inStock ? "badge-stock" : "badge-out"}`}>
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <p className="card-price">${price.toLocaleString()}</p>

      <div className="card-actions">
        <Button
          variant={isAdded ? "secondary" : "primary"}
          onClick={() => onAddToCart({ id, name, price })}
          disabled={isButtonDisabled}
        >
          {getButtonLabel()}
        </Button>
      </div>
    </div>
  );
}




