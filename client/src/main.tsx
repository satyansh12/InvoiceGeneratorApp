import React from "react";
// Suppress useLayoutEffect warnings when not running in a browser environment
if (typeof window === 'undefined') {
    React.useLayoutEffect = React.useEffect;
}

import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider, Routes, Route} from "react-router-dom";
// index.js
import './index.css';
import AddProduct from "./components/addProduct/AddProduct.tsx";
import Invoices from "./screens/invoices/Invoices.tsx";
import Register from "./screens/register/Register.tsx";
import Login from "./screens/login/Login.tsx";
import Root from "./components/root/Root.tsx";
import ItemNotFound from "./screens/itemNotFound/ItemNotFound.tsx";
import SideNavigation from "./components/navigation/SideNavigation.tsx";

const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register/>,
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/test",
        element: <SideNavigation/>,
    },
    {
        path: "/",
        element: <Root/>,
        children: [
            {index: true, element: <AddProduct/>}, // Wrap Board with withUserData
            {path: "/add-products", element: <AddProduct/>}, // Wrap Board with withUserData
            {path: "/invoices", element: <Invoices/>}, // Wrap UserSettings with withUserData
        ],
    },
    {
        path: "/item-not-found",
        element: <ItemNotFound/>,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router}>
            <Routes>
                {router}
                {/* Catch-all route for undefined routes */}
                <Route path="*" element={<ItemNotFound/>} />
            </Routes>
        </RouterProvider>
    </React.StrictMode>
);
