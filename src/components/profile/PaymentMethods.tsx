import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { useProfileStore } from '../../stores/profileStore';

interface PaymentMethod {
  id: string;
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export default function PaymentMethods() {
  const { profile } = useProfileStore();
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement Stripe card addition
      setShowAddCard(false);
    } catch (error) {
      console.error('Error adding card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCard = async (paymentMethodId: string) => {
    try {
      // TODO: Implement Stripe card removal
      setPaymentMethods(prev =>
        prev.filter(method => method.id !== paymentMethodId)
      );
    } catch (error) {
      console.error('Error removing card:', error);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      // TODO: Implement setting default payment method
      setPaymentMethods(prev =>
        prev.map(method => ({
          ...method,
          is_default: method.id === paymentMethodId
        }))
      );
    } catch (error) {
      console.error('Error setting default card:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Payment Methods
        </h2>
        <Button
          variant="secondary"
          onClick={() => setShowAddCard(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Card</span>
        </Button>
      </div>

      {showAddCard && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleAddCard} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  label="Card Number"
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                required
              />
              <Input
                label="CVC"
                placeholder="123"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddCard(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="yellow"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Card'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="flex items-center space-x-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {method.brand} •••• {method.last4}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Expires {method.exp_month}/{method.exp_year}
                </p>
              </div>
              {method.is_default && (
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Default
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {!method.is_default && (
                <Button
                  variant="secondary"
                  onClick={() => handleSetDefault(method.id)}
                >
                  Set Default
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => handleRemoveCard(method.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {paymentMethods.length === 0 && !showAddCard && (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No payment methods added yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
