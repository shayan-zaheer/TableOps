import { useSelector } from "react-redux";
import { useState } from "react";

function AuditLog() {
    const logs = useSelector((store) => store.audit.audit);

    const [isOpen, setIsOpen] = useState(false);

    const toggleCollapse = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="p-4 bg-gray-900 rounded-md mt-4"> {/* Darker background to match page */}
            <h2 className="text-xl font-bold text-white">Audit Log</h2> {/* Text color set to white */}
            <button
                onClick={toggleCollapse}
                className="bg-gray-700 text-white cursor-pointer p-4 w-full border-none text-left outline-none text-lg hover:bg-gray-600" // Dark button with hover effect
            >
                {isOpen ? "Hide Logs" : "Show Logs"}
            </button>
            {isOpen && (
                <div className="bg-gray-800 rounded-md p-4"> {/* Adjusted background for the logs */}
                    {logs.length === 0 ? (
                        <p className="text-gray-300">No audit logs available.</p>
                    ) : (
                        logs.map((order, index) => (
                            <div
                                key={index}
                                className="px-4 py-4 overflow-hidden bg-gray-700 mb-2 rounded"
                            >
                                <h3 className="font-bold text-white">Order {index + 1}</h3>
                                <p className="text-gray-300">Total Quantity: {order.totalQuantity}</p>
                                <p className="text-gray-300">Total Price: Rs. {order.totalPrice}</p>
                                <h4 className="font-semibold text-white">Items:</h4>
                                {order.items.map((item, idx) => (
                                    <p key={idx} className="text-gray-300">
                                        {item.name} (Quantity: {item.quantity})
                                    </p>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default AuditLog;
