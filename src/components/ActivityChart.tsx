// src/components/ActivityChart.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ActivityChart = ({
  data,
}: {
  data: { name: string; kegiatan: number }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart width={500} height={300} data={data} barSize={60}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: '#d1d5db' }}
          tickLine={false}
        />
        <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }}
        />
        <Legend
          align="left"
          verticalAlign="top"
          wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }}
        />
        <Bar
          dataKey="kegiatan"
          fill="#CAE8BD"
          legendType="circle"
          radius={[5, 5, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;
