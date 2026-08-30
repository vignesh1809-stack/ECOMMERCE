import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Lock, 
  CreditCard, 
  Building2, 
  Wallet, 
  Smartphone, 
  QrCode,
  Truck,
  MapPin,
  ChevronRight,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import type { Order } from '../../types';

export const CashfreeCheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setCheckoutOpen, formatPrice, setOrderSuccess } = useUI();
  const { items, subtotal, shipping, tax, discount, total, updateQuantity, removeItem, clearCart } = useCart();

  // Active Flipkart Step: 1 (Login), 2 (Address), 3 (Order Summary), 4 (Payment)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(2);

  // Address State
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      name: 'Alexandra Thorne',
      phone: '9876543210',
      type: 'HOME',
      street: '108 Haute Avenue, Near Sea Link, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      isDefault: true,
    },
    {
      id: 'addr_2',
      name: 'Alexandra Thorne (Office)',
      phone: '9876543210',
      type: 'WORK',
      street: 'Level 14, Tower 3, One World Center, Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013',
      isDefault: false,
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr_1');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrType, setNewAddrType] = useState<'HOME' | 'WORK'>('HOME');

  // Payment Mode State (Powered by Cashfree)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'>('upi');
  
  // UPI Sub-options
  const [upiOption, setUpiOption] = useState<'qr' | 'vpa'>('qr');
  const [upiId, setUpiId] = useState('alexandra@okhdfcbank');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('Alexandra Thorne');

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('hdfc');

  // Processing & OTP
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);

  if (!isCheckoutOpen) return null;

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrPhone || !newAddrStreet) return;
    const newId = `addr_${Date.now()}`;
    const newAddr = {
      id: newId,
      name: newAddrName,
      phone: newAddrPhone,
      type: newAddrType,
      street: newAddrStreet,
      city: newAddrCity || 'Mumbai',
      state: newAddrState || 'Maharashtra',
      pincode: newAddrPincode || '400050',
      isDefault: false,
    };
    setAddresses([newAddr, ...addresses]);
    setSelectedAddressId(newId);
    setIsAddingNewAddress(false);
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (paymentMethod === 'card' || paymentMethod === 'netbanking') {
        setShowOtpScreen(true);
      } else {
        finalizeOrder();
      }
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpScreen(false);
      finalizeOrder();
    }, 1000);
  };

  const finalizeOrder = () => {
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#2874F0', '#FB641B', '#388E3C', '#FFE500', '#121214']
      });
    } catch (err) {
      console.log('Confetti triggered');
    }

    let methodText = 'Cashfree UPI (Google Pay / PhonePe)';
    if (paymentMethod === 'card') {
      methodText = `Credit Card (ending in ${cardNumber.slice(-4) || '9128'})`;
    } else if (paymentMethod === 'netbanking') {
      methodText = `Net Banking (${selectedBank.toUpperCase()})`;
    } else if (paymentMethod === 'wallet') {
      methodText = 'Paytm / Mobikwik Wallet';
    } else if (paymentMethod === 'cod') {
      methodText = 'Cash on Delivery (COD)';
    }

    const generatedOrder: Order = {
      id: `OD${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...items],
      subtotal,
      shipping,
      tax,
      discount,
      total,
      shippingAddress: {
        fullName: activeAddress.name,
        email: 'alexandra.thorne@example.com',
        street: activeAddress.street,
        city: activeAddress.city,
        state: activeAddress.state,
        zip: activeAddress.pincode,
        country: 'India',
      },
      deliveryEstimate: 'Tomorrow by 9:00 PM (Flipkart Express)',
      paymentMethod: methodText,
      status: 'confirmed',
    };

    clearCart();
    setCheckoutOpen(false);
    setOrderSuccess(generatedOrder);
  };

  return (
    <div className="fk-checkout-overlay" onClick={() => setCheckoutOpen(false)}>
      <div className="fk-checkout-modal" onClick={e => e.stopPropagation()}>
        
        {/* TOP FLIPKART HEADER */}
        <header className="fk-header">
          <div className="fk-header-inner">
            <div className="fk-brand-section">
              <div className="fk-logo-box">
                <span className="fk-logo-main">Bluez Luxoria</span>
                <span className="fk-logo-tag">Explore <span className="fk-plus-gold">Plus ✦</span></span>
              </div>
            </div>

            <div className="fk-header-assurances">
              <span className="fk-assurance-item">
                <ShieldCheck size={16} className="fk-shield-icon" />
                100% Safe & Secure Checkout
              </span>
            </div>

            <button 
              className="fk-close-btn" 
              onClick={() => setCheckoutOpen(false)}
              aria-label="Close Checkout"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* 3D SECURE OTP MODAL VIEW */}
        {showOtpScreen ? (
          <div className="fk-otp-backdrop">
            <div className="fk-otp-card">
              <div className="fk-otp-header">
                <div className="fk-bank-icon-circle">
                  <ShieldCheck size={26} color="#2874F0" />
                </div>
                <h3>Bank 3D Secure Authorization</h3>
                <p>Enter the 6-digit OTP sent to linked mobile <strong>+91 ••••• ••210</strong></p>
              </div>

              <form onSubmit={handleVerifyOtp} className="fk-otp-form">
                <input
                  type="text"
                  className="fk-otp-input"
                  placeholder="• • • • • •"
                  maxLength={6}
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  required
                />

                <button 
                  type="button" 
                  className="fk-otp-demo-btn"
                  onClick={() => setOtpValue('842910')}
                >
                  ✨ Autofill Demo OTP (842910)
                </button>

                <div className="fk-otp-footer-row">
                  <span>Resend in <strong>30s</strong></span>
                  <span className="fk-secure-pill"><Lock size={12} /> 256-Bit SSL Encrypted</span>
                </div>

                <div className="fk-otp-btn-row">
                  <button 
                    type="button" 
                    className="fk-btn-subtle"
                    onClick={() => setShowOtpScreen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="fk-btn-orange"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={15} className="cf-spin" /> Authorizing...
                      </span>
                    ) : (
                      <span>Complete Payment • {formatPrice(total)}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* MAIN 2-COLUMN FLIPKART WORKSPACE */
          <div className="fk-checkout-body">
            
            {/* LEFT COLUMN: 4 Progressive Step Cards */}
            <div className="fk-steps-column">
              
              {/* ========================================================
                  STEP 1: LOGIN (Completed)
                  ======================================================== */}
              <div className="fk-step-card fk-step-completed">
                <div className="fk-step-header">
                  <div className="fk-step-num-badge">1</div>
                  <div className="fk-step-title-wrap">
                    <span className="fk-step-title">LOGIN</span>
                    <Check size={16} className="fk-step-check" />
                  </div>
                  <button 
                    className="fk-change-btn" 
                    onClick={() => setCurrentStep(1)}
                    type="button"
                  >
                    CHANGE
                  </button>
                </div>
                <div className="fk-step-summary-content">
                  <span className="fk-user-name">Alexandra Thorne</span>
                  <span className="fk-user-phone">+919876543210</span>
                </div>
              </div>

              {/* ========================================================
                  STEP 2: DELIVERY ADDRESS
                  ======================================================== */}
              <div className={`fk-step-card ${currentStep === 2 ? 'active' : currentStep > 2 ? 'fk-step-completed' : ''}`}>
                <div className={`fk-step-header ${currentStep === 2 ? 'fk-header-active' : ''}`}>
                  <div className="fk-step-num-badge">2</div>
                  <div className="fk-step-title-wrap">
                    <span className="fk-step-title">DELIVERY ADDRESS</span>
                    {currentStep > 2 && <Check size={16} className="fk-step-check" />}
                  </div>
                  {currentStep > 2 && (
                    <button 
                      className="fk-change-btn" 
                      onClick={() => setCurrentStep(2)}
                      type="button"
                    >
                      CHANGE
                    </button>
                  )}
                </div>

                {currentStep === 2 ? (
                  <div className="fk-step-active-content">
                    {/* Saved Addresses Radio List */}
                    <div className="fk-address-list">
                      {addresses.map(addr => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div 
                            key={addr.id} 
                            className={`fk-address-row ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedAddressId(addr.id)}
                          >
                            <input 
                              type="radio" 
                              name="selected_address" 
                              checked={isSelected}
                              onChange={() => setSelectedAddressId(addr.id)}
                            />
                            <div className="fk-address-details">
                              <div className="fk-addr-name-row">
                                <span className="fk-addr-name">{addr.name}</span>
                                <span className="fk-addr-type-tag">{addr.type}</span>
                                <span className="fk-addr-phone">{addr.phone}</span>
                              </div>
                              <p className="fk-addr-full-text">
                                {addr.street}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                              </p>

                              {isSelected && (
                                <button 
                                  className="fk-btn-orange fk-deliver-here-btn"
                                  onClick={() => setCurrentStep(3)}
                                  type="button"
                                >
                                  DELIVER HERE
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add New Address Toggle */}
                    {!isAddingNewAddress ? (
                      <button 
                        className="fk-add-address-trigger"
                        onClick={() => setIsAddingNewAddress(true)}
                        type="button"
                      >
                        <Plus size={16} />
                        <span>Add a new address</span>
                      </button>
                    ) : (
                      <form onSubmit={handleAddNewAddress} className="fk-new-addr-form">
                        <div className="fk-form-title">ADD A NEW ADDRESS</div>
                        <div className="fk-form-grid-2">
                          <input
                            type="text"
                            placeholder="Name *"
                            className="fk-input"
                            value={newAddrName}
                            onChange={e => setNewAddrName(e.target.value)}
                            required
                          />
                          <input
                            type="text"
                            placeholder="10-digit mobile number *"
                            className="fk-input"
                            value={newAddrPhone}
                            onChange={e => setNewAddrPhone(e.target.value)}
                            required
                          />
                        </div>
                        <div className="fk-form-grid-2">
                          <input
                            type="text"
                            placeholder="Pincode *"
                            className="fk-input"
                            value={newAddrPincode}
                            onChange={e => setNewAddrPincode(e.target.value)}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Locality / Area *"
                            className="fk-input"
                            value={newAddrCity}
                            onChange={e => setNewAddrCity(e.target.value)}
                            required
                          />
                        </div>
                        <textarea
                          placeholder="Address (Area and Street) *"
                          className="fk-textarea"
                          rows={2}
                          value={newAddrStreet}
                          onChange={e => setNewAddrStreet(e.target.value)}
                          required
                        />
                        <div className="fk-radio-type-row">
                          <label>
                            <input
                              type="radio"
                              name="addr_type"
                              checked={newAddrType === 'HOME'}
                              onChange={() => setNewAddrType('HOME')}
                            /> Home (All day delivery)
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="addr_type"
                              checked={newAddrType === 'WORK'}
                              onChange={() => setNewAddrType('WORK')}
                            /> Work (Delivery between 10 AM - 5 PM)
                          </label>
                        </div>
                        <div className="fk-form-action-row">
                          <button type="submit" className="fk-btn-orange">SAVE AND DELIVER HERE</button>
                          <button 
                            type="button" 
                            className="fk-btn-subtle"
                            onClick={() => setIsAddingNewAddress(false)}
                          >
                            CANCEL
                          </button>
                        </div>
                      </form>
                    )}

                  </div>
                ) : (
                  currentStep > 2 && (
                    <div className="fk-step-summary-content">
                      <span className="fk-user-name">{activeAddress.name}</span>
                      <span className="fk-summary-addr">
                        {activeAddress.street}, {activeAddress.city} - {activeAddress.pincode}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* ========================================================
                  STEP 3: ORDER SUMMARY
                  ======================================================== */}
              <div className={`fk-step-card ${currentStep === 3 ? 'active' : currentStep > 3 ? 'fk-step-completed' : ''}`}>
                <div className={`fk-step-header ${currentStep === 3 ? 'fk-header-active' : ''}`}>
                  <div className="fk-step-num-badge">3</div>
                  <div className="fk-step-title-wrap">
                    <span className="fk-step-title">ORDER SUMMARY</span>
                    {currentStep > 3 && <Check size={16} className="fk-step-check" />}
                  </div>
                  {currentStep > 3 && (
                    <button 
                      className="fk-change-btn" 
                      onClick={() => setCurrentStep(3)}
                      type="button"
                    >
                      CHANGE
                    </button>
                  )}
                </div>

                {currentStep === 3 ? (
                  <div className="fk-step-active-content">
                    {/* Cart Items List */}
                    <div className="fk-items-container">
                      {items.map(item => (
                        <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="fk-item-row">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.title} 
                            className="fk-item-thumb"
                          />
                          <div className="fk-item-info">
                            <h4 className="fk-item-title">{item.product.title}</h4>
                            <div className="fk-item-meta">
                              <span>Size: <strong>{item.selectedSize}</strong></span>
                              <span>•</span>
                              <span>Color: <strong>{item.selectedColor}</strong></span>
                              <span>•</span>
                              <span className="fk-seller-badge">Seller: Bluez Luxoria Verified</span>
                            </div>
                            
                            <div className="fk-item-price-line">
                              <span className="fk-final-price">{formatPrice(item.product.price)}</span>
                              {item.product.originalPrice && (
                                <>
                                  <span className="fk-strike-price">{formatPrice(item.product.originalPrice)}</span>
                                  <span className="fk-discount-badge">
                                    {Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}% Off
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="fk-item-actions">
                              <div className="fk-qty-pill">
                                <button 
                                  onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                                  className="fk-qty-btn"
                                >
                                  -
                                </button>
                                <span className="fk-qty-val">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                                  className="fk-qty-btn"
                                >
                                  +
                                </button>
                              </div>
                              <button 
                                className="fk-remove-link"
                                onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>

                          <div className="fk-delivery-col">
                            <span className="fk-delivery-date">Delivery by Tomorrow, 9 PM</span>
                            <span className="fk-delivery-free">FREE <span className="fk-strike">₹40</span></span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Email Confirmation Note & Continue */}
                    <div className="fk-order-confirmation-footer">
                      <span className="fk-confirm-email">
                        Order confirmation email will be sent to <strong>alexandra.thorne@example.com</strong>
                      </span>
                      <button 
                        className="fk-btn-orange fk-continue-btn"
                        onClick={() => setCurrentStep(4)}
                        type="button"
                      >
                        CONTINUE
                      </button>
                    </div>
                  </div>
                ) : (
                  currentStep > 3 && (
                    <div className="fk-step-summary-content">
                      <span>{items.length} Item(s) in order</span>
                    </div>
                  )
                )}
              </div>

              {/* ========================================================
                  STEP 4: PAYMENT OPTIONS (Powered by Cashfree)
                  ======================================================== */}
              <div className={`fk-step-card ${currentStep === 4 ? 'active' : ''}`}>
                <div className={`fk-step-header ${currentStep === 4 ? 'fk-header-active' : ''}`}>
                  <div className="fk-step-num-badge">4</div>
                  <div className="fk-step-title-wrap">
                    <span className="fk-step-title">PAYMENT OPTIONS</span>
                    <span className="fk-powered-by">Powered by Cashfree</span>
                  </div>
                </div>

                {currentStep === 4 && (
                  <form onSubmit={handleInitiatePayment} className="fk-step-active-content">
                    
                    {/* Payment Mode Radios */}
                    <div className="fk-payment-options-list">
                      
                      {/* OPTION 1: UPI */}
                      <label className={`fk-pay-radio-row ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                        <div className="fk-radio-header-line">
                          <input 
                            type="radio" 
                            name="fk_payment" 
                            checked={paymentMethod === 'upi'}
                            onChange={() => setPaymentMethod('upi')}
                          />
                          <div className="fk-pay-title-group">
                            <span className="fk-pay-main-title">UPI</span>
                            <span className="fk-pay-sub-text">Google Pay, PhonePe, Paytm, BHIM & QR</span>
                          </div>
                          <span className="fk-fast-badge">FASTEST</span>
                        </div>

                        {paymentMethod === 'upi' && (
                          <div className="fk-pay-expanded-box">
                            <div className="fk-upi-sub-switch">
                              <button 
                                type="button"
                                className={`fk-upi-pill ${upiOption === 'qr' ? 'active' : ''}`}
                                onClick={() => setUpiOption('qr')}
                              >
                                Scan QR Code
                              </button>
                              <button 
                                type="button"
                                className={`fk-upi-pill ${upiOption === 'vpa' ? 'active' : ''}`}
                                onClick={() => setUpiOption('vpa')}
                              >
                                Enter UPI ID
                              </button>
                            </div>

                            {upiOption === 'qr' ? (
                              <div className="fk-qr-box-inner">
                                <div className="fk-qr-frame">
                                  <QrCode size={90} color="#2874F0" />
                                </div>
                                <div className="fk-qr-help-text">
                                  <span className="fk-qr-bold">Scan with any UPI app on your phone</span>
                                  <span className="fk-app-chips">GPay • PhonePe • Paytm • BHIM</span>
                                </div>
                              </div>
                            ) : (
                              <div className="fk-vpa-input-wrap">
                                <input
                                  type="text"
                                  className="fk-input"
                                  placeholder="Enter UPI ID (e.g. mobile@okhdfcbank)"
                                  value={upiId}
                                  onChange={e => setUpiId(e.target.value)}
                                />
                              </div>
                            )}

                            <button 
                              type="submit" 
                              className="fk-btn-orange fk-pay-now-btn"
                              disabled={isProcessing}
                            >
                              PAY {formatPrice(total)}
                            </button>
                          </div>
                        )}
                      </label>

                      {/* OPTION 2: Credit / Debit / ATM Card */}
                      <label className={`fk-pay-radio-row ${paymentMethod === 'card' ? 'selected' : ''}`}>
                        <div className="fk-radio-header-line">
                          <input 
                            type="radio" 
                            name="fk_payment" 
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                          />
                          <div className="fk-pay-title-group">
                            <span className="fk-pay-main-title">Credit / Debit / ATM Card</span>
                            <span className="fk-pay-sub-text">Add and secure your card as per RBI guidelines</span>
                          </div>
                        </div>

                        {paymentMethod === 'card' && (
                          <div className="fk-pay-expanded-box">
                            <div className="fk-card-form">
                              <input
                                type="text"
                                className="fk-input"
                                placeholder="Card Number (•••• •••• •••• ••••)"
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value)}
                                required
                              />
                              <div className="fk-grid-2">
                                <input
                                  type="text"
                                  className="fk-input"
                                  placeholder="Valid Thru (MM/YY)"
                                  value={cardExpiry}
                                  onChange={e => setCardExpiry(e.target.value)}
                                  required
                                />
                                <input
                                  type="password"
                                  className="fk-input"
                                  placeholder="CVV"
                                  maxLength={4}
                                  value={cardCvc}
                                  onChange={e => setCardCvc(e.target.value)}
                                  required
                                />
                              </div>
                              <button 
                                type="submit" 
                                className="fk-btn-orange fk-pay-now-btn"
                                disabled={isProcessing}
                              >
                                PAY {formatPrice(total)}
                              </button>
                            </div>
                          </div>
                        )}
                      </label>

                      {/* OPTION 3: Net Banking */}
                      <label className={`fk-pay-radio-row ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                        <div className="fk-radio-header-line">
                          <input 
                            type="radio" 
                            name="fk_payment" 
                            checked={paymentMethod === 'netbanking'}
                            onChange={() => setPaymentMethod('netbanking')}
                          />
                          <div className="fk-pay-title-group">
                            <span className="fk-pay-main-title">Net Banking</span>
                            <span className="fk-pay-sub-text">All Major Indian Banks Supported</span>
                          </div>
                        </div>

                        {paymentMethod === 'netbanking' && (
                          <div className="fk-pay-expanded-box">
                            <div className="fk-banks-grid">
                              {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank'].map(b => (
                                <label key={b} className="fk-bank-radio-pill">
                                  <input 
                                    type="radio" 
                                    name="netbank" 
                                    checked={selectedBank === b}
                                    onChange={() => setSelectedBank(b)}
                                  />
                                  <span>{b}</span>
                                </label>
                              ))}
                            </div>
                            <button 
                              type="submit" 
                              className="fk-btn-orange fk-pay-now-btn"
                              disabled={isProcessing}
                            >
                              PAY {formatPrice(total)}
                            </button>
                          </div>
                        )}
                      </label>

                      {/* OPTION 4: Wallets / Pay Later */}
                      <label className={`fk-pay-radio-row ${paymentMethod === 'wallet' ? 'selected' : ''}`}>
                        <div className="fk-radio-header-line">
                          <input 
                            type="radio" 
                            name="fk_payment" 
                            checked={paymentMethod === 'wallet'}
                            onChange={() => setPaymentMethod('wallet')}
                          />
                          <div className="fk-pay-title-group">
                            <span className="fk-pay-main-title">Wallets & PayLater</span>
                            <span className="fk-pay-sub-text">Paytm, Mobikwik, Simpl</span>
                          </div>
                        </div>

                        {paymentMethod === 'wallet' && (
                          <div className="fk-pay-expanded-box">
                            <button 
                              type="submit" 
                              className="fk-btn-orange fk-pay-now-btn"
                              disabled={isProcessing}
                            >
                              CONTINUE WITH WALLET • {formatPrice(total)}
                            </button>
                          </div>
                        )}
                      </label>

                      {/* OPTION 5: Cash on Delivery */}
                      <label className={`fk-pay-radio-row ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                        <div className="fk-radio-header-line">
                          <input 
                            type="radio" 
                            name="fk_payment" 
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                          />
                          <div className="fk-pay-title-group">
                            <span className="fk-pay-main-title">Cash on Delivery</span>
                            <span className="fk-pay-sub-text">Pay digitally or cash at doorstep</span>
                          </div>
                        </div>

                        {paymentMethod === 'cod' && (
                          <div className="fk-pay-expanded-box">
                            <button 
                              type="submit" 
                              className="fk-btn-orange fk-pay-now-btn"
                              disabled={isProcessing}
                            >
                              CONFIRM ORDER • {formatPrice(total)}
                            </button>
                          </div>
                        )}
                      </label>

                    </div>

                  </form>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky Flipkart "PRICE DETAILS" Card */}
            <div className="fk-price-sidebar-column">
              <div className="fk-price-card">
                <div className="fk-price-card-header">
                  <span>PRICE DETAILS</span>
                </div>

                <div className="fk-price-card-body">
                  <div className="fk-price-row">
                    <span>Price ({items.length} item{items.length > 1 ? 's' : ''})</span>
                    <span>{formatPrice(subtotal + (discount || 0))}</span>
                  </div>

                  {discount > 0 && (
                    <div className="fk-price-row fk-green-text">
                      <span>Discount</span>
                      <span>−{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="fk-price-row">
                    <span>Delivery Charges</span>
                    <span className="fk-green-text">
                      <span className="fk-strike">₹40</span> FREE
                    </span>
                  </div>

                  <div className="fk-price-row">
                    <span>Secured Packaging Fee</span>
                    <span className="fk-green-text">FREE</span>
                  </div>

                  <div className="fk-total-payable-row">
                    <span className="fk-total-label">Total Payable</span>
                    <span className="fk-total-amount">{formatPrice(total)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="fk-savings-banner">
                      <span>You will save {formatPrice(discount)} on this order</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Badge Below Price Card */}
              <div className="fk-trust-badge-card">
                <ShieldCheck size={26} color="#878787" />
                <div className="fk-trust-text">
                  <span className="fk-trust-title">Safe and Secure Payments</span>
                  <span className="fk-trust-desc">100% Authentic products • Easy returns</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
