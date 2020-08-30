import React from "react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

const inventory = {
  a: { name: "🧉 Yerba Mate", price: 10 },
  b: { name: "☕️ Coffee", price: 15 },
  c: { name: "🍵 Tea", price: 7.5 },
};

const destinations = {
  US: 25,
  CA: 35,
  CO: 45,
};

const cartState = atom({
  key: "cartState",
  default: {},
});

const shippingState = atom({
  key: "shippingState",
  default: "US",
});

function App() {
  return (
    <RecoilRoot>
      <AvailableItems />
      <Cart />
    </RecoilRoot>
  );
}

function AvailableItems() {
  const [cart, setCart] = useRecoilState(cartState);

  return (
    <div>
      <h2>Available Items</h2>
      <ul>
        {Object.entries(inventory).map(([id, { name, price }]) => (
          <li key={id}>
            {name} @ ${price.toFixed(2)}
            <button
              onClick={() => {
                setCart({ ...cart, [id]: (cart[id] || 0) + 1 });
              }}
            >
              add
            </button>
            {cart[id] && (
              <button
                onClick={() => {
                  const copy = { ...cart };
                  if (copy[id] === 1) {
                    delete copy[id];
                    setCart(copy);
                  } else {
                    setCart({ ...copy, [id]: copy[id] - 1 });
                  }
                }}
              >
                rem
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cart() {
  return (
    <div>
      <h2>Cart</h2>
      <CartItems />
      <Shipping />
      <Totals />
    </div>
  );
}

function CartItems() {
  const cart = useRecoilValue(cartState);

  if (Object.keys(cart).length === 0) return <p>No items.</p>;

  return (
    <ul>
      {Object.entries(cart).map(([id, quantity]) => (
        <li key={id}>
          {inventory[id].name} x {quantity}
        </li>
      ))}
    </ul>
  );
}

function Shipping() {
  const [shipping, setShipping] = useRecoilState(shippingState);

  return (
    <div>
      <h2>Shipping</h2>
      {Object.entries(destinations).map(([country, price]) => (
        <button
          onClick={() => {
            setShipping(country);
          }}
        >
          {country} @ {price}
          {country === shipping ? <span> 🌶</span> : ""}
        </button>
      ))}
    </div>
  );
}

const totalsState = selector({
  key: "totalsState",
  get: ({ get }) => {
    const cart = get(cartState);
    const shipping = get(shippingState);
    const subtotal = Object.entries(cart).reduce(
      (acc, [id, quantity]) => acc + inventory[id].price * quantity,
      0
    );
    const shippingTotal = destinations[shipping];

    return {
      subtotal,
      shipping: shippingTotal,
      total: subtotal + shippingTotal,
    };
  },
});

function Totals() {
  const totals = useRecoilValue(totalsState);

  return (
    <div>
      <h2>Totals</h2>
      <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
      <p>Shipping: ${totals.shipping.toFixed(2)}</p>
      <p>
        <strong>Total: ${totals.total.toFixed(2)}</strong>
      </p>
    </div>
  );
}

export default App;
