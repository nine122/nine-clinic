import { useEffect, useState } from "react";

const PaymentSuccess = () => {
  // In your actual app, replace these with your real router hooks
  const appointmentId = "sample-appointment-id"; // Replace with: searchParams.get("appointmentId")
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (appointmentId) {
      console.log("Appointment ID paid:", appointmentId);
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Replace with: navigate('/my-appointments')
          window.location.href = "/my-appointments";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [appointmentId]);

  const handleViewAppointments = () => {
    // Replace with: navigate('/my-appointments')
    window.location.href = "/my-appointments";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-600 mb-8">
          Your appointment has been confirmed.
        </p>

        {/* Redirect Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Redirecting in {countdown} seconds...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleViewAppointments}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          View My Appointments
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
