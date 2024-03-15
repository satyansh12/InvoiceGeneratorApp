import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

const Invoices = () => {
    const jwtToken = localStorage.getItem('jwt');
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get('http://localhost:3100/api/invoices', {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                console.log("invoices" , invoices);
                setInvoices(response.data.sort((a, b) => dayjs(b.date) - dayjs(a.date)));
            } catch (error) {
                console.error('Error fetching invoices:', error);
                toast.error('Error fetching invoices');
            }
        };

        fetchInvoices();
    }, [jwtToken]);

    useEffect(() => {
        console.log(
            invoices
        );
    }, [invoices]);

    const downloadInvoice = async (invoiceId) => {
        try {
            const response = await axios.get(`http://localhost:3100/api/invoices/download/${invoiceId}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                responseType: 'blob', // Important: indicates that the response should be treated as a Blob
            });
            const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', `invoice-${invoiceId}.pdf`);
            document.body.appendChild(fileLink);

            fileLink.click();
            fileLink.remove(); // Clean up
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Error downloading invoice');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="w-3/5 bg-white shadow-lg rounded-lg p-8">
                <div className="flex justify-between items-center p-4">
                    <h1 className="text-3xl font-bold">Invoices</h1>
                </div>
                <div className="overflow-y-auto max-h-[60vh] pt-4">
                    <table className="table-auto w-full">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Invoice ID</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Total</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.map((invoice, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{invoice._id}</td>
                                <td className="px-4 py-2">{dayjs(invoice.date).format('DD/MM/YYYY')}</td>
                                <td className="px-4 py-2">{invoice.total}</td>
                                <td className="px-4 py-2">
                                    <button onClick={() => downloadInvoice(invoice._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/*<ToastContainer />*/}
        </div>
    );
};

export default Invoices;
