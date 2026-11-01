import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { LayoutDashboard, Package, Receipt, BarChart3, Settings } from 'lucide-react';
import { AppTab } from '../types';

export const Navigation: React.FC = () => {
  const { currentTab, setCurrentTab, products, sales, t } = useInventory();

  const inStockCount = products.filter((p) => p.status === 'IN_STOCK').length;
  const dueSalesCount = sales.filter((s) => s.dueAmount > 0).length;

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'DASHBOARD',
      label: t.tabDashboard,
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      id: 'STOCK',
      label: t.tabStock,
      icon: <Package className="h-5 w-5" />,
      badge: inStockCount,
      badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
    },
    {
      id: 'SALES',
      label: t.tabSales,
      icon: <Receipt className="h-5 w-5" />,
      badge: dueSalesCount > 0 ? dueSalesCount : undefined,
      badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
    },
    {
      id: 'REPORTS',
      label: t.tabReports,
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      id: 'SETTINGS',
      label: t.tabSettings,
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <>
      {/* Top desktop nav tab bar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-xs hidden md:block transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-2">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-xs ring-1 ring-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                        item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile sticky bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1 transition-colors">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                  active
                    ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/70 dark:bg-blue-950/40'
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge !== undefined && (
                    <span
                      className={`absolute -top-1.5 -right-2.5 text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold ${
                        item.badgeColor || 'bg-blue-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
