
import React, { createContext, useState, useContext, useEffect } from 'react';
import db, { Customer, Package, Sector } from '@/lib/databaseSimulation';
import { useSecurity } from './SecurityContext';

interface CustomerContextType {
  customers: Customer[];
  packages: Package[];
  sectors: Sector[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer | null;
  getPackageName: (id: number) => string;
  getSectorName: (id: number) => string;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const { secureMode } = useSecurity();

  useEffect(() => {
    // Load data
    setCustomers(db.getCustomers());
    setPackages(db.getPackages());
    setSectors(db.getSectors());
  }, []);

  const addCustomer = (customerData: Omit<Customer, 'id'>): Customer | null => {
    let newCustomer;
    
    if (secureMode) {
      newCustomer = db.secureAddCustomer(customerData);
    } else {
      newCustomer = db.vulnerableAddCustomer(customerData);
    }
    
    if (newCustomer) {
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    }
    
    return null;
  };

  const getPackageName = (id: number): string => {
    const pkg = packages.find(p => p.id === id);
    return pkg ? pkg.name : 'Unknown Package';
  };

  const getSectorName = (id: number): string => {
    const sector = sectors.find(s => s.id === id);
    return sector ? sector.name : 'Unknown Sector';
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        packages,
        sectors,
        addCustomer,
        getPackageName,
        getSectorName,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
