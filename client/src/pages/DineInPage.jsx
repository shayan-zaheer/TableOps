import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Select from 'react-select/creatable';
import { orderActions } from '../store/orderSlice';
import { auditActions } from '../store/auditSlice';
import LoadingSpinner from '../components/LoadingSpinner';

function DineInPage() {
    const [dineInOrders, setDineInOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [newItems, setNewItems] = useState({});
    const dispatch = useDispatch();

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

        fetchDineInOrders();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products');
                const productOptions = response.data.map(product => ({
                    value: product._id,
                    label: product.name,
                    price: product.price,
                    category: product.category
                }));

                setProducts(productOptions);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error fetching products');
            }
        };

        fetchProducts();
    }, []);

    const fetchProductById = async (id) => {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        return response.data;
    };

    const handleAddItems = async (orderId) => {
        const itemsToAdd = newItems[orderId] || [];
    
        if (itemsToAdd.length === 0) {
            toast.error('Please select valid items to add.');
            return;
        }
    
        const populatedItems = await Promise.all(
            itemsToAdd.map(async item => {
                if (!item.product) {
                    const productDetails = await fetchProductById(item.product._id);
                    return { ...item, product: productDetails };
                }
                return item;
            })
        );

        setDineInOrders((prevOrders) =>
            prevOrders.map(order => {
                if (order._id === orderId) {
                    const updatedProducts = [...order.products];
    
                    populatedItems.forEach(item => {
                        const existingProductIndex = updatedProducts.findIndex(
                            product => product.product._id.toString() === item.product._id.toString()
                        );
    
                        if (existingProductIndex !== -1) {
                            updatedProducts[existingProductIndex].quantity += item.quantity;
                        } else {
                            updatedProducts.push({
                                product: item.product,
                                quantity: item.quantity,
                                _id: item.product._id
                            });
                        }
                    });
    
                    const totalAmount = updatedProducts.reduce((total, product) => {
                        const productPrice = product.product.price;
                        return total + (productPrice * product.quantity);
                    }, 0);
    
                    return { ...order, products: updatedProducts, totalAmount };
                }
                return order;
            })
        );
    
        try {
            const response = await axios.put(`http://localhost:8000/api/orders/${orderId}/add-items`, { newItems: populatedItems });
            toast.success('Items added successfully');
            setNewItems((prev) => ({ ...prev, [orderId]: [] }));
        } catch (error) {
            console.error('Error adding items:', error);
            toast.error('Error adding items to the order');
        }
    };



    const handleItemChange = (orderId, selectedOptions) => {

        console.log(selectedOptions);

        const items = selectedOptions.map(option => ({
            product: {
                _id: option.value,
                name: option.label,
                price: option.price,
                category: option?.category?.title
            },
            quantity: 1
        }));

        setNewItems((prev) => ({
            ...prev,
            [orderId]: items
        }));
    };

    const handleQuantityChange = (orderId, productId, newQuantity) => {
        setNewItems((prev) => {
            const items = prev[orderId] || [];
            return {
                ...prev,
                [orderId]: items.map(item =>
                    item.product._id === productId ? { ...item, quantity: newQuantity } : item
                )
            };
        });
    };

    const handleMarkAsCompleted = async (orderId, newStatus) => {
        try {
            const orderToUpdate = dineInOrders.find(order => order._id === orderId);
            const totalQuantity = orderToUpdate.products.reduce((total, product) => total + product.quantity, 0);
            const totalPrice = orderToUpdate.products.reduce((total, product) => total + (product.product.price * product.quantity), 0);

            const auditLogEntry = {
                orderId,
                action: `Order ${orderId} status changed to ${newStatus}`,
                totalQuantity,
                totalPrice,
                items: orderToUpdate.products.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                })),
                orderNumber: orderToUpdate?.orderNumber,
                createdAt: Date.now(),
            };

            await axios.post('http://localhost:8000/api/audit', auditLogEntry);

            dispatch(auditActions.addAuditLog(auditLogEntry));

            await axios.put(`http://localhost:8000/api/orders/${orderId}/update-status`, { status: newStatus });

            toast.success(`Order status updated to ${newStatus}`);
            setDineInOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));

            dispatch(orderActions.removeOrder());
        } catch (error) {
            console.error('Error marking order as completed:', error);
            toast.error('Error marking order as completed');
        }
    };

    const printTokenByCategory = (order) => {
            const groupedItems = order.products.reduce((acc, item) => {
            const category = item?.product?.category?.title || item?.product?.category || 'Uncategorized';
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
            tokenWindow.document.write(`<h2>Order Number: ${order?.orderNumber}</h2>`);
            tokenWindow.document.write(`<p>Waiter: ${order?.waiter?.name || 'Unknown'}</p>`);
            
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

    if (dineInOrders.length === 0) {
        return <div className='h-screen bg-[rgb(218,174,120)]'>No ongoing dine-in orders.</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-[rgb(218,174,120)] px-5">
            <h1 className="text-2xl font-bold my-4">Ongoing Dine-In Orders</h1>
            <ul className="space-y-4">
                {dineInOrders.map(order => (
                    <li key={order._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
                        <div>
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Order Number:</strong> {order?.orderNumber}</p>
                            <p><strong>Waiter:</strong> <b>{order?.waiter?.name}</b></p>
                            <p><strong>Products:</strong></p>
                            <ul className="list-disc ml-4">
                                {order.products.map((item, index) => (
                                    <li key={index}>
                                        {item.product?.name} - Quantity: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Total Amount:</strong> Rs. {order.totalAmount}</p>
                        </div>
                        <div className="flex space-x-4">
                            <Select
                                isMulti
                                options={products}
                                onChange={(selectedOptions) => handleItemChange(order._id, selectedOptions)}
                                placeholder="Select or create items..."
                            />
                            <div>
                                {newItems[order._id]?.map(item => (
                                    <div key={item.product._id} className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(order._id, item.product._id, parseInt(e.target.value))}
                                            className="border p-1 rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => handleAddItems(order._id)}
                                disabled={!newItems[order._id] || newItems[order._id].length === 0}
                            >
                                Add Items
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => handleMarkAsCompleted(order._id, "Completed")}
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

export default DineInPage;