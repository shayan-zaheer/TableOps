import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function AuditLog() {
    const logs = useSelector((store) => store.audit.audit);
    
    const [isOpen, setIsOpen] = useState(false);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");

    console.log("DB LOGS:", logs);
    console.log(filteredLogs);

    const toggleCollapse = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        let filtered = logs;

        if (selectedYear) {
            filtered = filtered.filter((order) => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getFullYear() === parseInt(selectedYear);
            });
        }

        if (selectedMonth) {
            filtered = filtered.filter((order) => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getMonth() === parseInt(selectedMonth) - 1;
            });
        }

        if (selectedDay) {
            filtered = filtered.filter((order) => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getDate() === parseInt(selectedDay);
            });
        }

        setFilteredLogs(filtered);
    }, [selectedYear, selectedMonth, selectedDay, logs]);

    return (
        <div className="p-4 bg-[rgb(207,156,90)] rounded-md mt-4">
            <h2 className="text-xl font-bold text-white">Audit Log</h2>

            <div className="flex space-x-4 mb-4">
                <select
                    className="bg-[rgb(255,206,146)] text-black p-2 rounded" 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="">Select Year</option>
                    {[2024, 2023, 2022].map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                <select
                    className="bg-[rgb(255,206,146)] text-black p-2 rounded" 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">Select Month</option>
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

                <select
                    className="bg-[rgb(255,206,146)] text-black p-2 rounded"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                >
                    <option value="">Select Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={toggleCollapse}
                className="bg-[rgb(255,206,146)] text-black cursor-pointer p-4 w-full border-none text-left outline-none text-lg hover:bg-[rgb(207,156,90)]"
            >
                {isOpen ? "Hide Logs" : "Show Logs"}
            </button>

            {isOpen && (
                <div className="bg-[rgb(207,156,90)] rounded-md p-4">
                    {filteredLogs.length === 0 ? (
                        <p className="text-gray-900">No audit logs available for this period.</p>
                    ) : (
                        filteredLogs.map((order, index) => (
                            <div
                                key={index}
                                className="px-4 py-4 overflow-hidden bg-[rgb(255,206,146)] mb-2 rounded"
                            >
                                <h3 className="font-bold text-black">Order {index + 1}</h3>
                                <p className="text-black">Total Quantity: {order.totalQuantity}</p>
                                <p className="text-black">Total Price: Rs. {order.totalPrice}</p>
                                <h4 className="font-semibold text-black">Items:</h4>
                                {order.items.map((item, idx) => (
                                    <p key={idx} className="text-black">
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
