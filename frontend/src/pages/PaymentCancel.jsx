import { useEffect, useState } from "react";

const PaymentCancel = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Replace with: navigate('/my-appointments') or navigate(-1) to go back
          window.location.href = "/my-appointments";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTryAgain = () => {
    // Replace with: navigate(-1) to go back to previous page
    window.history.back();
  };

  const handleViewAppointments = () => {
    // Replace with: navigate('/my-appointments')
    window.location.href = "/my-appointments";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
        {/* Cancel Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment was not completed. You can try again or return later.
        </p>

        {/* Redirect Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Redirecting in {countdown} seconds...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-gray-400 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>

          <button
            onClick={handleViewAppointments}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            View My Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
