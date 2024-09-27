import Order from "../components/Order";
import Product from "../components/Product";

function MenuPage() {
  return (
    <div className="flex flex-row justify-center flex-wrap gap-6 py-8 w-screen h-100 bg-gray-800">
        <Product name="Zinger Burger" />
        <Product name="Chicken Burger" />
        <Product name="Beef Burger" />
        <Product />
        <Product />
        <Product />
        <Product />
      </div>
  )
}

export default MenuPage