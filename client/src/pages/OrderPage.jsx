import { useSelector } from "react-redux";
import Order from "../components/Order";
import OrderHeader from "../components/OrderHeader";
import OrderFooter from "../components/OrderFooter";

function OrderPage() {
    const orderList = useSelector((store) => store.order);

    console.log(orderList);
    if (!orderList || orderList.length === 0) {
        return <div className="flex flex-col h-screen items-center justify-center bg-gray-800">
            <h1 className="font-bold text-2xl text-white">No items added yet!</h1>
            </div>;
    }

    return (
        <>
            <div className="bg-gray-800">
                <OrderHeader />
                {orderList.map(({ name, price, quantity }, index) => {
                    return (
                        <Order
                            key={index}
                            name={name}
                            price={price}
                            quantity={quantity}
                        />
                    );
                })}
            </div>
            <OrderFooter />
        </>
    );
}

export default OrderPage;

// return (
//     <>
//         {orderList && (

//              <table className="min-w-full table-auto border-collapse border border-gray-300">
//              <thead>
//                <tr>
//                  <th className="border border-gray-300 px-4 py-2">SNo</th>
//                  <th className="border border-gray-300 px-4 py-2">Name</th>
//                  <th className="border border-gray-300 px-4 py-2">Price</th>
//                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
//                </tr>
//              </thead>
//              <tbody>
//                {orderList.map(({name, price, quantity}) => (
//                  <tr>
//                    <td className="border border-gray-300 px-4 py-2">{1}</td>
//                    <td className="border border-gray-300 px-4 py-2">{name}</td>
//                    <td className="border border-gray-300 px-4 py-2">{price}</td>
//                    <td className="border border-gray-300 px-4 py-2">{quantity}</td>
//                  </tr>
//                ))}
//              </tbody>
//            </table>
//         )}
//     </>
// );
