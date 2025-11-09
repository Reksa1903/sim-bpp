'use client';

import Image from 'next/image';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Jan',
    panen: 4000,
    penjualan: 2400,
  },
  {
    name: 'Feb',
    panen: 3000,
    penjualan: 1398,
  },
  {
    name: 'Mar',
    panen: 2000,
    penjualan: 9800,
  },
  {
    name: 'Apr',
    panen: 2780,
    penjualan: 3908,
  },
  {
    name: 'Mei',
    panen: 1890,
    penjualan: 4800,
  },
  {
    name: 'Juni',
    panen: 2390,
    penjualan: 3800,
  },
  {
    name: 'Jul',
    panen: 3490,
    penjualan: 4300,
  },
  {
    name: 'Ags',
    panen: 3490,
    penjualan: 4300,
  },
  {
    name: 'Sep',
    panen: 3490,
    penjualan: 4300,
  },
  {
    name: 'Okt',
    panen: 3490,
    penjualan: 4300,
  },
  {
    name: 'Nov',
    panen: 3490,
    penjualan: 4300,
  },
  {
    name: 'Des',
    panen: 3490,
    penjualan: 4300,
  },
];

const PanenChart = ({ data = [] }: { data?: Array<any> }) => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Hasil Panen</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: '#d1d5db' }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: '#d1d5db' }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: '10px', paddingBottom: '30px' }}
          />
          <Line
            type="monotone"
            dataKey="panen"
            stroke="#CAE8BD"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="penjualan"
            stroke="#C3EBFA"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PanenChart;
