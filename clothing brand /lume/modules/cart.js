let cart = [];

export function addToCart(product) {
  cart.push(product);
}

export function removeFromCart(index) {
  cart.splice(index, 1);
}

export function getCart() {
  return cart;
}

export function getTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}