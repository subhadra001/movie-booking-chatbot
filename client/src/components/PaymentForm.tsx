import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BadgeCheck, CreditCard, Calendar, Lock } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface PaymentFormProps {
  amount: number;
  bookingId: number;
  onPaymentComplete: () => void;
}

export default function PaymentForm({ amount, bookingId, onPaymentComplete }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Create payment intent mutation
  const createPaymentIntentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest('POST', '/api/create-payment-intent', { amount });
      return response.json();
    }
  });

  // Confirm payment mutation
  const confirmPaymentMutation = useMutation({
    mutationFn: async (data: { paymentIntentId: string, bookingId: number }) => {
      const response = await apiRequest('POST', '/api/confirm-payment', data);
      return response.json();
    }
  });

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (cardNumber.length < 16) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid card number",
        variant: "destructive"
      });
      return;
    }
    
    if (expiry.length < 5) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please enter a valid expiry date (MM/YY)",
        variant: "destructive"
      });
      return;
    }
    
    if (cvc.length < 3) {
      toast({
        title: "Invalid CVC",
        description: "Please enter a valid CVC code",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // First, create a payment intent
      const paymentIntentResponse = await createPaymentIntentMutation.mutateAsync(amount * 100); // Convert to cents
      const { clientSecret } = paymentIntentResponse;
      
      // Extract payment intent ID from client secret
      // In a real implementation, Stripe.js would handle this
      const paymentIntentId = clientSecret.split('_secret_')[0];
      
      // Then confirm the payment
      const confirmResponse = await confirmPaymentMutation.mutateAsync({
        paymentIntentId,
        bookingId
      });
      
      if (confirmResponse.success) {
        toast({
          title: "Payment Successful",
          description: `Your payment of $${amount.toFixed(2)} has been processed successfully.`,
          variant: "default"
        });
        
        setIsProcessing(false);
        onPaymentComplete();
      } else {
        throw new Error("Payment confirmation failed");
      }
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
        <div className="text-primary font-semibold">${amount.toFixed(2)}</div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary pl-10"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                disabled={isProcessing}
              />
              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="John Smith"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary pl-10"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  disabled={isProcessing}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                CVC / CVV
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary pl-10"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                  disabled={isProcessing}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  Pay ${amount.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
        <Lock className="h-4 w-4 mr-1" /> 
        Your payment information is secure
      </div>
    </div>
  );
}