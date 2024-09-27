import { useSelector } from "react-redux";
import Order from "../components/Order";

function OrderPage() {
    const orderList = useSelector(store => store.order);

    console.log(orderList);
    if (!orderList || orderList.length === 0) {
        return <h1>No items added yet!</h1>;
    }
    
    return (
        <div className="bg-gray-800">
            {orderList.map(({name, price, quantity}, index) => {
                return <Order key={index} name={name} price={price} quantity={quantity}/>
            })}
        </div>
    )
    
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