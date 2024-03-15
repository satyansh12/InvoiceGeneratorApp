import React, {useEffect, useState} from 'react';
import "./AddProduct.module.css"
import LevitationLogo from "./../../assets/images/levitation_logo.svg"
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {useIsomorphicLayoutEffect} from "../../hooks/useIsomorphicLayoutEffect.ts"; // Import ReactDOMServer

const AddProduct = () => {
    const [isClient, setIsClient] = useState(false);

    const jwtToken = localStorage.getItem("jwt");
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        quantity: 0,
        rate: 0,
    });
    const [total, setTotal] = useState(0);
    const [gst, setGst] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    //
    const showErrorToast = () => {
        toast.error("Error Notification !");
    };
    const showSuccessInvoiceToast = () => {
        toast.success("Created Invoice Successfully \n Goto Invoices Section to Download",{});
    };
    useEffect(() => {
        // This effect will run only once, after the initial render, setting isClient to true
        setIsClient(true);
    }, []);
    useIsomorphicLayoutEffect(() => {
        // Logic that requires useLayoutEffect, e.g., DOM measurements, updates that need to be synchronous with painting
        console.log('Component has mounted or updated');
    }, []); // Dependency array
    useEffect(() => {
        const checkIsLoggedIn = async () => {
            try {
                const response = await axios.get('http://localhost:3100/api/isloggedin', {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                if (response.data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUserId(response.data.user.user._id);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                localStorage.removeItem("jwt");
                navigate("/register");
                setIsLoggedIn(false);
                console.error('Error fetching login status:', error);
            }
        };
        checkIsLoggedIn();
    }, []);

    useEffect(() => {
        // Recalculate totals whenever products change or the current product's quantity or rate changes
        const newTotal = products.reduce((acc, curr) => acc + (curr.quantity * curr.rate), 0) + (product.quantity * product.rate);
        const newGst = newTotal * 0.18; // GST is 18%
        const newGrandTotal = newTotal + newGst;

        setTotal(newTotal);
        setGst(newGst);
        setGrandTotal(newGrandTotal);
    }, [products, product.quantity, product.rate]); // Dependency array includes products, product.quantity, and product.rate

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'quantity' || name === 'rate' ? Number(value) : value; // Ensure numerical values are treated as numbers
        setProduct({ ...product, [name]: updatedValue });
    };

    // Function to validate product input fields
    const validateProductInput = () => {
        if (!product.name || product.quantity <= 0 || product.rate <= 0) {
            toast.error("Please fill in all product fields correctly.");
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateProductInput()) {
            const total = product.quantity * product.rate;
            const newProduct = { ...product, total };
            // setProducts([...products, newProduct]);
            // setProduct({ name: '', quantity: 0, rate: 0 });
        }
    };
    const handleGenerateInvoice = async () => {
        try {
            // Submit the valid products as an invoice
            const response = await axios.post('http://localhost:3100/api/invoices', {
                products: products,
                createdBy: userId,
            }, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            console.log('Invoice generated successfully:', response.data);
                html2canvas(document.querySelector("#capture")).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: 'a4',
                });

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasAspectRatio = canvas.height / canvas.width;
                const pdfAspectRatio = pdfHeight / pdfWidth;
                let imgHeight = pdfHeight;
                let imgWidth = pdfWidth;
                if (canvasAspectRatio > pdfAspectRatio) {
                    imgWidth = pdfHeight / canvasAspectRatio;
                } else {
                    imgHeight = pdfWidth * canvasAspectRatio;
                }
                const x = (pdfWidth - imgWidth) / 2;
                const y = (pdfHeight - imgHeight) / 2;
                pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
                pdf.save('invoice.pdf');
            });
            //  todo : do have a slight delay before executing following
            // Delay before executing the following
            setTimeout(() => {
                setProducts([]); // Clear products after saving to prevent duplicate submissions
                showSuccessInvoiceToast();
            }, 1000); // Delay of 1000 milliseconds (1 second)

        } catch (error) {
            showErrorToast();
            console.error('Error generating invoice:', error);
        }
    };    // Splitting the message by `\n` to handle new lines correctly
    const message = `Terms and Conditions
we are happy to supply any further information you may need and trust that you call on us to fill your order.
wich will recieve our pormpt and carefull attention`.split('\n').map((line, index) => (
        // Using <span> and <br /> for new lines, could also use <p> for paragraphs
        <span key={index}>{line}<br/></span>
    ));

    return (
        <div id="capture" className="flex flex-col justify-between h-screen bg-white shadow-lg rounded-lg p-8 w-3/5 mx-auto"
             style={{paddingTop: '2%'}}>
            <div
                 style={{paddingTop: '2%'}}>
                <div>
                    <div className="flex justify-between items-center p-4">
                        <div>
                            <h1 className="text-3xl font-bold">Invoice Generator</h1>
                            <p className="text-base">Sample output should be this</p>
                        </div>
                        <div>
                            <Link to="/add-products"
                                  className={`flex items-center justify-start p-2 border-none cursor-pointer font-semibold mt-4 hover:bg-gray-200 ${location.pathname === "/add-products" ? "text-black" : "text-gray-700"}`}>
                                <img src={LevitationLogo} alt="Levitation Logo" className="w-24 mr-2"/>
                                <div className="flex flex-col">
                                    <b className="text-xl">Levitation</b>
                                    <span className="text-base">infotech</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Scrollable Table Container */}
                        <div className="overflow-y-auto max-h-[60vh] pt-20">
                            {/* Table-like layout */}
                            <table className="table-auto w-full">
                                <thead>
                                <tr>
                                    <th className="px-8 py-4 text-lg text-left">Product</th>
                                    <th className="px-8 py-4 text-lg text-left">Qty</th>
                                    <th className="px-8 py-4 text-lg text-left">Rate</th>
                                    <th className="px-8 py-4 text-lg text-left">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        <td className="px-8 py-4">{product.name}</td>
                                        <td className="px-8 py-4">{product.quantity}</td>
                                        <td className="px-8 py-4">{product.rate}</td>
                                        <td className="px-8 py-4">{product.total}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="px-8 py-4">
                                        <input
                                            type="text"
                                            name="name"
                                            value={product.name}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg p-4"
                                        />
                                    </td>
                                    <td className="px-8 py-4">
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={product.quantity}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg p-4"
                                        />
                                    </td>
                                    <td className="px-8 py-4">
                                        <input
                                            type="number"
                                            name="rate"
                                            value={product.rate}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg p-4"
                                        />
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="text-lg">{product.quantity * product.rate}</span>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between">
                            <button type="submit"
                                    data-html2canvas-ignore="true"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Add Product
                            </button>
                            <button onClick={handleGenerateInvoice}
                                    data-html2canvas-ignore="true"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Generate Invoice
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-right w-1/2 ml-auto">
                        <div className="flex justify-between p-4">
                            <span className="text-lg font-bold">Total:</span>
                            <span className="text-lg font-bold">INR {total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between p-4 py-2 italic" style={{fontSize: '70%'}}>
                            <span>GST (18%):</span>
                            <span>{gst.toFixed(2)}</span>
                        </div>
                        <div>
                            <hr className="my-2 bg-gray-200 border-0 h-px"/>
                            <div className="flex justify-between p-4">
                                <span className="text-lg font-bold">Grand Total:</span>
                                <span className="text-lg font-bold">INR {grandTotal.toFixed(2)}</span>
                            </div>
                            <hr className="my-2 bg-gray-200 border-0 h-px" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="self-stretch bg-black text-white text-left px-14 py-6 rounded-full text-[0.7rem]"
                 style={{backgroundImage: 'linear-gradient(to bottom, #2f2f2f, #191919)'}}>
                {message}
            </div>
            {isClient && <ToastContainer />}
        </div>
    );
};

export default AddProduct;
