
import React from 'react';
import { AlertTriangle, Shield, Info } from 'lucide-react';
import { useSecurity } from '@/contexts/SecurityContext';
import { cn } from '@/lib/utils';

interface SecurityBannerProps {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'vulnerability';
}

export const SecurityBanner: React.FC<SecurityBannerProps> = ({ title, message, type }) => {
  const { secureMode } = useSecurity();
  
  if (type === 'vulnerability' && secureMode) {
    return null;
  }
  
  return (
    <div className={cn(
      "mb-6 p-4 rounded-md border",
      type === 'info' ? "bg-blue-50 border-blue-200" : 
      type === 'warning' ? "bg-amber-50 border-amber-200" : 
      "bg-red-50 border-red-200"
    )}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
          {type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
          {type === 'vulnerability' && <AlertTriangle className="h-5 w-5 text-red-500" />}
        </div>
        <div className="ml-3">
          <h3 className={cn(
            "text-sm font-medium",
            type === 'info' ? "text-blue-800" : 
            type === 'warning' ? "text-amber-800" : 
            "text-red-800"
          )}>
            {title}
          </h3>
          <div className={cn(
            "mt-2 text-sm",
            type === 'info' ? "text-blue-700" : 
            type === 'warning' ? "text-amber-700" : 
            "text-red-700"
          )}>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface VulnerabilityDemoProps {
  title: string;
  children: React.ReactNode;
}

export const VulnerabilityDemo: React.FC<VulnerabilityDemoProps> = ({ title, children }) => {
  const { secureMode } = useSecurity();
  
  return (
    <div className={cn(
      "mb-6 p-4 rounded-md border",
      secureMode ? "border-green-200 secure-mode" : "border-red-200 vulnerable-mode"
    )}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          secureMode ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {secureMode ? <span className="flex items-center"><Shield className="h-3 w-3 mr-1" /> Secure Mode</span> : 
          <span className="flex items-center"><AlertTriangle className="h-3 w-3 mr-1" /> Vulnerable Mode</span>}
        </div>
      </div>
      {children}
    </div>
  );
};

interface CodeExampleProps {
  vulnerable: string;
  secure: string;
  language?: string;
}

export const CodeExample: React.FC<CodeExampleProps> = ({ vulnerable, secure, language = "javascript" }) => {
  const { secureMode } = useSecurity();
  
  return (
    <div className="mb-6">
      <div className="mb-2">
        <h4 className={cn(
          "text-sm font-medium mb-1",
          secureMode ? "text-green-700" : "text-red-700"
        )}>
          {secureMode ? "Secure Code" : "Vulnerable Code"}
        </h4>
      </div>
      <div className="terminal-text text-sm overflow-x-auto">
        <pre>
          <code>
            {secureMode ? secure : vulnerable}
          </code>
        </pre>
      </div>
    </div>
  );
};
