import axios from "../api/axios";

function PayButton() {
  const handlePay = async () => {
    const phone = prompt('Enter phone number (2547XXXXXXXX):');
    if (!phone) return alert('Phone number required');

    try {
      const res = await axios.post('/stkpush', { phone });
      console.log(res)
      alert('Payment prompt sent! Check your phone.');
    } catch {
      alert('Failed to send payment prompt');
    }
  };

  return (
    <button onClick={handlePay} className="pr-4 text-blue-600">
      Pay KSh 250
    </button>
  );
}

export default PayButton;
