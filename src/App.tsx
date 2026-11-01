import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardScreen } from './components/DashboardScreen';
import { StockScreen } from './components/StockScreen';
import { SalesScreen } from './components/SalesScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AddEditProductModal } from './components/AddEditProductModal';
import { SaleCheckoutModal } from './components/SaleCheckoutModal';
import { InvoiceMemoModal } from './components/InvoiceMemoModal';
import { DuePaymentModal } from './components/DuePaymentModal';
import { EditSaleModal } from './components/EditSaleModal';
import { ScannerModal } from './components/ScannerModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InstallAppModal } from './components/InstallAppModal';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentTab, toastMessage, isInstallModalOpen, closeInstallModal } = useInventory();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-150">
      <Header />
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {currentTab === 'DASHBOARD' && <DashboardScreen />}
        {currentTab === 'STOCK' && <StockScreen />}
        {currentTab === 'SALES' && <SalesScreen />}
        {currentTab === 'REPORTS' && <ReportsScreen />}
        {currentTab === 'SETTINGS' && <SettingsScreen />}
      </main>

      {/* Global Dialog Modals */}
      <ProductDetailModal />
      <AddEditProductModal />
      <SaleCheckoutModal />
      <InvoiceMemoModal />
      <DuePaymentModal />
      <EditSaleModal />
      <ScannerModal />
      <InstallAppModal isOpen={isInstallModalOpen} onClose={closeInstallModal} />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-800 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <MainContent />
    </InventoryProvider>
  );
}
