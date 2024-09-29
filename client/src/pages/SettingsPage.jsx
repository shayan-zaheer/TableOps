import { useSelector } from "react-redux";
import { useState } from "react";

function AuditLog() {
    const logs = useSelector((store) => store.audit.audit);

    const [isOpen, setIsOpen] = useState(false);

    const toggleCollapse = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="p-4 bg-gray-200 rounded-md mt-4">
            <h2 className="text-xl font-bold">Audit Log</h2>
            <button
                onClick={toggleCollapse}
                className="bg-[#eee] text-[#444] cursor-pointer p-4 w-full border-none text-left outline-none text-lg hover:bg-[#ccc]"
            >
                {isOpen ? "Hide Logs" : "Show Logs"}
            </button>
            {isOpen && (
                <div className="bg-gray-300 rounded-md p-2">
                    {logs.length === 0 ? (
                        <p>No audit logs available.</p>
                    ) : (
                        logs.map((order, index) => (
                            <div
                                key={index}
                                className="px-0 py-4 overflow-hidden bg-[#f1f1f1] mb-2 rounded"
                            >
                                <h3 className="font-bold">Order {index + 1}</h3>
                                <p>Total Quantity: {order.totalQuantity}</p>
                                <p>Total Price: Rs. {order.totalPrice}</p>
                                <h4 className="font-semibold">Items:</h4>
                                {order.items.map((item, idx) => (
                                    <p key={idx}>
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
