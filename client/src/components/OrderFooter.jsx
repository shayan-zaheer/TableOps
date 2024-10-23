import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { orderActions } from "../store/orderSlice";

function OrderFooter() {
    const dispatch = useDispatch();
    const orderList = useSelector(store => store.order.orders);
    const [showDialog, setShowDialog] = useState(false);
    const totalPrice = orderList.reduce((total, order) => total + order.price * order.quantity, 0);

    console.log("ORDER:", orderList);

    const handleConfirmOrder = () => {
        if (totalPrice > 0) {
            setShowDialog(true);
        } else {
            alert("No items in the order.");
        }
    };

    const printTokenByCategory = (orderId) => {
        const groupedItems = orderList.reduce((acc, item) => {
            const category = item?.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});

        const printCategory = (category, items) => {
            const tokenWindow = window.open('', 'PRINT', 'height=400,width=600');
            
            if (!tokenWindow) {
                console.error('Unable to open print window');
                return;
            }

            tokenWindow.document.write(`<html><head><title>${category} Token</title>`);
            tokenWindow.document.write('</head><body>');
            tokenWindow.document.write(`<h1>Token for Order ${orderId}</h1>`);
            tokenWindow.document.write(`<h1>${category} Receipt</h1>`);

            items.forEach(item => {
                tokenWindow.document.write(`<p>${item.name} - Quantity: ${item.quantity}</p>`);
            });

            tokenWindow.document.write('</body></html>');
            tokenWindow.document.close();
            tokenWindow.focus();
            tokenWindow.print();
            setTimeout(() => {
                tokenWindow.close();
            }, 500);
        };

        Object.entries(groupedItems).forEach(([category, items], index) => {
            setTimeout(() => {
                printCategory(category, items);
            }, index * 700);
        });
    };

    const handleOrderTypeSelection = async (type) => {
        setShowDialog(false);

        const auditLogEntry = {
            totalQuantity: orderList.reduce((total, order) => total + order.quantity, 0),
            totalPrice,
            items: orderList.map(order => ({ name: order.name, quantity: order.quantity })),
            createdAt: Date.now(),
        };

        try {
            if (type === "takeaway") {
                let response;
                if (orderList[0]?.dealPrice) {
                    response = await axios.post('http://localhost:8000/api/orders/', {
                        products: orderList,
                        totalAmount: orderList[0]?.dealPrice,
                        type: 'takeaway',
                    });
                } else {
                    response = await axios.post('http://localhost:8000/api/orders/', {
                        products: orderList,
                        totalAmount: totalPrice,
                        type: 'takeaway',
                    });
                }

                if (response.status === 201) {
                    const orderId = response.data._id;

                    console.log(orderId);

                    await axios.post('http://localhost:8000/api/audit/', {
                        action: "Takeaway Order Confirmed",
                        auditLogEntry,
                        orderId
                    });
                    
                    printTokenByCategory(orderId);

                    toast.success(`Takeaway order confirmed! Total Price: Rs. ${totalPrice}`);
                    dispatch(orderActions.removeOrder());

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
                <span className="font-semibold">Total Price: Rs. {orderList[0]?.dealPrice ? orderList[0]?.dealPrice : totalPrice}</span>
                <button onClick={handleConfirmOrder} className="text-green-500 hover:text-green-700 font-semibold">
                    Confirm Order (Takeaway)
                </button>
            </div>

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
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderFooter;
