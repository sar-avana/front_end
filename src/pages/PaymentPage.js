import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/order/${orderId}`);
                const order = response.data;

                // Check if the payment is confirmed
                if (order.paymentStatus === 'Paid') {
                    setPaymentStatus('Paid');
                    navigate(`/order/${orderId}`); // Navigate to Order Confirmation page
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            } finally {
                setLoading(false);
            }
        };

        // Polling interval to check the payment status every 5 seconds
        const interval = setInterval(checkPaymentStatus, 5000);

        return () => clearInterval(interval); // Clear the interval on component unmount
    }, [orderId, navigate]);

    return (
        <div>
            {loading ? (
                <p>Loading payment details...</p>
            ) : paymentStatus === 'Paid' ? (
                <p>Payment successful! Redirecting...</p>
            ) : (
                <p>Waiting for payment confirmation...</p>
            )}
        </div>
    );
};

export default PaymentPage;
