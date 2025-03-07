import { useState } from 'react';

interface EmailProp {
  customerEmail: string;
}

const StripePayment: React.FC<EmailProp> = ({ customerEmail }) => {
  const [loading, setLoading] = useState<boolean>(false);
  // Inicializa con string vacío en lugar de null para evitar problemas de tipo
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleCreatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: customerEmail,
          productName: 'Pagos CRM',
          price: 1999, // Precio en dólares (ej. $19.99)
        }),
      });

      const data = await response.json();
      if (data.url) {
        setPaymentLink(data.url);
      }
    } catch (error) {
      console.error("Error al crear el enlace de pago:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      // Copiar el texto al portapapeles
      await navigator.clipboard.writeText(paymentLink);
      setCopied(true);

      // Restablecer el estado del mensaje después de 2 segundos
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles: ', err);
    }
  };

  return (
    <div className="mt-2 rounded-lg">
      {paymentLink ? (
        <div className="mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-2 mt-2 w-full max-w-[23rem]">
              <label htmlFor="npm-install" className="sr-only">Label</label>
              <input
                id="npm-install"
                type="text"
                className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-orange-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                value={paymentLink}
                disabled
                readOnly
              />
              <button
                onClick={handleCopy}
                className="col-span-2 text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-600 items-center inline-flex justify-center"
              >
                <span id="default-message">{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleCreatePayment}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 w-full text-white rounded-lg"
        >
          {loading ? 'Generando link...' : 'Crear Pago'}
        </button>
      )}
    </div>
  );
};

export default StripePayment;