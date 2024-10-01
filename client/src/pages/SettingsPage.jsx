import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function AuditLog() {
    const logs = useSelector((store) => store.audit.audit);
    
    const [isOpen, setIsOpen] = useState(false);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    const toggleCollapse = () => {
        setIsOpen((prev) => !prev);
    };

    // Filter logs based on selected month and year
    useEffect(() => {
        if (selectedYear && selectedMonth) {
            const filtered = logs.filter((order) => {
                const orderDate = new Date(order.createdAt); // Assuming logs have 'createdAt' field
                return (
                    orderDate.getFullYear() === parseInt(selectedYear) &&
                    orderDate.getMonth() === parseInt(selectedMonth) - 1
                );
            });
            setFilteredLogs(filtered);
        } else {
            setFilteredLogs(logs);
        }
    }, [selectedYear, selectedMonth, logs]);

    return (
        <div className="p-4 bg-gray-900 rounded-md mt-4"> {/* Darker background to match page */}
            <h2 className="text-xl font-bold text-white">Audit Log</h2> {/* Text color set to white */}

            {/* Dropdowns for Year and Month */}
            <div className="flex space-x-4 mb-4">
                <select
                    className="bg-gray-700 text-white p-2 rounded"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="">Select Year</option>
                    {/* Add options for years */}
                    {[2024, 2023, 2022].map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                <select
                    className="bg-gray-700 text-white p-2 rounded"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">Select Month</option>
                    {/* Add options for months */}
                    {[
                        { name: "January", value: 1 },
                        { name: "February", value: 2 },
                        { name: "March", value: 3 },
                        { name: "April", value: 4 },
                        { name: "May", value: 5 },
                        { name: "June", value: 6 },
                        { name: "July", value: 7 },
                        { name: "August", value: 8 },
                        { name: "September", value: 9 },
                        { name: "October", value: 10 },
                        { name: "November", value: 11 },
                        { name: "December", value: 12 },
                    ].map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={toggleCollapse}
                className="bg-gray-700 text-white cursor-pointer p-4 w-full border-none text-left outline-none text-lg hover:bg-gray-600" // Dark button with hover effect
            >
                {isOpen ? "Hide Logs" : "Show Logs"}
            </button>

            {isOpen && (
                <div className="bg-gray-800 rounded-md p-4"> {/* Adjusted background for the logs */}
                    {filteredLogs.length === 0 ? (
                        <p className="text-gray-300">No audit logs available for this period.</p>
                    ) : (
                        filteredLogs.map((order, index) => (
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
