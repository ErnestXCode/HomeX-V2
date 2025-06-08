import React from "react";
import {
  BarChart,
  Bar,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
} from "recharts";

const Trials = () => {
  const userData = [
    { name: "nester", age: 20 },
    { name: "johnte", age: 2 },
    { name: "johnte", age: 9 },
    { name: "johnte", age: 10 },
    { name: "johnte", age: 17 },
    { name: "johnte", age: 28 },
  ];
  return (
    <div className="h-screen flex gap-2">
      <div className="w-50 h-50">
        <ResponsiveContainer height={"100%"} width={"100%"}>
          <BarChart width={48} height={48} data={userData}>
            <Bar dataKey="age" fill="#a2f" />
            <CartesianGrid stroke="#333" strokeOpacity={"50%"} />
            <YAxis dataKey="age" />
            <XAxis />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-9">some stuff</div>

      <PieChart width={300} height={300}>
        <Pie data={userData} dataKey="age" fill="#050" />
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default Trials;
