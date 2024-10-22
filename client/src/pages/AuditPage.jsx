import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { auditActions } from "../store/auditSlice";

function AuditPage() {
    const dispatch = useDispatch();
    const logs = useSelector((store) => store.audit.audit);
    
    const [isOpen, setIsOpen] = useState(false);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");

    useEffect(() => {
        const getLogs = async () => {
            try {
                const result = await axios.get("http://localhost:8000/api/audit");
                dispatch(auditActions.initialAddAudits(result?.data?.data));
            } catch(err) {
                console.error(err);
            }
        };

        getLogs();
    }, [dispatch]);

    const toggleCollapse = () => {
        setIsOpen((prev) => !prev);
    };
        
    const printReceipts = (orderId) => {
        const categoriesMap = {};
    
        const selectedAudit = filteredLogs.find(audit => audit.order._id === orderId);
    
        if (!selectedAudit) {
            console.error("No audit found for the given order ID.");
            return;
        }
    
        const products = selectedAudit.order.products;
    
        products.forEach(item => {
            const productCategory = item.product.category.title;
  
            if (!categoriesMap[productCategory]) {
                categoriesMap[productCategory] = {
                    category: productCategory,
                    items: [],
                    totalAmount: 0
                };
            }
 
            categoriesMap[productCategory].items.push(item);
            categoriesMap[productCategory].totalAmount += item.product.price * item.quantity;
        });
    
        let printContent = `
            <div style="display: flex; align-items: center;">
                <img src="/images/logo.png" alt="Logo" style="height: 50px; margin-right: 10px;" />
                <h1>Order ID: ${orderId}</h1>
            </div>`;

        if (selectedAudit.order.type === "dinein") {
            const waiterName = selectedAudit.order.waiter?.name || "N/A";
            printContent += `<p>Waiter: ${waiterName}</p>`;
        } else if(selectedAudit.order.type === "delivery"){

            const riderName = selectedAudit.order.rider?.name || "N/A";
            const customerNumber = selectedAudit.order?.customerNumber || "N/A";
            printContent += `<p>Rider: ${riderName}</p>
                            <p>Customer Number: ${customerNumber}</p>
            `
        };
    
        Object.values(categoriesMap).forEach(categoryData => {
            const { category, items, totalAmount } = categoryData;
    
            printContent += `
                <div class="receipt">
                    <h2>${category} Receipt (Order ID: ${orderId})</h2> <!-- Order ID in each category -->
                    <ul>
                        ${items.map(item => `
                            <li>
                                ${item.product.name} (x${item.quantity}) - ${item.product.price * item.quantity} PKR
                            </li>
                        `).join('')}
                    </ul>
                    <h3>Total: ${totalAmount} PKR</h3>
                </div>
                <hr class="dotted-line" />
            `;
        });
    
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Receipts</title>
                    <style>
                        .receipt {
                            font-family: Arial, sans-serif;
                            margin-bottom: 20px;
                        }
                        h1, h2 {
                            margin: 0;
                        }
                        h3 {
                            margin: 10px 0;
                        }
                        img {
                            max-height: 50px;
                        }
                        /* Add dotted lines between sections */
                        .dotted-line {
                            border: none;
                            border-top: 2px dotted black;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                    <h4>Developed by Sajjad/Shayan Zaheer</h4>
                    <h4>Contact: +92 336 2199705
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
    
    useEffect(() => {
        let filtered = logs;

        if (selectedYear) {
            filtered = filtered.filter((order) => {
                const orderDate = new Date(order.order.createdAt);
                return orderDate.getFullYear() === parseInt(selectedYear);
            });
        }

        if (selectedMonth) {
            filtered = filtered.filter((order) => {
                const orderDate = new Date(order.order.createdAt);
                return orderDate.getMonth() === parseInt(selectedMonth) - 1;
            });
        }

        if (selectedDay) {
            filtered = filtered.filter((order) => {
                const orderDate = new Date(order.order.createdAt);
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
                                key={order.order._id}
                                className="px-4 py-4 overflow-hidden bg-[rgb(255,206,146)] mb-2 rounded"
                            >
                                <p className="float-right font-normal text-black">{new Date(order.createdAt).toLocaleTimeString()}</p>
                                <h3 className="font-bold text-black">Order {order.order._id}</h3>
                                <p className="text-black">Total Amount: Rs. {order.order.totalAmount}</p>
                                
                                <button
                                    onClick={() => printReceipts(order.order._id)}
                                    className="mt-2 float-right bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Print Receipts
                                </button>   

                                {order?.order?.type === "delivery" && (
                                   <>
                                     <p className="text-black">Rider: <i>{order?.order?.rider?.name}</i></p>
                                     <p className="text-black">Customer Number: <i>{order?.order?.customerNumber}</i></p> 
                                   </> 
                                )}

                                {order?.order?.type === "dinein" && (
                                    <p className="text-black">Waiter: {order?.order?.waiter?.name}</p>  
                                )}
                                
                                <h4 className="font-semibold text-black">Items:</h4>
                                {order.order.products.map((item, idx) => (
                                    <p key={idx} className="text-black">
                                        {item.product.name} (Quantity: {item.quantity})
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

export default AuditPage;
