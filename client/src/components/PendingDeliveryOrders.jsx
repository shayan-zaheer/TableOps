import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function PendingDeliveryOrders() {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log("PENDING ORDERS:", pendingOrders);

    useEffect(() => {
        // Fetch pending delivery orders when the component mounts
        const fetchPendingOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/orders/pendingdelivery');

                console.log(response);

                setPendingOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pending delivery orders:', error);
                toast.error('Error fetching pending delivery orders');
                setLoading(false);
            }
        };

        fetchPendingOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Update the order status
            await axios.put(`http://localhost:8000/api/orders/${orderId}/update-status`, { status: newStatus });
            toast.success('Order status updated successfully');
            // Refresh the list of pending orders after the update
            setPendingOrders((prevOrders) =>
                prevOrders.filter((order) => order._id !== orderId)
            );
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Error updating order status');
        }
    };

    if (loading) {
        return <div>Loading pending orders...</div>;
    }

    if (pendingOrders.length === 0) {
        return <div>No pending delivery orders.</div>;
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold my-4">Pending Delivery Orders</h1>
            <ul className="space-y-4">
                {pendingOrders.map((order) => (
                    <li key={order._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
                        <div>
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Products:</strong></p>
                            <ul className="list-disc ml-4">
                                {order.products.map((item, index) => (
                                    <li key={index+1}>
                                        {item.product.name} - Quantity: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Total Amount:</strong> Rs. {order.totalAmount}</p>
                            <p><strong>Rider:</strong> {order?.rider?.name}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => handleStatusChange(order._id, 'Completed')}
                            >
                                Mark as Completed
                            </button>
                            <button
                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                onClick={() => handleStatusChange(order._id, 'In Progress')}
                            >
                                Mark as In Progress
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PendingDeliveryOrders;
