import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { orderActions } from "../store/orderSlice";
// import { auditActions } from "../store/auditSlice";

function OrderFooter() {
    const dispatch = useDispatch();
    const orderList = useSelector(store => store.order.orders);
    const [showDialog, setShowDialog] = useState(false);
    const totalPrice = orderList.reduce((total, order) => total + order.price * order.quantity, 0);

    const handleConfirmOrder = () => {
        if (totalPrice > 0) {
            setShowDialog(true);
        } else {
            alert("No items in the order.");
        }
    };

    const handleOrderTypeSelection = async (type) => {
        setShowDialog(false);
    
        // Initialize auditLogEntry
        const auditLogEntry = {
            totalQuantity: orderList.reduce((total, order) => total + order.quantity, 0),
            totalPrice,
            items: orderList.map(order => ({ name: order.name, quantity: order.quantity })),
            createdAt: Date.now(),
        };
    
        try {
            if (type === "takeaway") {
                // First, create an order for takeaway
                const response = await axios.post('http://localhost:8000/api/orders/', {
                    products: orderList,
                    totalAmount: totalPrice,
                    type: 'takeaway',
                });
    
                if (response.status === 201) {
                    const orderId = response.data._id; // Get the orderId from the response
    
                    // Log audit entry with the created orderId
                    await axios.post('http://localhost:8000/api/audit/', {
                        action: "Takeaway Order Confirmed",
                        auditLogEntry,
                        orderId, // Pass the newly created orderId
                    });
    
                    toast.success(`Takeaway order confirmed! Total Price: Rs. ${totalPrice}`);
                    dispatch(orderActions.removeOrder()); // Clear orders on success
                }
            } else if (type === "dinein") {
                // Handle dine-in order as before
                const response = await axios.post('http://localhost:8000/api/orders/', {
                    products: orderList,
                    totalAmount: totalPrice,
                    type: 'dinein',
                });
    
                if (response.status === 201) {
                    const orderId = response.data._id; // Get orderId from response
    
                    await axios.post('http://localhost:8000/api/audit/', {
                        action: "Dine-in Order Created",
                        orderId,
                        auditLogEntry, // Add orderId to audit log
                    });
    
                    toast.success(`Dine-in order created successfully! Total Price: Rs. ${totalPrice}. You can add items later.`);
                    dispatch(orderActions.removeOrder()); // Clear orders on success
                }
            }
        } catch (error) {
            console.error(`Error confirming ${type} order:`, error);
            toast.error(`Error confirming ${type} order: ${error.response ? error.response.data.message : error.message}`);
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
                            onClick={() => handleOrderTypeSelection("dinein")}
                            className="block w-full p-2 mb-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Dine-In
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
