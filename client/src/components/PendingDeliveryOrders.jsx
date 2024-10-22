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
            const orderToUpdate = pendingOrders.find(order => order._id === orderId);
            if (!orderToUpdate) {
                throw new Error('Order not found');
            }

            await axios.put(`http://localhost:8000/api/orders/${orderId}/update-status`, { status: newStatus });

            const totalQuantity = orderToUpdate.products.reduce((total, item) => total + item.quantity, 0);
            const totalPrice = orderToUpdate.totalAmount;

            console.log("ORDER TO UPDATE", orderToUpdate)

            const auditLogEntry = {
                orderId,
                action: `Order ${orderId} status changed to ${newStatus}`,
                totalQuantity,
                totalPrice,
                items: orderToUpdate.products.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                })),
                customerNumber: orderToUpdate?.customerNumber,
                createdAt: Date.now(),
            };

            await axios.post('http://localhost:8000/api/audit', auditLogEntry);
            dispatch(auditActions.addAuditLog(auditLogEntry));

            toast.success(`Order status updated to ${newStatus}`);

            setPendingOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            dispatch(orderActions.removeOrder());

        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Error updating order status');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:8000/api/orders/${orderId}`);
            setPendingOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            toast.success('Order deleted successfully');
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Error deleting order');
        }
    };

    if (loading) {
        return <div>Loading pending orders...</div>;
    }

    if (pendingOrders.length === 0) {
        return <div>No pending delivery orders.</div>;
    }

    console.log("PENDING ORDERSSSSSS", pendingOrders);

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold my-4">Pending Delivery Orders</h1>
            <ul className="space-y-4">
                {pendingOrders.map((order) => (
                    <li key={order._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
                        <div>
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Customer Number: {order?.customerNumber}</strong></p>
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
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => handleDeleteOrder(order._id)}
                            >
                                Delete Order
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PendingDeliveryOrders;
