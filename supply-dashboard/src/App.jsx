import React, { useState, useEffect, useMemo } from 'react';
import { Truck, Package, Factory, Users, List, Home, BarChart2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// --- Configuration Constants ---
// NOTE: Make sure your Spring Boot backend is running on port 8080
const BASE_URL = 'http://localhost:8080/api';
const LOW_STOCK_THRESHOLD = 20;

// --- Utility Functions ---

/**
 * Custom fetch function with retry logic for network resilience.
 */
const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Attempt ${i + 1} failed for ${url}:`, error.message);
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            } else {
                throw new Error(`Failed to fetch ${url}. Failed to connect/No response. Please check backend server status and CORS configuration.`);
            }
        }
    }
};

// --- Reusable Components ---

/**
 * Displays key metric data in the dark-themed card format.
 * The card design is inspired by the uploaded image.
 */
const MetricCard = ({ title, value, icon: Icon, color, details = null, alert = false }) => (
    <div className={`p-5 rounded-xl shadow-xl transition-all duration-300 border-2 ${alert ? 'bg-red-800/50 border-red-700 hover:border-red-500' : 'bg-indigo-800 border-indigo-700 hover:border-indigo-500'}`}>
        <div className="flex items-center justify-between">
            <h2 className="text-lg text-indigo-300 font-semibold uppercase">{title}</h2>
            <Icon className={`w-6 h-6 ${color} opacity-70`} />
        </div>
        <div className="mt-2 flex items-baseline">
            <p className="text-4xl font-extrabold text-white">
                {value.toLocaleString()}
            </p>
            {details && (
                <p className="ml-2 text-sm text-indigo-400">
                    {details}
                </p>
            )}
        </div>
        {alert && (
            <div className="mt-3 flex items-center text-red-300">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">Attention Required</span>
            </div>
        )}
    </div>
);

/**
 * Displays a badge for table status columns, styled for the dark theme.
 */
const StatusBadge = ({ status, type = 'status' }) => {
    let colorClasses = '';
    let bgColor = '';
    switch (type === 'stock' ? status : status.toLowerCase()) {
        case 'delivered':
        case 'high':
            colorClasses = 'text-green-300';
            bgColor = 'bg-green-800';
            break;
        case 'shipped':
        case 'medium':
            colorClasses = 'text-yellow-300';
            bgColor = 'bg-yellow-800';
            break;
        case 'processing':
        case 'low':
            colorClasses = 'text-red-300';
            bgColor = 'bg-red-800';
            break;
        default:
            colorClasses = 'text-gray-300';
            bgColor = 'bg-gray-700';
    }
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClasses} ${bgColor}`}>
            {status}
        </span>
    );
};

/**
 * Reusable component for rendering any data table (dark theme).
 */
const CrudTableView = ({ title, data, headers }) => {
    const isMobile = window.innerWidth < 768;

    return (
        <div className="min-h-full bg-gray-800 p-4 md:p-8 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 border-b border-indigo-700 pb-2">{title}</h2>
            {data.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <List className="w-10 h-10 mx-auto mb-4" />
                    <p className="text-lg">No {title.toLowerCase()} data available. (Is the backend running?)</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                {headers.map((header, index) => (
                                    <th
                                        key={index}
                                        className={`px-4 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider ${isMobile && index > 3 ? 'hidden sm:table-cell' : ''}`}
                                    >
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {data.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-700/50 transition duration-100">
                                    {headers.map((header, index) => (
                                        <td
                                            key={index}
                                            className={`px-4 py-3 whitespace-nowrap text-sm ${header.key === 'quantity' && row.quantity <= LOW_STOCK_THRESHOLD ? 'text-red-400 font-bold' : 'text-gray-200'} ${isMobile && index > 3 ? 'hidden sm:table-cell' : ''}`}
                                        >
                                            {header.render ? header.render(row) : row[header.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// --- Dashboard Charts and Analytics ---

/**
 * Custom component for YAxis ticks on the vertical bar chart to handle long labels.
 * It truncates long labels and shows the full label on hover (via <title> tag).
 */
const CustomYAxisTick = (props) => {
    const { x, y, payload } = props;
    const maxChars = 15; // Max characters before truncation
    const label = payload.value;
    const displayLabel = label.length > maxChars ? `${label.substring(0, maxChars)}...` : label;

    return (
        <g transform={`translate(${x},${y})`}>
            {/* SVG title enables native tooltip on hover */}
            <title>{label}</title>
            <text x={0} y={0} dy={3} textAnchor="end" fill="#E5E7EB" style={{ fontSize: '12px' }}>
                {displayLabel}
            </text>
        </g>
    );
};

/**
 * Renders the charts section for the main dashboard view, adapted for dark theme.
 */
const DashboardCharts = React.memo(({ orders, inventory, warehouses, suppliers }) => {
    // Extended color palette for more charts
    const CHART_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#14B8A6', '#8B5CF6']; 
    const chartTitleClasses = "text-xl font-bold text-white mb-4";

    // Custom dark theme tooltip for Recharts
    const CustomTooltip = ({ active, payload, label, formatter }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-700 text-white p-3 rounded-lg shadow-lg border border-indigo-600 opacity-95">
                    <p className="font-bold mb-1">{label}</p>
                    {payload.map((p, index) => (
                        <p key={index} style={{ color: p.color }}>
                            {`${p.name}: ${formatter ? formatter(p.value) : p.value.toLocaleString()}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };


    // 1. Order Status Pie Chart Data
    const orderStatusData = useMemo(() => {
        const counts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        const statuses = Object.keys(counts);
        return statuses.map((status, index) => ({
            name: status,
            value: counts[status],
            color: CHART_COLORS[index % CHART_COLORS.length]
        }));
    }, [orders]);

    // 2. Inventory Stock Bar Chart Data
    const inventoryStockData = useMemo(() => {
        const stockByWarehouse = inventory.reduce((acc, inv) => {
            const warehouseName = inv.warehouse?.name || 'Unknown Warehouse';
            acc[warehouseName] = (acc[warehouseName] || 0) + inv.quantity;
            return acc;
        }, {});

        return Object.keys(stockByWarehouse).map(name => ({
            name: name,
            stock: stockByWarehouse[name],
        }));
    }, [inventory]);

    // 3. Inventory Value by Category Data
    const inventoryValueData = useMemo(() => {
        const valueByCategory = inventory.reduce((acc, inv) => {
            const category = inv.item?.category || 'Uncategorized';
            const value = (inv.item?.price || 0) * inv.quantity;
            acc[category] = (acc[category] || 0) + value;
            return acc;
        }, {});

        const categories = Object.keys(valueByCategory);
        return categories.map((category, index) => ({
            name: category,
            value: valueByCategory[category],
            color: CHART_COLORS[index % CHART_COLORS.length]
        }));
    }, [inventory]);

    // 4. Supplier Performance Data
    const supplierPerformanceData = useMemo(() => {
        return suppliers.map(s => ({
            name: s.name,
            avgDeliveryTime: s.averageDeliveryTime,
            // Assign a color based on performance (lower is better)
            fill: s.averageDeliveryTime <= 3 ? CHART_COLORS[2] : (s.averageDeliveryTime <= 7 ? CHART_COLORS[4] : CHART_COLORS[1]),
        })).sort((a, b) => a.avgDeliveryTime - b.avgDeliveryTime); // Sort for better visualization
    }, [suppliers]);
    
    // Y-Axis formatter for dollar values
    const dollarFormatter = (value) => `$${value.toLocaleString()}`;
    // Y-Axis formatter for days
    const daysFormatter = (value) => `${value} Days`;

    return (
        <div className="space-y-8">
            {/* Row 1: Status Distribution & Stock by Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Distribution Pie Chart */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                    <h3 className={chartTitleClasses}>Order Status Distribution</h3>
                    <div className='h-80'>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#3B82F6"
                                    labelLine={true}
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    layout="horizontal" 
                                    verticalAlign="bottom" 
                                    align="center" 
                                    wrapperStyle={{ color: '#E5E7EB' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Inventory Stock by Warehouse Bar Chart (FIXED LABELS) */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                    <h3 className={chartTitleClasses}>Inventory Stock by Warehouse (Units)</h3>
                    <div className='h-80'>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={inventoryStockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#A5B4FC" 
                                    angle={-45} // Increased angle for better separation
                                    textAnchor="end" 
                                    height={90} // Increased height to prevent clipping
                                    interval={0}
                                    style={{ fontSize: '12px' }} 
                                    tickLine={false}
                                    label={{ value: '', position: 'bottom', dy: 10, fill: '#A5B4FC' }}
                                />
                                <YAxis stroke="#A5B4FC" label={{ value: 'Stock Quantity', angle: -90, position: 'left', fill: '#A5B4FC', dy: 10 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ color: '#E5E7EB' }} />
                                <Bar dataKey="stock" fill="#6366F1" name="Total Stock" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 2: Inventory Value & Supplier Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Inventory Value by Category Pie Chart */}
                 <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                    <h3 className={chartTitleClasses}>Inventory Value by Item Category</h3>
                    <div className='h-80'>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={inventoryValueData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#10B981"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    tooltipValueFormatter={dollarFormatter}
                                >
                                    {inventoryValueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip formatter={dollarFormatter} />} />
                                <Legend 
                                    layout="horizontal" 
                                    verticalAlign="bottom" 
                                    align="center" 
                                    wrapperStyle={{ color: '#E5E7EB' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Supplier Average Delivery Time Bar Chart (FIXED LABELS) */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                    <h3 className={chartTitleClasses}>Supplier Performance: Avg Delivery Time</h3>
                    <div className='h-80'>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={supplierPerformanceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis 
                                    type="number" 
                                    stroke="#A5B4FC" 
                                    label={{ value: '', position: 'bottom', dy: 5, fill: '#A5B4FC' }}
                                    domain={[0, 'auto']}
                                />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    stroke="#A5B4FC" 
                                    width={120} // Increased width for longer names
                                    label={{ value: 'Supplier Name', angle: -90, position: 'left', fill: '#A5B4FC', dx: 15 }}
                                    tick={<CustomYAxisTick />} // Use custom tick component for truncation/hover
                                />
                                <Tooltip content={<CustomTooltip formatter={daysFormatter} />} />
                                <Legend wrapperStyle={{ color: '#E5E7EB' }} />
                                <Bar dataKey="avgDeliveryTime" name="" radius={[0, 4, 4, 0]}>
                                    {supplierPerformanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
});


// --- View Components ---

/**
 * Main dashboard view showing metrics and charts.
 */
const DashboardView = ({ data }) => {
    const { orders, inventories, shipments, suppliers } = data;

    // Calculate Dashboard Metrics
    const metrics = useMemo(() => {
        const totalShipments = shipments.length;
        const totalOrders = orders.length;
        const totalSuppliers = suppliers.length;
        const lowStockItems = inventories.filter(item => item.quantity <= LOW_STOCK_THRESHOLD);
        const lowStockCount = lowStockItems.length;

        const totalOrderQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);

        return [
            { 
                title: 'Total Orders', 
                value: totalOrders, 
                icon: List, 
                color: 'text-sky-400', 
                details: `${totalOrderQuantity.toLocaleString()} units` 
            },
            { 
                title: 'Shipments In Transit', 
                value: totalShipments, 
                icon: Truck, 
                color: 'text-indigo-400', 
                details: 'Awaiting Delivery' 
            },
            { 
                title: 'Active Suppliers', 
                value: totalSuppliers, 
                icon: Users, 
                color: 'text-green-400',
                details: 'In Good Standing' 
            },
            { 
                title: 'Low Stock Alerts', 
                value: lowStockCount, 
                icon: Package, 
                color: 'text-red-400', 
                details: `${lowStockItems.length} items to reorder`,
                alert: lowStockCount > 0 
            },
        ];
    }, [orders, shipments, suppliers, inventories]);

    return (
        <div className="min-h-full space-y-8 p-4 md:p-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">Supply Chain Overview</h1>
            
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <MetricCard key={metric.title} {...metric} />
                ))}
            </div>

            {/* Charts Section */}
            <DashboardCharts 
                orders={orders} 
                inventory={inventories} 
                warehouses={data.warehouses} 
                suppliers={data.suppliers}
            />
            
            {/* Low Stock Watch List (Inspired by the detail sections in the image) */}
            {metrics[3].alert && (
                <div className="bg-red-800/50 p-6 rounded-xl shadow-2xl border-2 border-red-700">
                    <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Critical Low Stock Items ({metrics[3].value})
                    </h3>
                    <ul className="text-sm text-red-100 space-y-1">
                        {inventories.filter(item => item.quantity <= LOW_STOCK_THRESHOLD).slice(0, 5).map(item => (
                            <li key={item.id} className="flex justify-between p-2 rounded-lg bg-red-900/50">
                                <span>{item.item?.name || `Item ID: ${item.id}`}</span>
                                <span className="font-semibold">{item.quantity} units left</span>
                            </li>
                        ))}
                         {metrics[3].value > 5 && <li className="pt-2 text-center text-red-200 text-xs italic">...and {metrics[3].value - 5} more items. Check Inventory View.</li>}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- Entity Table Definitions ---

const ShipmentView = ({ data }) => {
    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Status', key: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { label: 'Origin', key: 'originAddress' },
        { label: 'Destination', key: 'destinationAddress' },
        { label: 'Order ID', key: 'orderId' },
        { label: 'Tracking No.', key: 'trackingNumber' },
    ];
    return <CrudTableView title="Shipments" data={data.shipments} headers={headers} />;
};

const SupplierView = ({ data }) => {
    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Name', key: 'name' },
        { label: 'Contact', key: 'contactEmail' },
        { label: 'Avg Delivery Time (Days)', key: '', render: (row) => `${row.averageDeliveryTime.toFixed(1)} days` },
    ];
    return <CrudTableView title="Suppliers" data={data.suppliers} headers={headers} />;
};

const InventoryView = ({ data }) => {
    const getStockStatus = (quantity) => {
        if (quantity <= LOW_STOCK_THRESHOLD) return 'Low';
        if (quantity <= LOW_STOCK_THRESHOLD * 2) return 'Medium';
        return 'High';
    };

    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Item Name', key: 'itemName', render: (row) => row.item?.name || 'N/A' },
        { label: 'Warehouse Name', key: 'warehouseName', render: (row) => row.warehouse?.name || 'N/A' },
        { label: 'Quantity', key: 'quantity' },
        { label: 'Stock Status', key: 'status', render: (row) => {
            const status = getStockStatus(row.quantity);
            return <StatusBadge status={status} type="stock" />;
        }},
    ];
    return <CrudTableView title="Inventory" data={data.inventories} headers={headers} />;
};

const OrderView = ({ data }) => {
    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Item', key: 'itemName', render: (row) => row.item?.name || 'N/A' },
        { label: 'Quantity', key: 'quantity' },
        { label: 'Status', key: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];
    return <CrudTableView title="Orders" data={data.orders} headers={headers} />;
};

const ItemView = ({ data }) => {
    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Name', key: 'name' },
        { label: 'Category', key: 'category' },
        { label: 'Price', key: 'price', render: (row) => `$${row.price.toFixed(2)}` },
        { label: 'Description', key: 'description' },
    ];
    return <CrudTableView title="Items" data={data.items} headers={headers} />;
};

const WarehouseView = ({ data }) => {
    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Name', key: 'name' },
        { label: 'Address', key: 'address' },
        { label: 'Lat', key: 'latitude', render: (row) => row.latitude.toFixed(4) },
        { label: 'Lon', key: 'longitude', render: (row) => row.longitude.toFixed(4) },
    ];
    return <CrudTableView title="Warehouses" data={data.warehouses} headers={headers} />;
};


// --- Main Application Component ---

const App = () => {
    const [view, setView] = useState('dashboard');
    const [data, setData] = useState({
        orders: [], inventories: [], shipments: [], suppliers: [], items: [], warehouses: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(''); 


    // API Endpoints list
    const API_ENDPOINTS = useMemo(() => [
        { key: 'orders', url: `${BASE_URL}/orders` },
        { key: 'inventories', url: `${BASE_URL}/inventories` },
        { key: 'shipments', url: `${BASE_URL}/shipments` },
        { key: 'suppliers', url: `${BASE_URL}/suppliers` },
        { key: 'items', url: `${BASE_URL}/items` },
        { key: 'warehouses', url: `${BASE_URL}/warehouses` },
    ], []);

    /**
     * Fetches all required data concurrently from the backend endpoints.
     */
    const fetchAllData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const requests = API_ENDPOINTS.map(endpoint => 
                fetchWithRetry(endpoint.url)
                    .then(result => ({ key: endpoint.key, data: result }))
                    .catch(e => {
                        console.error(`Error fetching ${endpoint.key} data:`, e);
                        return { key: endpoint.key, data: [] }; 
                    })
            );

            const results = await Promise.all(requests);
            
            const newData = results.reduce((acc, current) => {
                acc[current.key] = current.data;
                return acc;
            }, {});

            setData(newData);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Error fetching dashboard data: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Helper function to render the currently selected view
    const renderView = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-screen text-gray-400 bg-gray-900">
                    <svg className="animate-spin h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg">Loading Supply Chain Data...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-screen text-red-400 bg-gray-900 p-8">
                    <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
                    <p className="font-bold text-xl mb-4 text-white">Connection Error</p>
                    <p className="text-center text-red-300">{error}</p>
                    <p className="text-sm text-gray-400 mt-2">Please ensure the Spring Boot backend is running and accessible on port 8080.</p>
                    <button 
                        onClick={fetchAllData} 
                        className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition duration-150"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        switch (view) {
            case 'dashboard':
                return <DashboardView data={data} />;
            case 'shipments':
                return <ShipmentView data={data} />;
            case 'suppliers':
                return <SupplierView data={data} />;
            case 'inventory':
                return <InventoryView data={data} />;
            case 'orders':
                return <OrderView data={data} />;
            case 'items':
                return <ItemView data={data} />;
            case 'warehouses':
                return <WarehouseView data={data} />;
            default:
                return <DashboardView data={data} />;
        }
    };

    // Sidebar navigation structure
    const navItems = [
        { name: 'Dashboard', icon: Home, key: 'dashboard' },
        { name: 'Orders', icon: List, key: 'orders' },
        { name: 'Shipments', icon: Truck, key: 'shipments' },
        { name: 'Inventory', icon: Package, key: 'inventory' },
        { name: 'Items', icon: Factory, key: 'items' },
        { name: 'Suppliers', icon: Users, key: 'suppliers' },
        { name: 'Warehouses', icon: Factory, key: 'warehouses' },
    ];

    const NavLink = ({ item }) => {
        const isActive = view === item.key;
        return (
            <button
                onClick={() => setView(item.key)}
                className={`flex items-center w-full p-3 rounded-xl transition duration-200 
                    ${isActive
                        ? 'bg-indigo-600 text-white shadow-xl'
                        : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                    }`}
            >
                <item.icon className={`w-5 h-5 mr-3`} />
                <span className="font-medium">{item.name}</span>
            </button>
        );
    };

    return (
        // Set the primary background color to dark gray-900
        <div className="flex min-h-screen bg-gray-900 font-sans">
            {/* Sidebar (Dark Indigo) */}
            <aside className="hidden md:flex flex-col w-64 bg-gray-800 shadow-2xl p-4 sticky top-0 h-screen border-r border-indigo-900">
                <div className="text-white text-3xl font-black p-4 mb-8 border-b border-indigo-900">
                    Supply<span className="text-indigo-400">Dash</span>
                </div>
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink key={item.key} item={item} />
                    ))}
                </nav>
                <div className="mt-auto p-4 text-xs text-indigo-300 opacity-60">
                    <p></p>
                    <p className='mt-1'></p>
                </div>
            </aside>

            {/* Main Content Area (Dark Background) */}
            <main className="flex-1 overflow-y-auto bg-gray-900">
                {renderView()}
            </main>
        </div>
    );
};

export default App;
