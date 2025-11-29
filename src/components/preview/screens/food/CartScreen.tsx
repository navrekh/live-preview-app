import React, { useState } from 'react';
import { ScreenProps } from '../../types';
import { ArrowLeft, Plus, Minus, Trash2, Tag, CreditCard } from 'lucide-react';

const initialCart = [
  { id: '1', name: 'Margherita Pizza', price: 299, quantity: 2 },
  { id: '2', name: 'Garlic Bread', price: 149, quantity: 1 },
];

export function CartScreen({ theme, onNavigate }: ScreenProps) {
  const [cart, setCart] = useState(initialCart);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 40;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discount;

  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b">
        <button
          onClick={() => onNavigate('restaurant')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">My Cart</h1>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4">
            <span className="text-5xl mb-4">🛒</span>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              Add items from a restaurant to get started
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: theme.primary }}
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Restaurant Info */}
            <div className="bg-white rounded-xl p-3 flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍕</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Pizza Palace</h3>
                <p className="text-xs text-gray-500">Italian • 25-35 min</p>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl divide-y">
              {cart.map(item => (
                <div key={item.id} className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-xl">🍕</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: theme.primary }}>
                      ₹{item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 text-sm outline-none"
                  disabled={promoApplied}
                />
                <button
                  onClick={applyPromo}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: promoApplied ? '#10b98120' : `${theme.primary}20`,
                    color: promoApplied ? '#10b981' : theme.primary
                  }}
                >
                  {promoApplied ? 'Applied!' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs text-green-600 mt-2">🎉 10% discount applied!</p>
              )}
            </div>

            {/* Bill Details */}
            <div className="bg-white rounded-xl p-3 space-y-2">
              <h4 className="font-semibold text-sm mb-2">Bill Details</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Item Total</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span style={{ color: theme.primary }}>₹{total}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="bg-white border-t p-4">
          <button
            onClick={() => onNavigate('checkout')}
            className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.primary }}
          >
            <CreditCard className="w-4 h-4" />
            Proceed to Pay ₹{total}
          </button>
        </div>
      )}
    </div>
  );
}
