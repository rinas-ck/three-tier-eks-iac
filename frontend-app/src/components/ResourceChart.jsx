
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const cpuData = [
  { time: "09:00", usage: 25 },
  { time: "10:00", usage: 38 },
  { time: "11:00", usage: 32 },
  { time: "12:00", usage: 55 },
  { time: "13:00", usage: 42 },
  { time: "14:00", usage: 48 },
  { time: "15:00", usage: 35 },
];

function ResourceChart({ title, color }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={cpuData}>
          <defs>
            <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#293243" strokeDasharray="3 3" />
          <XAxis dataKey="time" stroke="#8994a7" />
          <YAxis stroke="#8994a7" unit="%" />
          <Tooltip
            contentStyle={{
              background: "#151c28",
              border: "1px solid #293243",
              borderRadius: "8px"
            }}
          />

          <Area
            type="monotone"
            dataKey="usage"
            stroke={color}
            fill="url(#usageGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ResourceChart;
