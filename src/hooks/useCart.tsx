// import { CartItem, Produto } from "@/Types/types";
// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";

// export default function useCart() {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   useEffect(() => {
//     const savedCart = Cookies.get("cart");
//     if (savedCart) {
//       setCart(JSON.parse(savedCart));
//     }
//   }, []);

//   useEffect(() => {
//     Cookies.set("cart", JSON.stringify(cart), { expires: 7 });
//   }, [cart]);

//   const addItemToCart = (item: Produto) => {
//     setCart((prevCart) => {
//       const existingItem = prevCart.find((i) => i.id === item.id);
//       if (existingItem) {
//         return prevCart.map((i) =>
//           i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i
//         );
//       }
//       return [...prevCart, { ...item, quantidade: 1 }];
//     });
//   };

//   const removeItemFromCart = (itemId: number) => {
//     setCart((prevCart) => {
//       const existingItem = prevCart.find((i) => i.id === itemId);
//       if (existingItem?.quantidade === 1) {
//         return prevCart.filter((i) => i.id !== itemId);
//       }
//       return prevCart.map((i) =>
//         i.id === itemId ? { ...i, quantidade: i.quantidade - 1 } : i
//       );
//     });
//   };

//   return { cart, addItemToCart, removeItemFromCart };
// }
