/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Select from 'react-select/creatable';
import { orderActions } from '../store/orderSlice';

function DineInOrders() {
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
                }));

                setProducts(productOptions);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error fetching products');
            }
        };

        fetchProducts();
    }, []);

    const handleAddItems = async (orderId) => {
        const itemsToAdd = newItems[orderId] || [];
    
        console.log(itemsToAdd);
    
        if (itemsToAdd.length === 0) {
            toast.error('Please select valid items to add.');
            return;
        }
    
        setDineInOrders((prevOrders) =>
            prevOrders.map(order => {
                if (order._id === orderId) {
                    const updatedProducts = [...order.products];
    
                    itemsToAdd.forEach(item => {
                        const existingProduct = updatedProducts.find(
                            product => product.product._id.toString() === item.product
                        );
                        if (existingProduct) {
                            existingProduct.quantity += item.quantity;
                        }
                    });
    
                    // Calculate the total amount
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
            const response = await axios.put(`http://localhost:8000/api/orders/${orderId}/add-items`, { newItems: itemsToAdd });
            toast.success('Items added successfully');
            setNewItems((prev) => ({ ...prev, [orderId]: [] }));
        } catch (error) {
            console.error('Error adding items:', error);
            toast.error('Error adding items to the order');
        }
    };
    

    const handleItemChange = (orderId, selectedOptions) => {
        const items = selectedOptions.map(option => ({
            product: option.value,
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
                    item.product === productId ? { ...item, quantity: newQuantity } : item
                )
            };
        });
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
                            <Select
                                isMulti
                                options={products}
                                onChange={(selectedOptions) => handleItemChange(order._id, selectedOptions)}
                                placeholder="Select or create items..."
                            />
                            <div>
                                {newItems[order._id]?.map(item => (
                                    <div key={item.product} className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(order._id, item.product, parseInt(e.target.value))}
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
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DineInOrders;

*/

/* 

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Select from 'react-select/creatable';
import { orderActions } from '../store/orderSlice';

function DineInOrders() {
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

                console.log(response);

                // const productOptions = response.data.map(product => ({
                //     value: product._id,
                //     label: product.name,
                // }));

                const productOptions = response.data;

                setProducts(productOptions);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error fetching products');
            }
        };

        fetchProducts();
    }, []);

    const handleAddItems = async (orderId) => {
        const itemsToAdd = newItems[orderId] || [];
    
        console.log(itemsToAdd);

        if (itemsToAdd.length === 0) {
            toast.error('Please select valid items to add.');
            return;
        }

        // Update dineInOrders state locally
        setDineInOrders((prevOrders) =>
            prevOrders.map(order => {
                if (order._id === orderId) {
                    const updatedProducts = [...order.products];

                    itemsToAdd.forEach(item => {
                        const existingProduct = updatedProducts.find(
                            product => product.product._id.toString() === item.product
                        );
                        if (existingProduct) {
                            existingProduct.quantity += item.quantity;
                        } else {
                            // If the product doesn't exist, add it to the list
                            updatedProducts.push({ _id: item.product , quantity: item.quantity, price: item.price });
                        }
                    });

                    // Calculate the total amount
                    const totalAmount = updatedProducts.reduce((total, product) => {
                        const productPrice = product.price;
                        return total + (productPrice * product.quantity);
                    }, 0);

                    console.log(updatedProducts);

                    return { ...order, products: updatedProducts, totalAmount };
                }
                return order;
            })
        );

        try {
            const response = await axios.put(`http://localhost:8000/api/orders/${orderId}/add-items`, { newItems: itemsToAdd });
            toast.success('Items added successfully');
            setNewItems((prev) => ({ ...prev, [orderId]: [] }));
        } catch (error) {
            console.error('Error adding items:', error);
            toast.error('Error adding items to the order');
        }
    };

    // const handleItemChange = (orderId, selectedOptions) => {
    //     const items = selectedOptions.map(option => ({
    //         product: option.value,
    //         quantity: 1
    //     }));
        
    //     setNewItems((prev) => ({
    //         ...prev,
    //         [orderId]: items
    //     }));
    // };

    const handleItemChange = (orderId, selectedOptions) => {
        const items = selectedOptions.map(option => {
            const product = products.find(p => p.value === option.value);
            return {
                product: {
                    _id: product.value,
                    name: product.label,
                    price: product.price
                },
                quantity: 1 // Default quantity
            };
        });
    
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
                    item.product === productId ? { ...item, quantity: newQuantity } : item
                )
            };
        });
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
                            <Select
                                isMulti
                                options={products}
                                onChange={(selectedOptions) => handleItemChange(order._id, selectedOptions)}
                                placeholder="Select or create items..."
                            />
                            <div>
                                {newItems[order._id]?.map(item => (
                                    <div key={item.product} className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(order._id, item.product, parseInt(e.target.value))}
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
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DineInOrders;

*/

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useDispatch } from 'react-redux';
// import Select from 'react-select/creatable';
// import { orderActions } from '../store/orderSlice';

// function DineInOrders() {
//     const [dineInOrders, setDineInOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [products, setProducts] = useState([]);
//     const [newItems, setNewItems] = useState({});
//     const dispatch = useDispatch();

//     console.log(dineInOrders);

//     useEffect(() => {
//         const fetchDineInOrders = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/api/orders/pending-dinein');
//                 setDineInOrders(response.data);
//             } catch (error) {
//                 console.error('Error fetching dine-in orders:', error);
//                 toast.error('Error fetching dine-in orders');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDineInOrders();
//     }, []);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/api/products');

//                 const productOptions = response.data.map(product => ({
//                     value: product._id,
//                     label: product.name,
//                     price: product.price // Include price in options
//                 }));

//                 setProducts(productOptions);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//                 toast.error('Error fetching products');
//             }
//         };

//         fetchProducts();
//     }, []);

//     const handleAddItems = async (orderId) => {
//         const itemsToAdd = newItems[orderId] || [];

//         if (itemsToAdd.length === 0) {
//             toast.error('Please select valid items to add.');
//             return;
//         }

//         // Update dineInOrders state locally
//         setDineInOrders((prevOrders) =>
//             prevOrders.map(order => {
//                 if (order._id === orderId) {
//                     const updatedProducts = [...order.products];

//                     itemsToAdd.forEach(item => {
//                         const existingProduct = updatedProducts.find(
//                             product => product.product._id.toString() === item.product._id.toString()
//                         );
//                         if (existingProduct) {
//                             existingProduct.quantity += item.quantity;
//                         } else {
//                             // If the product doesn't exist, add it to the list
//                             updatedProducts.push({ _id: item.product._id, quantity: item.quantity, price: item.product.price });
//                         }
//                     });

//                     // Calculate the total amount
//                     const totalAmount = updatedProducts.reduce((total, product) => {
//                         const productPrice = product.price;
//                         return total + (productPrice * product.quantity);
//                     }, 0);

//                     return { ...order, products: updatedProducts, totalAmount };
//                 }
//                 return order;
//             })
//         );

//         try {
//             const response = await axios.put(`http://localhost:8000/api/orders/${orderId}/add-items`, { newItems: itemsToAdd });
//             toast.success('Items added successfully');
//             setNewItems((prev) => ({ ...prev, [orderId]: [] }));
//         } catch (error) {
//             console.error('Error adding items:', error);
//             toast.error('Error adding items to the order');
//         }
//     };

//     const handleItemChange = (orderId, selectedOptions) => {
//         const items = selectedOptions.map(option => ({
//             product: {
//                 _id: option.value,
//                 name: option.label,
//                 price: option.price // Use price from selected option
//             },
//             quantity: 1 // Default quantity
//         }));

//         setNewItems((prev) => ({
//             ...prev,
//             [orderId]: items
//         }));
//     };

//     const handleQuantityChange = (orderId, productId, newQuantity) => {
//         setNewItems((prev) => {
//             const items = prev[orderId] || [];
//             return {
//                 ...prev,
//                 [orderId]: items.map(item =>
//                     item.product._id === productId ? { ...item, quantity: newQuantity } : item
//                 )
//             };
//         });
//     };

//     if (loading) {
//         return <div>Loading dine-in orders...</div>;
//     }

//     if (dineInOrders.length === 0) {
//         return <div>No ongoing dine-in orders.</div>;
//     }

//     return (
//         <div className="container mx-auto">
//             <h1 className="text-2xl font-bold my-4">Ongoing Dine-In Orders</h1>
//             <ul className="space-y-4">
//                 {dineInOrders.map(order => (
//                     <li key={order._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
//                         <div>
//                             <p><strong>Order ID:</strong> {order._id}</p>
//                             <p><strong>Waiter:</strong> {order?.waiter?.name}</p>
//                             <p><strong>Products:</strong></p>
//                             <ul className="list-disc ml-4">
//                                 {order.products.map((item, index) => (
//                                     <li key={index}>
//                                         {item.product?.name} - Quantity: {item.quantity}
//                                     </li>
//                                 ))}
//                             </ul>
//                             <p><strong>Total Amount:</strong> Rs. {order.totalAmount}</p>
//                         </div>
//                         <div className="flex space-x-4">
//                             <Select
//                                 isMulti
//                                 options={products}
//                                 onChange={(selectedOptions) => handleItemChange(order._id, selectedOptions)}
//                                 placeholder="Select or create items..."
//                             />
//                             <div>
//                                 {newItems[order._id]?.map(item => (
//                                     <div key={item.product._id} className="flex items-center space-x-2 mt-2">
//                                         <input
//                                             type="number"
//                                             min="1"
//                                             value={item.quantity}
//                                             onChange={(e) => handleQuantityChange(order._id, item.product._id, parseInt(e.target.value))}
//                                             className="border p-1 rounded"
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                             <button
//                                 className="bg-green-500 text-white px-4 py-2 rounded"
//                                 onClick={() => handleAddItems(order._id)}
//                                 disabled={!newItems[order._id] || newItems[order._id].length === 0}
//                             >
//                                 Add Items
//                             </button>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default DineInOrders;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Select from 'react-select/creatable';
import { orderActions } from '../store/orderSlice';

function DineInOrders() {
    const [dineInOrders, setDineInOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [newItems, setNewItems] = useState({});
    const dispatch = useDispatch();

    console.log(dineInOrders);

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
                    price: product.price // Include price in options
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
        return response.data; // Return the complete product details
    };

    const handleAddItems = async (orderId) => {
        const itemsToAdd = newItems[orderId] || [];

        if (itemsToAdd.length === 0) {
            toast.error('Please select valid items to add.');
            return;
        }

        // Fetch and populate product details
        const populatedItems = await Promise.all(
            itemsToAdd.map(async item => {
                if (!item.product) {
                    const productDetails = await fetchProductById(item.product._id);
                    return { ...item, product: productDetails }; // Populate the product details
                }
                return item; // Return existing product
            })
        );

        // Update dineInOrders state locally
        setDineInOrders((prevOrders) =>
            prevOrders.map(order => {
                if (order._id === orderId) {
                    const updatedProducts = [...order.products];

                    populatedItems.forEach(item => {
                        const existingProduct = updatedProducts.find(
                            product => product.product._id.toString() === item.product._id.toString()
                        );
                        if (existingProduct) {
                            existingProduct.quantity += item.quantity;
                        } else {
                            // If the product doesn't exist, add it to the list
                            updatedProducts.push({
                                product: item.product,
                                quantity: item.quantity,
                                _id: item.product._id // Assuming you need to keep track of IDs
                            });
                        }
                    });

                    // Calculate the total amount
                    const totalAmount = updatedProducts.reduce((total, product) => {
                        const productPrice = product.product.price; // Use product.price from populated details
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
        const items = selectedOptions.map(option => ({
            product: {
                _id: option.value,
                name: option.label,
                price: option.price // Use price from selected option
            },
            quantity: 1 // Default quantity
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
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DineInOrders;



/*

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Select from 'react-select/creatable'; // Use creatable for tagging
import { orderActions } from '../store/orderSlice';

function DineInOrders() {
    const [dineInOrders, setDineInOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [newItems, setNewItems] = useState({});
    const dispatch = useDispatch();

    // Fetch dine-in orders
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

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products');
                const productOptions = response.data.map(product => ({
                    value: product._id,
                    label: product.name,
                    price: product.price // Include the price
                }));

                console.log(productOptions);
                setProducts(productOptions);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error fetching products');
            }
        };

        fetchProducts();
    }, []);

    const handleAddItems = async (orderId) => {
        const itemsToAdd = newItems[orderId] || [];

        console.log(itemsToAdd);

        if (itemsToAdd.length === 0) {
            toast.error('Please select valid items to add.');
            return;
        }

        // Optimistically update the UI
        const updatedOrders = dineInOrders.map(order => {
            if (order._id === orderId) {
                const updatedProducts = [...order.products];

                itemsToAdd.forEach(item => {
                    const existingProduct = updatedProducts.find(
                        product => product.product._id.toString() === item.product
                    );

                    if (existingProduct) {
                        // Update existing product quantity
                        existingProduct.quantity += item.quantity;
                    } else {
                        // Find the selected product to get its details
                        const productDetails = products.find(prod => prod.value === item.product);

                        if (productDetails) {
                            updatedProducts.push({
                                product: {
                                    _id: productDetails.value,
                                    name: productDetails.label,
                                    price: productDetails.price, // Use the fetched price
                                },
                                quantity: item.quantity,
                            });
                        }
                    }
                });

                // Calculate the total amount
                const totalAmount = updatedProducts.reduce((total, product) => {
                    const productPrice = product.product.price || 0; // Default to 0 if price not available
                    return total + (productPrice * product.quantity);
                }, 0);

                return { ...order, products: updatedProducts, totalAmount };
            }
            return order;
        });

        setDineInOrders(updatedOrders);

        try {
            const response = await axios.put(`http://localhost:8000/api/orders/${orderId}/add-items`, { newItems: itemsToAdd });
            
            // Update the dineInOrders state with the complete order returned from the server
            setDineInOrders((prevOrders) =>
                prevOrders.map(order => (order._id === orderId ? response.data : order))
            );

            toast.success('Items added successfully');
            setNewItems((prev) => ({ ...prev, [orderId]: [] }));
        } catch (error) {
            console.error('Error adding items:', error);
            toast.error('Error adding items to the order');
        }
    };

    const handleItemChange = (orderId, selectedOptions) => {
        const items = selectedOptions.map(option => ({
            product: option.value,
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
                    item.product === productId ? { ...item, quantity: newQuantity } : item
                )
            };
        });
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
                    <li key={order._id} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                        <div className="flex flex-col space-y-2">
                            {order.products.map(product => (
                                <div key={product.product._id} className="flex justify-between">
                                    <span>{product.product.name}</span>
                                    <span>{product.quantity} x {product.product.price} = {product.quantity * product.product.price}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold">
                                <span>Total Amount:</span>
                                <span>{order.totalAmount}</span>
                            </div>
                        </div>
                        <Select
                            isMulti
                            options={products}
                            onChange={selectedOptions => handleItemChange(order._id, selectedOptions)}
                            placeholder="Add Items"
                        />
                        <button onClick={() => handleAddItems(order._id)} className="bg-blue-500 text-white py-1 px-4 mt-2 rounded">
                            Add Items
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DineInOrders;

*/