// src/App.jsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/Cards";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [budget, setBudget] = useState([]);

  // Fetch data from Spring Boot backend
  useEffect(() => {
    fetch("http://localhost:8080/api/orders") // Example API
      .then(res => res.json())
      .then(data => setTickets(data));

    fetch("http://localhost:8080/api/projects") // If you create a project API
      .then(res => res.json())
      .then(data => setProjects(data));

    // Example static data for budget chart
    setBudget([
      { month: "A", value: 40000 },
      { month: "M", value: 20000 },
      { month: "J", value: 22000 },
      { month: "J", value: 28000 },
      { month: "A", value: 25000 },
      { month: "S", value: 18000 },
      { month: "O", value: 15000 },
      { month: "N", value: 21000 },
      { month: "D", value: 23000 },
      { month: "J", value: 29000 },
      { month: "F", value: 31000 },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 grid grid-cols-3 gap-6">
      
      {/* Open Tickets */}
      <Card className="bg-[#1e293b] p-4">
        <h2 className="text-xl font-bold">Open Tickets</h2>
        <p className="text-3xl mt-2">15</p>
        <p className="text-red-400 mt-1">6 older than 4 hrs ⚠️</p>
      </Card>

      {/* New Joiner Setup */}
      <Card className="bg-[#1e293b] p-4 col-span-1">
        <h2 className="text-xl font-bold">New Joiner Setup</h2>
        <p className="text-3xl mt-2">6 Outstanding</p>
        <ul className="mt-3 text-sm">
          <li>Roy Barnes: 1 Apr</li>
          <li>Radha Gupta: 15 Apr</li>
          <li>D'Angelo Smith: 15 Apr</li>
        </ul>
      </Card>

      {/* Projects */}
      <Card className="bg-[#1e293b] p-4">
        <h2 className="text-xl font-bold">Projects</h2>
        <p className="text-3xl mt-2">71 tasks</p>
        <div className="mt-4 space-y-2">
          <p>BAU <span className="float-right">27</span></p>
          <p>Cloud upgrade <span className="float-right">13</span></p>
          <p>CRM system <span className="float-right">24</span></p>
        </div>
      </Card>

      {/* Uptime */}
      <Card className="bg-[#1e293b] p-4">
        <h2 className="text-xl font-bold">Uptime</h2>
        <p className="text-green-400 text-2xl">✅ Up</p>
        <p className="text-sm mt-2">Response time: 494ms</p>
      </Card>

      {/* Budget Utilization */}
      <Card className="bg-[#1e293b] p-4 col-span-3">
        <h2 className="text-xl font-bold">Budget Utilization</h2>
        <p className="text-3xl mt-2">$296.9K</p>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budget}>
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
