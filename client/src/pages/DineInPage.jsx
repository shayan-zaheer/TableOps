import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { orderActions } from '../store/orderSlice';

function DineInOrders() {
    const [dineInOrders, setDineInOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [newItems, setNewItems] = useState({}); // State to hold new items for each order

    useEffect(() => {
        const fetchDineInOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/orders/pending-dinein');
                setDineInOrders(response.data);
            } catch (error) {
                console.error('Error fetching dine-in orders:', error);
                toast.error('Error fetching dine-in orders');
            } finally {
                setLoading(false);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products'); // Ensure this endpoint returns the products
                setAvailableProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error fetching products');
            }
        };

        fetchDineInOrders();
        fetchProducts();
    }, []);

    const handleAddItems = async (orderId) => {
        const { product, quantity } = newItems[orderId] || {};

        if (!product || quantity <= 0) {
            toast.error('Please provide a valid item and quantity.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/api/orders/${orderId}/add-items`, { newItems: [{ product, quantity }] });

            // Update dine-in orders with new items
            setDineInOrders((prevOrders) =>
                prevOrders.map(order => (order._id === orderId ? response.data : order))
            );

            toast.success('Items added successfully');
            setNewItems((prev) => ({ ...prev, [orderId]: { product: '', quantity: 1 } })); // Reset the item input for that order
        } catch (error) {
            console.error('Error adding items:', error);
            toast.error('Error adding items to the order');
        }
    };

    const handleItemChange = (orderId, field, value) => {
        setNewItems((prev) => ({
            ...prev,
            [orderId]: { ...(prev[orderId] || {}), [field]: value },
        }));
    };

    if (loading) {
        return <div>Loading dine-in orders...</div>;
    }

    if (dineInOrders.length === 0) {
        return <div>No ongoing dine-in orders.</div>;
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold my-4">Ongoing Dine-In Orders</h1>
            <ul className="space-y-4">
                {dineInOrders.map(order => (
                    <li key={order._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
                        <div>
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Waiter:</strong> {order?.waiter?.name}</p>
                            <p><strong>Products:</strong></p>
                            <ul className="list-disc ml-4">
                                {order.products.map((item, index) => (
                                    <li key={index}>
                                        {item.product.name} - Quantity: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Total Amount:</strong> Rs. {order.totalAmount}</p>
                        </div>
                        <div className="flex space-x-4">
                            <select
                                value={newItems[order._id]?.product || ''}
                                onChange={(e) => handleItemChange(order._id, 'product', e.target.value)}
                                className="border p-1"
                            >
                                <option value="" disabled>Select a product</option>
                                {availableProducts.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newItems[order._id]?.quantity || 1}
                                onChange={(e) => handleItemChange(order._id, 'quantity', parseInt(e.target.value))}
                                className="border p-1 w-20"
                            />
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => handleAddItems(order._id)}
                            >
                                Add Items
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DineInOrders;
