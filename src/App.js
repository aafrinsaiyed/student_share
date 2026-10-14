import { Routes, Route } from 'react-router-dom';
import AuthRoute from './AuthRoute';
import { lazy, Suspense } from 'react';

import './App.css';
import './loader.css'

const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const AddUser = lazy(() => import('./components/AddUser'));
const EditUser = lazy(() => import('./components/EditUser'));

function App() {
  return (
    <Suspense fallback={<div className="loader-container">
      <div className="loader"></div>
      <p>Loading.....</p>
    </div>}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          }
        />

        <Route
          path="/add-user"
          element={
            <AuthRoute>
              <AddUser />
            </AuthRoute>
          }
        />

        <Route
          path="/edit-user/:id"
          element={
            <AuthRoute>
              <EditUser />
            </AuthRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;