import { useDispatch, useSelector } from "react-redux";
import { auditActions } from "../store/auditSlice";
import { orderActions } from "../store/orderSlice";

function OrderFooter() {
    const dispatch = useDispatch();
    const orderList = useSelector(store => store.order);
    
    const totalPrice = (orderList && orderList.length > 0) 
        ? orderList.reduce((total, order) => total + order.price * order.quantity, 0) 
        : 0;

    const handleConfirmOrder = () => {
        if (totalPrice > 0) {
            const auditLogEntry = {
                totalQuantity: orderList.reduce((total, order) => total + order.quantity, 0),
                totalPrice: totalPrice,
                items: orderList.map(order => ({ name: order.name, quantity: order.quantity }))
            };
    
            dispatch(auditActions.addAuditLog(auditLogEntry));

            alert(`Total Price: Rs. ${totalPrice}`);

            dispatch(orderActions.removeOrder());

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
