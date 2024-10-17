import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { orderActions } from '../store/orderSlice';
import { auditActions } from '../store/auditSlice';

function PendingDeliveryOrders() {
    const dispatch = useDispatch();
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/orders/pendingdelivery');
                setPendingOrders(response.data);
            } catch (error) {
                console.error('Error fetching pending delivery orders:', error);
                toast.error('Error fetching pending delivery orders');
            } finally {
                setLoading(false);
            }
        };

        fetchPendingOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Find the order to update
            const orderToUpdate = pendingOrders.find(order => order._id === orderId);
            if (!orderToUpdate) {
                throw new Error('Order not found');
            }

            // Update the order status
            await axios.put(`http://localhost:8000/api/orders/${orderId}/update-status`, { status: newStatus });

            // Calculate total quantity and total price
            const totalQuantity = orderToUpdate.products.reduce((total, item) => total + item.quantity, 0);
            const totalPrice = orderToUpdate.totalAmount;

            // Log the audit entry for the status change
            const auditLogEntry = {
                orderId,
                action: `Order ${orderId} status changed to ${newStatus}`,
                totalQuantity,
                totalPrice,
                items: orderToUpdate.products.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                })),
                createdAt: Date.now(),
            };

            // Log the audit entry in the backend
            await axios.post('http://localhost:8000/api/audit', auditLogEntry);
            dispatch(auditActions.addAuditLog(auditLogEntry));

            toast.success(`Order status updated to ${newStatus}`);

            // Remove the order from the pending list after status change
            setPendingOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));

            // Dispatch order removal action
            dispatch(orderActions.removeOrder());

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
                                    <li key={index}>
                                        {item.product.name} - Quantity: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Total Amount:</strong> Rs. {order.totalAmount}</p>
                            <p><strong>Rider:</strong> {order?.rider?.name || 'Not assigned'}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => handleStatusChange(order._id, 'Completed')}
                            >
                                Mark as Completed
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PendingDeliveryOrders;
