import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/cartSlice";

export default function CartSummary() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { totalItems, totalPrice };
  }, [items]);

  if (items.length === 0) {
    return <p>Your cart is empty 🛒</p>;
  }
  return (
    <div>
      <h3>Cart Summary</h3>

      {items.map((item) => (
        <div key={item.productId} style={{ marginBottom: "10px" }}>
          <p>
            {item.name} - ${item.price} × {item.quantity}
          </p>

          <button
            onClick={() =>
              dispatch(
                updateQuantity({
                  productId: item.productId,
                  quantity: item.quantity + 1,
                })
              )
            }
          >
            +
          </button>

          <button
            onClick={() =>
              dispatch(
                updateQuantity({
                  productId: item.productId,
                  quantity: item.quantity - 1,
                })
              )
            }
          >
            -
          </button>

          <button
            onClick={() =>
              dispatch(removeFromCart(item.productId))
            }
          >
            Remove
          </button>
        </div>
      ))}

      <hr />

      <p>Total Items: {totalItems}</p>
      <p>Total Price: ${totalPrice}</p>

      <button onClick={() => dispatch(clearCart())}>
        Clear Cart
      </button>
    </div>
  );
}