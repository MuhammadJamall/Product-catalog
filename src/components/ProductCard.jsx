import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { selectRole } from "../store/authSlice";

export default function ProductCard({
  id,
  name,
  price,
  in_stock,
  onDelete, // ✅ added
}) {
  const dispatch = useDispatch();

  const cartItems = useSelector(state => state.cart.items);
  const isAdded = cartItems.some(item => item.productId === id);
  const role = useSelector(selectRole);

  const isButtonDisabled = !in_stock || isAdded;

  const getButtonLabel = () => {
    if (!in_stock) return "Out of Stock";
    if (isAdded) return "Added";
    return "Add to Cart";
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className={`card ${!in_stock ? "card-out-of-stock" : ""}`}>
      <div className="card-header">
        <h3>{name}</h3>
        <span className={`badge ${in_stock ? "badge-stock" : "badge-out"}`}>
          {in_stock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <p className="card-price">${price.toLocaleString()}</p>

      <div className="card-actions">
        <Button
          variant={isAdded ? "secondary" : "primary"}
          onClick={() =>
            dispatch(
              addToCart({
                productId: id,
                name: name,
                price,
              })
            )
          }
          disabled={isButtonDisabled}
        >
          {getButtonLabel()}
        </Button>

        {role === 'admin' && (
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}