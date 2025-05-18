import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SessionData {
  date: string;
  accuracy: number;
}

interface StatsChartProps {
  data: SessionData[];
  height?: number;
}

const StatsChart: React.FC<StatsChartProps> = ({
  data,
  height = 200
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">暂无数据</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, '正确率']}
            labelFormatter={(label) => `日期: ${label}`}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            name="正确率"
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#3B82F6' }} 
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;