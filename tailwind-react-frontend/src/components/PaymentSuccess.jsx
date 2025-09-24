// PaymentSuccess.jsx (Hardened with XSS protections)
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Simple sanitization utility to strip dangerous characters
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>"'`]/g, '');
};

// Optional regex to validate Stripe session IDs
const isValidSessionId = (id) => {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]+$/.test(id);
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  // ✅ Sanitize and validate session_id
  const rawSessionId = searchParams.get('session_id') || '';
  const confirmedDeliveryId = sanitizeInput(rawSessionId);

  useEffect(() => {
    if (confirmedDeliveryId && isValidSessionId(confirmedDeliveryId)) {
      fetch("http://localhost:5004/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: confirmedDeliveryId }) 
      })
        .then(res => res.json()) 
        .then(data => {
          setPayment(data); 
          setLoading(false); 
        })
        .catch(error => {
          console.error("Error confirming payment:", error);
          setLoading(false);
        });
    } else {
      console.warn("Invalid or missing session_id in URL");
      setLoading(false);
    }
  }, [confirmedDeliveryId]);

  // While loading payment details
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg font-semibold text-gray-700">
          Loading payment details...
        </div>
      </div>
    );
  }

  // If no payment data
  if (!payment) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-lg font-semibold text-red-600">
          Error: No payment data found!
        </div>
      </div>
    );
  }

  const handleTrackOrder = () => {
    if (isValidSessionId(confirmedDeliveryId)) {
      navigate(`/track/${confirmedDeliveryId}`);
    } else {
      alert("Invalid delivery ID.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 py-10 px-4 flex flex-col items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>

        <div className="bg-green-100 p-4 rounded-md mb-6">
          {/* ✅ Defensive rendering */}
          <p className="text-lg text-gray-700">
            Order ID:{" "}
            <strong>{sanitizeInput(String(payment.orderId || "N/A"))}</strong>
          </p>
          <p className="text-lg text-gray-700">
            Amount:{" "}
            <strong>LKR {Number(payment.amount) || 0}</strong>
          </p>
          <p className="text-lg text-gray-700">
            Status:{" "}
            <strong>{sanitizeInput(String(payment.paymentStatus || "N/A"))}</strong>
          </p>
        </div>

        <button
          onClick={handleTrackOrder} 
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300"
        >
          🚚 Track Your Order
        </button>
      </div>
    </div>
  );
}


// restaurantId as ObjectId forces callers to supply properly-formed Mongo IDs and makes it easier to validate ObjectId.isValid() in controllers. This prevents attackers from supplying objects like { $ne: null } that could alter queries.

// Subschema for items with required, min, maxlength prevents negative prices, zero quantities and extremely long/HTML-laden names (helps reduce stored XSS).

// strict: 'throw' causes Mongoose to throw if unknown properties are passed — this prevents unexpected data from being written and reduces mass-assignment risks.

// timestamps and indexes improve auditability and performance (useful during logging/monitoring — helps OWASP A09).

// Range validation for lat/lng prevents invalid coordinate values that can break map code or be used for injection-like attacks later.

// toJSON transform removes __v and centralizes output sanitization before sending to clients.