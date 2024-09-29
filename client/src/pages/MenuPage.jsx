import Order from "../components/Order";
import Product from "../components/Product";

function MenuPage() {
  return (
    <div className="flex flex-row justify-center flex-wrap gap-6 py-8 h-100 bg-gray-800">
        <Product name="Zinger Burger" price={320}/>
        <Product name="Chicken Burger" price={250} />
        <Product name="Beef Burger" price={250}/>
        <Product name="Club Sandwich" price={320}/>
        {/* <Product />
        <Product />
        <Product /> */}
      </div>
  )
}

export default MenuPage