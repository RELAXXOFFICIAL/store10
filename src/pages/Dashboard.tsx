import React from 'react';
import { Package, Truck, TrendingUp, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value="124"
          icon={<Package className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Orders Today"
          value="12"
          icon={<Truck className="w-6 h-6 text-blue-600" />}
          trend="+23.1% vs last week"
        />
        <StatCard
          title="Revenue Today"
          value="$1,429"
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          trend="+10.3% vs last week"
        />
        <StatCard
          title="Pending Orders"
          value="5"
          icon={<Package className="w-6 h-6 text-blue-600" />}
        />
      </div>
    </div>
  );
}