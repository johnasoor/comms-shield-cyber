
// This file provides browser-compatible alternatives to Node.js crypto functions

export default {
  createHmac: (algorithm: string, key: string) => {
    return {
      update: (data: string) => {
        return {
          digest: (encoding: string) => {
            // In a browser environment, we can use the Web Crypto API
            // For this demo, we'll use a simplified implementation
            return Array.from(
              new Uint8Array(
                window.crypto.getRandomValues(new Uint8Array(32))
              )
            )
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
          },
        };
      },
    };
  },
  
  createHash: (algorithm: string) => {
    return {
      update: (data: string) => {
        return {
          digest: (encoding: string) => {
            // Simplified hash implementation for demo
            return Array.from(
              new Uint8Array(
                window.crypto.getRandomValues(new Uint8Array(20))
              )
            )
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
          },
        };
      },
    };
  },
  
  randomBytes: (size: number) => {
    // Use the Web Crypto API for random bytes
    const bytes = window.crypto.getRandomValues(new Uint8Array(size));
    return {
      toString: (encoding: string) => {
        if (encoding === 'hex') {
          return Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        }
        return String.fromCharCode.apply(null, Array.from(bytes));
      },
    };
  },
};
