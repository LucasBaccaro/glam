// Mock implementation for Mercado Pago (temporary)

export const processPayment = async (paymentData) => {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock: siempre devuelve éxito
  return {
    success: true,
    paymentId: `mock_payment_${Date.now()}`,
    status: 'approved',
    amount: paymentData.amount,
    paymentMethod: 'credit_card',
    transactionDate: new Date().toISOString()
  };
};

export const getPaymentStatus = async (paymentId) => {
  // Mock: siempre devuelve aprobado
  return {
    success: true,
    status: 'approved',
    paymentId: paymentId
  };
};
