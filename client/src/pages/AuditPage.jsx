import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { auditActions } from "../store/auditSlice";

function AuditPage() {
    const dispatch = useDispatch();
    const logs = useSelector((store) => store.audit.audit);

    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedFood, setSelectedFood] = useState(""); 

    useEffect(() => {
        const getLogs = async () => {
            try {
                const result = await axios.get("http://localhost:8000/api/audit");
                dispatch(auditActions.initialAddAudits(result?.data?.data));
            } catch (err) {
                console.error(err);
            }
        };

        getLogs();
    }, [dispatch]);

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

    const printReceipts = (orderId) => {
        const categoriesMap = {};
        
        const selectedAudit = filteredLogs.find((audit) => audit?.order?._id === orderId);
    
        if (!selectedAudit) {
            console.error("No audit found for the given order ID.");
            return;
        }
    
        const products = selectedAudit?.order?.products || [];
    
        products.forEach((item) => {
            const productCategory = item.product.category.title;
            
            if (!categoriesMap[productCategory]) {
                categoriesMap[productCategory] = {
                    category: productCategory,
                    items: [],
                    totalAmount: 0,
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
    
        if (selectedAudit?.order?.type === "dinein") {
            const waiterName = selectedAudit?.order?.waiter?.name || "N/A";
            printContent += `<p>Waiter: ${waiterName}</p>`;
        } else if (selectedAudit?.order?.type === "delivery") {
            const riderName = selectedAudit?.order?.rider?.name || "N/A";
            const customerNumber = selectedAudit?.order?.customerNumber || "N/A";
            printContent += `<p>Rider: ${riderName}</p>
                            <p>Customer Number: ${customerNumber}</p>`;
        }
    
        let totalOrderAmount = 0;
        Object.values(categoriesMap).forEach((categoryData) => {
            const { category, items, totalAmount } = categoryData;
    
            totalOrderAmount += totalAmount;
    
            printContent += `
                <div class="receipt">
                    <h2>${category} Receipt (Order ID: ${orderId})</h2>
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
                        @media print {
                            @page {
                                size: 80mm 210mm; 
                                margin: 0; 
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                width: 80mm; 
                                height: auto; 
                                font-size: 10px; 
                                font-family: Arial, sans-serif;
                            }
                            .receipt {
                                width: 100%; 
                                margin: 0;
                                padding: 5px; 
                            }
                            h2 {
                                font-size: 12px;
                                margin: 0;
                                text-align: center;
                            }
                            ul {
                                list-style-type: none;
                                padding: 0;
                                margin: 0;
                            }
                            li {
                                margin: 3px 0;
                                font-size: 10px;
                            }
                            h3 {
                                font-size: 10px;
                                margin: 5px 0;
                                text-align: right;
                            }
                            .dotted-line {
                                border: none;
                                border-top: 1px dotted black;
                                margin: 5px 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                    <h4>Total Order Amount: ${totalOrderAmount} PKR</h4>
                    <hr class="dotted-line" />
                    <h4>Designed and Developed by IdeaFlux Agency</h4>
                    <h4>Contact No +92336-2199705</h4>
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

        if (selectedType) {
            filtered = filtered.filter((order) => order.order.type === selectedType);
        }

        if (selectedFood) {
            filtered = filtered.filter((order) => 
                order?.order?.products?.find((product) => product?.product?.name === selectedFood)
            );
        }
        
        setFilteredLogs(filtered);
    }, [selectedYear, selectedMonth, selectedDay, selectedType, selectedFood, logs]);

    console.log(filteredLogs)

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
                    {[2026, 2025, 2024].map((year) => (
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

                <select
                    className="bg-[rgb(255,206,146)] text-black p-2 rounded"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="">Select Order Type</option>
                    <option value="dinein">Dine In</option>
                    <option value="delivery">Delivery</option>
                    <option value="takeaway">Takeaway</option>
                </select>

                <select
                    value={selectedFood}
                    className="bg-[rgb(255,206,146)] text-black p-2 rounded"
                    onChange={e => setSelectedFood(e.target.value)}
                >
                    <option value="">Select Food Item</option>
                    {products.map(product => (
                        <option key={product._id} value={product.label}>{product.label}</option>
                    ))}
                </select>

            </div>

            <table className="table-auto w-full">
                <thead>
                    <tr className="text-left bg-[rgb(255,206,146)] text-black">
                        <th className="p-2">Order ID</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.map((audit) => (
                        <tr key={audit.order?._id} className="border-b">
                            <td className="p-2">{audit.order?._id || "N/A"}</td>
                            <td className="p-2">Rs. {audit?.order?.totalAmount}</td>
                            <td className="p-2">{new Date(audit.order?.createdAt).toLocaleString() || "N/A"}</td>
                            <td className="p-2">{audit.order?.type || "N/A"}</td>
                            <td className="p-2">
                                <button
                                    onClick={() => printReceipts(audit.order?._id)}
                                    className="bg-white text-black px-2 py-1 rounded"
                                >
                                    Print
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AuditPage;
