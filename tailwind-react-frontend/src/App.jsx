// // src/App.jsx
// import React, { Suspense, lazy } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import ProtectedRoute from './components/ProtectedRoute';
// import ErrorBoundary from './components/ErrorBoundary';
// import OAuthCallback from './components/OAuthCallback'; // new component

// // Lazy-load pages to reduce initial JS surface and improve performance
// const LandDes = lazy(() => import('./components/LandDes'));
// const Login = lazy(() => import('./pages/Login'));
// const Register = lazy(() => import('./pages/Register'));
// const Home = lazy(() => import('./pages/Home'));
// const RestaurantDashboard = lazy(() => import('./pages/RestaurantDashboard'));
// const UserRestaurantMenu = lazy(() => import('./pages/UserRestaurantMenu'));
// const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
// const DeliveryTracker = lazy(() => import('./pages/DeliveryTracker'));
// const DriverDashboard = lazy(() => import('./pages/DriverDashboard'));
// const AdminResRegistration = lazy(() => import('./pages/AdminResRegistration'));
// const ManageOrders = lazy(() => import('./pages/ManageOrders'));
// const PaymentSuccess = lazy(() => import('./components/PaymentSuccess'));
// const CreateOrder = lazy(() => import('./pages/CreateOrder'));
// const MyOrders = lazy(() => import('./pages/MyOrders'));
// const Checkout = lazy(() => import('./pages/Checkout'));
// const AdminTransactions = lazy(() => import('./pages/AdminTransactions'));
// //const NotFound = lazy(() => import('./pages/NotFound')); // create a simple 404 page if missing

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="flex flex-col min-h-screen">
//         <Header />
//         <main className="flex-grow">
//           {/* ErrorBoundary prevents a crash from exposing internals to users */}
//           <ErrorBoundary>
//             {/* Suspense fallback shown during lazy-loading */}
//             <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
//               <Routes>
//                 {/* Public Landing + Auth */}
//                 <Route path="/" element={<LandDes />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />

//                 {/* Customer-only pages */}
//                 <Route
//                   path="/home"
//                   element={
//                     <ProtectedRoute allowedRoles={['customer']}>
//                       <Home />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/createorder"
//                   element={
//                     <ProtectedRoute allowedRoles={['customer']}>
//                       <CreateOrder />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/orders"
//                   element={
//                     <ProtectedRoute allowedRoles={['customer']}>
//                       <MyOrders />
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Restaurant owner (requires 'restaurant' role) */}
//                 <Route
//                   path="/restaurantDashboard"
//                   element={
//                     <ProtectedRoute allowedRoles={['restaurant']}>
//                       <RestaurantDashboard />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/restaurants/:id"
//                   element={
//                     // restaurant menu can be public, but if it exposes edit features, those are protected in the component
//                     <UserRestaurantMenu />
//                   }
//                 />
//                 <Route
//                   path="/restaurants/:restaurantId/orders"
//                   element={
//                     <ProtectedRoute allowedRoles={['restaurant']}>
//                       <ManageOrders />
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Admin routes */}
//                 <Route
//                   path="/adminDashboard"
//                   element={
//                     <ProtectedRoute allowedRoles={['admin']}>
//                       <AdminDashboard />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/admin/transactions"
//                   element={
//                     <ProtectedRoute allowedRoles={['admin']}>
//                       <AdminTransactions />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/resReg"
//                   element={
//                     <ProtectedRoute allowedRoles={['admin']}>
//                       <AdminResRegistration />
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Delivery / Driver */}
//                 <Route
//                   path="/driver"
//                   element={
//                     <ProtectedRoute allowedRoles={['delivery']}>
//                       <DriverDashboard />
//                     </ProtectedRoute>
//                   }
//                 />
//                 {/* Track order: make available to roles that should access tracking (customer, admin, delivery) */}
//                 <Route
//                   path="/track/:id"
//                   element={
//                     <ProtectedRoute allowedRoles={['customer', 'admin', 'delivery']}>
//                       <DeliveryTracker />
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Checkout + Payment flow:
//                     - Checkout is protected (customer)
//                     - Payment success is public because external payment provider redirects here.
//                       The PaymentSuccess component itself must validate the session_id and sanitize outputs.
//                 */}
//                 <Route
//                   path="/checkout"
//                   element={
//                     <ProtectedRoute allowedRoles={['customer']}>
//                       <Checkout />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route path="/payment-success" element={<PaymentSuccess />} />

//                 {/* Catch-all NotFound */}
                
//                 <Route path="*" element={<Navigate to="/404" replace />} />
//               </Routes>
//             </Suspense>
//           </ErrorBoundary>
//         </main>
//         <Footer />
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;


// // Nice — thanks for pasting App.js. I’ll give you a safe, improved version plus an ErrorBoundary component and explain exactly what I changed and why. These frontend fixes focus on routing-level hardening and supporting the other frontend hardening steps we've discussed (CSP, sanitized query params, removing sensitive storage, etc.).

// // What I’ll deliver:

// // A hardened App.jsx (uses React.lazy + Suspense, consistent ProtectedRoute usage, central ErrorBoundary, and explicit route access rules).

// // A small ErrorBoundary.jsx component to avoid leaking stack traces to the UI.

// // Short notes explaining why each change helps (OWASP mapping).

// // ✅ What this patch does (high-level)

// // Protects sensitive routes with ProtectedRoute everywhere appropriate (admin pages, driver pages, customer-only pages). This reduces risk of unauthorized access (OWASP A01: Broken Access Control).

// // Defence-in-depth: controllers still enforce RBAC, but frontend enforces role-based UI too (helps UX and reduces accidental exposure).

// // Error isolation (Error Boundary) prevents the whole app from crashing and avoids showing stack traces to users (prevents info disclosure).

// // Lazy loading routes (React.lazy) reduces the amount of JS initially executed, limiting attack surface and improving performance.

// // Explicit public vs protected decisions for routes like /checkout, /payment-success, /track/:id (we keep payment-success public because Stripe redirects here; component sanitizes session_id).

// // Added NotFound route to avoid weird behavior for unknown paths.

// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import OAuthCallback from './components/OAuthCallback'; // new OAuth handler

// Lazy-load pages to reduce initial JS surface and improve performance
const LandDes = lazy(() => import('./components/LandDes'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const RestaurantDashboard = lazy(() => import('./pages/RestaurantDashboard'));
const UserRestaurantMenu = lazy(() => import('./pages/UserRestaurantMenu'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DeliveryTracker = lazy(() => import('./pages/DeliveryTracker'));
const DriverDashboard = lazy(() => import('./pages/DriverDashboard'));
const AdminResRegistration = lazy(() => import('./pages/AdminResRegistration'));
const ManageOrders = lazy(() => import('./pages/ManageOrders'));
const PaymentSuccess = lazy(() => import('./components/PaymentSuccess'));
const CreateOrder = lazy(() => import('./pages/CreateOrder'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminTransactions = lazy(() => import('./pages/AdminTransactions'));
// const NotFound = lazy(() => import('./pages/NotFound')); // optional 404 page

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {/* ErrorBoundary prevents a crash from exposing internals */}
          <ErrorBoundary>
            <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
              <Routes>
                {/* Public Landing + Auth */}
                <Route path="/" element={<LandDes />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ✅ OAuth callback route */}
                <Route path="/auth/callback" element={<OAuthCallback />} />

                {/* Customer-only pages */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/createorder"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CreateOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Restaurant owner */}
                <Route
                  path="/restaurantDashboard"
                  element={
                    <ProtectedRoute allowedRoles={['restaurant']}>
                      <RestaurantDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/restaurants/:id" element={<UserRestaurantMenu />} />
                <Route
                  path="/restaurants/:restaurantId/orders"
                  element={
                    <ProtectedRoute allowedRoles={['restaurant']}>
                      <ManageOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/adminDashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/transactions"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminTransactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resReg"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminResRegistration />
                    </ProtectedRoute>
                  }
                />

                {/* Delivery / Driver */}
                <Route
                  path="/driver"
                  element={
                    <ProtectedRoute allowedRoles={['delivery']}>
                      <DriverDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/track/:id"
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'admin', 'delivery']}>
                      <DeliveryTracker />
                    </ProtectedRoute>
                  }
                />

                {/* Checkout + Payment flow */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route path="/payment-success" element={<PaymentSuccess />} />

                {/* Catch-all NotFound (replace with your own 404 page if you have one) */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
