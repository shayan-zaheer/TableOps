import { useSelector } from "react-redux";

function OrderFooter() {
    const orderList = useSelector(store => store.order);
    
    // Initialize totalPrice to 0 if orders array is empty
    const totalPrice = (orderList && orderList.length > 0) 
        ? orderList.reduce((total, order) => total + order.price * order.quantity, 0) 
        : 0;

    const handleConfirmOrder = () => {
        if (totalPrice > 0) {
            alert(`Total Price: Rs. ${totalPrice}`);
        } else {
            alert("No items in the order.");
        }
    }

    return (
        <div className="flex justify-between items-center mt-4 p-3 bg-gray-700 text-white rounded">
            <span className="font-semibold">Total Price: Rs. {totalPrice}</span>
            <button onClick={handleConfirmOrder} className="text-green-500 hover:text-green-700 font-semibold">
                Confirm Order
            </button>
        </div>
    );
}

export default OrderFooter;
