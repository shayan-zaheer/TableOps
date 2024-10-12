function DineInBox() {
    return (
        <li
            key={order._id}
            className="bg-white p-4 shadow rounded flex justify-between items-center"
        >
            <div>
                <p>
                    <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                    <strong>Waiter:</strong> {order?.waiter?.name}
                </p>
                <p>
                    <strong>Products:</strong>
                </p>
                <ul className="list-disc ml-4">
                    {order.products.map((item, index) => (
                        <li key={index}>
                            {item.product?.name} - Quantity: {item.quantity}
                        </li>
                    ))}
                </ul>
                <p>
                    <strong>Total Amount:</strong> Rs. {order.totalAmount}
                </p>
            </div>
            <div className="flex space-x-4">
                <Select
                    isMulti
                    options={products}
                    onChange={(selectedOptions) =>
                        handleItemChange(order._id, selectedOptions)
                    }
                    placeholder="Select or create items..."
                />
                <div>
                    {newItems[order._id]?.map((item) => (
                        <div
                            key={item.product._id}
                            className="flex items-center space-x-2 mt-2"
                        >
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleQuantityChange(
                                        order._id,
                                        item.product._id,
                                        parseInt(e.target.value)
                                    )
                                }
                                className="border p-1 rounded"
                            />
                        </div>
                    ))}
                </div>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => handleAddItems(order._id)}
                    disabled={
                        !newItems[order._id] || newItems[order._id].length === 0
                    }
                >
                    Add Items
                </button>
            </div>
        </li>
    );
}

export default DineInBox;
