// ConfirmationDialog.tsx
import React from 'react';

interface ConfirmationDialogProps {
    msg: string;
    isOpen: boolean;
    onClose: () => void;
    onYes: () => void;
    onNo: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ msg, isOpen, onClose, onYes, onNo }) => {
    if (!isOpen) {
        return null;
    }
    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white p-10 rounded-2xl w-96 h-48 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col items-center gap-4">
                    <p>{msg}</p>
                    <div className="w-full flex flex-col gap-2">
                        <button className="text-lg w-full bg-blue-600 text-white py-2 rounded-lg border-none cursor-pointer" onClick={onYes}>Yes</button>
                        <button className="text-lg w-full bg-transparent text-red-600 py-2 rounded-lg border-2 border-red-600 cursor-pointer" onClick={onNo}>No</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
