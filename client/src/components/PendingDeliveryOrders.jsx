import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { orderActions } from '../store/orderSlice';
import { auditActions } from '../store/auditSlice';
import LoadingSpinner from './LoadingSpinner';

function PendingDeliveryOrders() {
    const dispatch = useDispatch();
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log(pendingOrders);

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

    const printTokenByCategory = (order) => {
        console.log("REALEST", order);
    
        const groupedItems = order.products.reduce((acc, item) => {
            const category = item?.product?.category?.title || 'Uncategorized';
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
    
            tokenWindow.document.write(`<html><head><title>${category} Token for Order ${order._id}</title>`);
            tokenWindow.document.write('</head><body>');
            tokenWindow.document.write(`<h1>${category} Receipt for Order ID: ${order._id}</h1>`);
            tokenWindow.document.write(`<p>Rider: ${order?.rider?.name || 'Unknown'}</p>`);
            
            items.forEach(item => {
                tokenWindow.document.write(`<p>${item.product.name} - Quantity: ${item.quantity}</p>`);
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
    

    if (loading) {
        return <LoadingSpinner />;
    }

    if (pendingOrders.length === 0) {
        return <div>No pending delivery orders.</div>;
    }

    console.log("PENDING:", pendingOrders);

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold my-4">Pending Delivery Orders</h1>
            <ul className="space-y-4">
                {pendingOrders.map((order) => (
                    <li key={order._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
                        <div>
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Customer Number:</strong> {order?.customerNumber}</p>
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
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => printTokenByCategory(order)}
                            >
                                Print Token
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PendingDeliveryOrders;
