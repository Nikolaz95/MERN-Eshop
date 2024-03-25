export const getPriceQueryParams = (searchParams, key, value) => {

    const hasValueInParam = searchParams.has(key);

    if (value && hasValueInParam) {
      searchParams.set(key, value);
    } else if (value) {
      searchParams.append(key, value);
    } else if (hasValueInParam) {
      searchParams.delete(key);
    }

    return searchParams;

  };

  export const calculateOrderCost = (cartItem) => {
    const  itemsPrice = cartItem?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    console.log(itemsPrice)
    console.log(cartItem)

  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  console.log(shippingPrice)
    console.log(taxPrice)
    console.log(totalPrice)

  return {
    itemsPrice: Number(itemsPrice).toFixed(2),
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};