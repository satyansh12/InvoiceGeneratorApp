// SideNavigation.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import LevitationLogo from "./../../assets/images/levitation_logo.svg"

const SideNavigation: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const jwtToken = localStorage.getItem("jwt");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

    const handleLogout = () => {
        axios
            .post(`${process.env.REACT_APP_SERVER_URL}/api/logout`, null, {
                withCredentials: true,
            })
            .then((response) => {
                if (response.status === 200) {
                    localStorage.removeItem("jwt");
                    navigate("/register");
                    setIsLoggedIn(false);
                }
            })
            .catch((error) => {
                console.error("Error during logout:", error);
            });
    };

    const openLogoutConfirmDialog = () => {
        setIsConfirmationDialogOpen(true);
    };
    const location = useLocation();

    return (
        <div
            className="flex flex-col justify-between items-center h-screen w-30vh p-4 bg-transparent font-semibold fixed top-0 bottom-0 left-0 overflow-y-auto">
            <div className="flex flex-col gap-4 w-full h-full">
                <Link to="/add-products"
                      className={`flex items-center justify-start p-2 border-none cursor-pointer font-semibold mt-4 hover:bg-gray-200 text-left ${location.pathname === "/add-products" ? "text-black" : "text-gray-700"}`}>
                    <img src={LevitationLogo} alt="Levitation Logo" className="w-24 mr-2"/>
                    <div className="flex flex-col">
                        <b className="text-xl">Levitation</b>
                        <span className="text-base">infotech</span>
                    </div>
                </Link>
                <div className="flex-grow">
                    <div className="flex flex-col">
                        <Link to="/add-products"
                              className="p-2 border-none cursor-pointer font-normal hover:bg-gray-200 text-gray-700 text-left">
                            Add Products
                        </Link>
                        <Link to="/invoices"
                              className="p-2 border-none cursor-pointer font-normal hover:bg-gray-200 text-gray-700 text-left">
                            Invoices
                        </Link>
                    </div>
                </div>
                <div className="w-full">
                    <button
                        className="p-2 border-none cursor-pointer font-normal mt-4 text-red-500 hover:bg-gray-200 text-left"
                        onClick={openLogoutConfirmDialog}>
                        Sign Out
                    </button>
                </div>
            </div>
            <ConfirmationDialog
                msg="Are You Sure you want to Logout?"
                isOpen={isConfirmationDialogOpen}
                onClose={() => setIsConfirmationDialogOpen(false)}
                onYes={() => {
                    handleLogout();
                    setIsConfirmationDialogOpen(false);
                }}
                onNo={() => {
                    setIsConfirmationDialogOpen(false);
                }}
            />
        </div>
    );
};

export default SideNavigation;
