// 'use client';

// import { create } from 'zustand';
// import jwt from 'jsonwebtoken';

// interface AuthState {
//   userId: string | null;
//   role: string | null;
//   exp: number | null;
//   isAuthenticated: boolean;
//   login: (token: string, rememberMe?: boolean) => void;
//   logout: () => void;
//   checkAuth: () => void;
//   switchAccount: (token: string) => void;
// }

// interface StoreState extends AuthState {}

// // Generate unique tab ID
// const getTabId = (): string => {
//   if (typeof window === 'undefined') return '';

//   let tabId = sessionStorage.getItem('tabId');
//   if (!tabId) {
//     tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     sessionStorage.setItem('tabId', tabId);
//   }
//   return tabId;
// };

// // Multi-account session management
// const getActiveAccounts = (): Record<string, any> => {
//   if (typeof window === 'undefined') return {};
//   const accounts = localStorage.getItem('activeAccounts');
//   return accounts ? JSON.parse(accounts) : {};
// };

// const setActiveAccount = (tabId: string, userInfo: any) => {
//   if (typeof window === 'undefined') return;
//   const accounts = getActiveAccounts();
//   accounts[tabId] = {
//     ...userInfo,
//     lastActive: Date.now(),
//   };
//   localStorage.setItem('activeAccounts', JSON.stringify(accounts));
// };

// const removeActiveAccount = (tabId: string) => {
//   if (typeof window === 'undefined') return;
//   const accounts = getActiveAccounts();
//   delete accounts[tabId];
//   localStorage.setItem('activeAccounts', JSON.stringify(accounts));
// };

// const useStore = create<StoreState>((set, get) => ({
//   // 🔹 Authentication State
//   userId: null,
//   role: null,
//   exp: null,
//   isAuthenticated: false,

//   login: (token: string, rememberMe: boolean = true) => {
//     console.log('Received token:', token);

//     if (!token) {
//       console.error('No token received');
//       return;
//     }

//     try {
//       const decoded: any = jwt.decode(token);
//       console.log('Decoded token:', decoded);

//       if (decoded && decoded.userId && decoded.role) {
//         const tabId = getTabId();

//         set({
//           userId: decoded.userId,
//           role: decoded.role,
//           exp: decoded.exp,
//           isAuthenticated: true,
//         });

//         const userInfo = {
//           userId: decoded.userId,
//           role: decoded.role,
//           exp: decoded.exp,
//           token: token,
//         };

//         if (rememberMe) {
//           localStorage.setItem(`auth_${tabId}`, JSON.stringify(userInfo));
//         }

//         sessionStorage.setItem('currentAuth', JSON.stringify(userInfo));

//         setActiveAccount(tabId, userInfo);
//       } else {
//         console.error('Invalid token format', decoded);
//       }
//     } catch (error) {
//       console.error('Token decoding error:', error);
//     }
//   },

//   switchAccount: (token: string) => {
//     const tabId = getTabId();

//     sessionStorage.removeItem('currentAuth');
//     removeActiveAccount(tabId);

//     get().login(token, true);
//   },

//   logout: () => {
//     const tabId = getTabId();

//     set({
//       userId: null,
//       role: null,
//       exp: null,
//       isAuthenticated: false,
//     });

//     localStorage.removeItem(`auth_${tabId}`);
//     sessionStorage.removeItem('currentAuth');
//     removeActiveAccount(tabId);
//   },

//   checkAuth: () => {
//     if (typeof window === 'undefined') return;

//     const tabId = getTabId();

//     let authData = sessionStorage.getItem('currentAuth');

//     if (!authData) {
//       authData = localStorage.getItem(`auth_${tabId}`);
//       if (authData) {
//         sessionStorage.setItem('currentAuth', authData);
//       }
//     }

//     if (authData) {
//       try {
//         const parsed = JSON.parse(authData);
//         const { token, userId, role, exp } = parsed;

//         if (exp && exp * 1000 < Date.now()) {
//           console.log('Token expired, logging out');
//           get().logout();
//           return;
//         }

//         const decoded: any = jwt.decode(token);
//         if (decoded && decoded.userId === userId && decoded.role === role) {
//           set({
//             userId,
//             role,
//             exp,
//             isAuthenticated: true,
//           });

//           setActiveAccount(tabId, parsed);
//         } else {
//           console.error('Token validation failed');
//           get().logout();
//         }
//       } catch (error) {
//         console.error('Error parsing auth data:', error);
//         get().logout();
//       }
//     }
//   },
// }));

// if (typeof window !== 'undefined') {
//   const cleanupInactiveTabs = () => {
//     const accounts = getActiveAccounts();
//     const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;

//     Object.keys(accounts).forEach((tabId) => {
//       if (accounts[tabId].lastActive < cutoffTime) {
//         localStorage.removeItem(`auth_${tabId}`);
//         delete accounts[tabId];
//       }
//     });

//     localStorage.setItem('activeAccounts', JSON.stringify(accounts));
//   };

//   cleanupInactiveTabs();

//   window.addEventListener('beforeunload', () => {
//     const tabId = getTabId();
//     removeActiveAccount(tabId);
//   });
// }

// useStore.getState().checkAuth();

// export default useStore;

// export const getActiveAccountsList = () => {
//   const accounts = getActiveAccounts();
//   return Object.entries(accounts).map(([tabId, info]: [string, any]) => ({
//     tabId,
//     userId: info.userId,
//     role: info.role,
//     lastActive: info.lastActive,
//   }));
// };

// export const switchToAccount = (targetUserId: string) => {
//   const accounts = getActiveAccounts();
//   const targetAccount = Object.values(accounts).find(
//     (acc: any) => acc.userId === targetUserId
//   );

//   if (targetAccount) {
//     useStore.getState().switchAccount((targetAccount as any).token);
//   }
// };

'use client';

import { create } from 'zustand';
import jwt from 'jsonwebtoken';
import type { RoleKey } from './rbacConfig';

interface AuthState {
  userId: string | null;
  role: RoleKey | null;
  exp: number | null;
  isAuthenticated: boolean;
  login: (token: string, rememberMe?: boolean) => void;
  logout: () => void;
  checkAuth: () => void;
  switchAccount: (token: string) => void;
}

interface StoreState extends AuthState {
  industries: Record<string, string | null>; // Map project_id to industry
  setIndustry: (projectId: string, industry: string | null) => void;
  clearIndustry: (projectId: string) => void;
  clearAllIndustries: () => void; // Optional: Clear all industries
}

interface DecodedToken {
  userId: string;
  role: RoleKey;
  exp: number;
}

// Generate unique tab ID
const getTabId = (): string => {
  if (typeof window === 'undefined') return '';

  let tabId = sessionStorage.getItem('tabId');
  if (!tabId) {
    tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('tabId', tabId);
  }
  return tabId;
};

// Multi-account session management
const getActiveAccounts = (): Record<string, any> => {
  if (typeof window === 'undefined') return {};
  const accounts = localStorage.getItem('activeAccounts');
  return accounts ? JSON.parse(accounts) : {};
};

const setActiveAccount = (tabId: string, userInfo: any) => {
  if (typeof window === 'undefined') return;
  const accounts = getActiveAccounts();
  accounts[tabId] = {
    ...userInfo,
    lastActive: Date.now(),
  };
  localStorage.setItem('activeAccounts', JSON.stringify(accounts));
};

const removeActiveAccount = (tabId: string) => {
  if (typeof window === 'undefined') return;
  const accounts = getActiveAccounts();
  delete accounts[tabId];
  localStorage.setItem('activeAccounts', JSON.stringify(accounts));
};

const useStore = create<StoreState>((set, get) => ({
  // 🔹 Authentication State
  userId: null,
  role: null,
  exp: null,
  isAuthenticated: false,
  industries: {}, // Initialize industries map
  login: (token: string, rememberMe: boolean = true) => {
    console.log('Received token:', token);

    if (!token) {
      console.error('No token received');
      return;
    }

    try {
      // const decoded: any = jwt.decode(token);
      const decoded = jwt.decode(token) as DecodedToken;
      console.log('Decoded token:', decoded);

      if (decoded && decoded.userId && decoded.role) {
        const tabId = getTabId();

        set({
          userId: decoded.userId,
          role: decoded.role,
          exp: decoded.exp,
          isAuthenticated: true,
        });

        const userInfo = {
          userId: decoded.userId,
          role: decoded.role,
          exp: decoded.exp,
          token: token,
        };

        if (rememberMe) {
          localStorage.setItem(`auth_${tabId}`, JSON.stringify(userInfo));
        }

        sessionStorage.setItem('currentAuth', JSON.stringify(userInfo));

        setActiveAccount(tabId, userInfo);
      } else {
        console.error('Invalid token format', decoded);
      }
    } catch (error) {
      console.error('Token decoding error:', error);
    }
  },

  switchAccount: (token: string) => {
    const tabId = getTabId();

    sessionStorage.removeItem('currentAuth');
    removeActiveAccount(tabId);

    get().login(token, true);
  },

  logout: () => {
    const tabId = getTabId();

    set({
      userId: null,
      role: null,
      exp: null,
      isAuthenticated: false,
      industries: {}, // Clear industries on logout
    });

    localStorage.removeItem(`auth_${tabId}`);
    sessionStorage.removeItem('currentAuth');
    removeActiveAccount(tabId);
  },

  checkAuth: () => {
    if (typeof window === 'undefined') return;

    const tabId = getTabId();

    let authData = sessionStorage.getItem('currentAuth');

    if (!authData) {
      authData = localStorage.getItem(`auth_${tabId}`);
      if (authData) {
        sessionStorage.setItem('currentAuth', authData);
      }
    }

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const { token, userId, role, exp } = parsed;

        if (exp && exp * 1000 < Date.now()) {
          console.log('Token expired, logging out');
          get().logout();
          return;
        }

        const decoded: any = jwt.decode(token);
        if (decoded && decoded.userId === userId && decoded.role === role) {
          set({
            userId,
            role,
            exp,
            isAuthenticated: true,
          });

          setActiveAccount(tabId, parsed);
        } else {
          console.error('Token validation failed');
          get().logout();
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
        get().logout();
      }
    }
  },

  setIndustry: (projectId: string, industry: string | null) =>
    set((state) => ({
      industries: { ...state.industries, [projectId]: industry },
    })),

  clearIndustry: (projectId: string) =>
    set((state) => ({
      industries: { ...state.industries, [projectId]: null },
    })),

  clearAllIndustries: () => set({ industries: {} }),
}));

if (typeof window !== 'undefined') {
  const cleanupInactiveTabs = () => {
    const accounts = getActiveAccounts();
    const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;

    Object.keys(accounts).forEach((tabId) => {
      if (accounts[tabId].lastActive < cutoffTime) {
        localStorage.removeItem(`auth_${tabId}`);
        delete accounts[tabId];
      }
    });

    localStorage.setItem('activeAccounts', JSON.stringify(accounts));
  };

  cleanupInactiveTabs();

  window.addEventListener('beforeunload', () => {
    const tabId = getTabId();
    removeActiveAccount(tabId);
  });
}

useStore.getState().checkAuth();

export default useStore;

export const getActiveAccountsList = () => {
  const accounts = getActiveAccounts();
  return Object.entries(accounts).map(([tabId, info]: [string, any]) => ({
    tabId,
    userId: info.userId,
    role: info.role,
    lastActive: info.lastActive,
  }));
};

export const switchToAccount = (targetUserId: string) => {
  const accounts = getActiveAccounts();
  const targetAccount = Object.values(accounts).find(
    (acc: any) => acc.userId === targetUserId
  );

  if (targetAccount) {
    useStore.getState().switchAccount((targetAccount as any).token);
  }
};
