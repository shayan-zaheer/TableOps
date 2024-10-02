import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { auditActions } from "../store/auditSlice";
import { orderActions } from "../store/orderSlice";

function OrderFooter() {
    const dispatch = useDispatch();
    const orderList = useSelector(store => store.order);
    
    const [showDialog, setShowDialog] = useState(false);
    const [orderType, setOrderType] = useState(null); // To store takeaway or delivery

    const totalPrice = (orderList && orderList.length > 0) 
        ? orderList.reduce((total, order) => total + order.price * order.quantity, 0) 
        : 0;

    const handleConfirmOrder = () => {
        if (totalPrice > 0) {
            setShowDialog(true); // Show dialog for order type selection
        } else {
            alert("No items in the order.");
        }
    };

    const handleOrderTypeSelection = (type) => {
        setOrderType(type);
        setShowDialog(false); // Close dialog

        if (type === "takeaway") {
            // Handle takeaway order logic
            const auditLogEntry = {
                totalQuantity: orderList.reduce((total, order) => total + order.quantity, 0),
                totalPrice: totalPrice,
                items: orderList.map(order => ({ name: order.name, quantity: order.quantity }))
            };
    
            dispatch(auditActions.addAuditLog(auditLogEntry));
            alert(`Takeaway order confirmed! Total Price: Rs. ${totalPrice}`);
            dispatch(orderActions.removeOrder()); // Clear the order
        } else if (type === "delivery") {
            // Handle delivery order logic
            const deliveryOrderEntry = {
                items: orderList.map(order => ({ name: order.name, quantity: order.quantity })),
                totalPrice: totalPrice,
                status: "Pending",
                driver: null,
            };

            dispatch(orderActions.addDeliveryOrder(deliveryOrderEntry)); // Adjust this as per your slice

            alert(`Delivery order confirmed! Status: Pending. Total Price: Rs. ${totalPrice}`);
            dispatch(orderActions.removeOrder());
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mt-4 p-3 bg-[rgb(109,94,76)] text-white rounded">
                <span className="font-semibold">Total Price: Rs. {totalPrice}</span>
                <button onClick={handleConfirmOrder} className="text-green-500 hover:text-green-700 font-semibold">
                    Confirm Order
                </button>
            </div>

            {/* Confirmation Dialog */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Select Order Type</h3>
                        <button 
                            onClick={() => handleOrderTypeSelection("takeaway")}
                            className="block w-full p-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Takeaway
                        </button>
                        <button 
                            onClick={() => handleOrderTypeSelection("delivery")}
                            className="block w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Delivery
                        </button>
                        <button 
                            onClick={() => setShowDialog(false)} 
                            className="block w-full p-2 mt-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderFooter;
