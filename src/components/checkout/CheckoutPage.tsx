import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  Lock, 
  CreditCard, 
  Building2, 
  Wallet, 
  Smartphone, 
  QrCode, 
  MapPin, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Sparkles,
  ShoppingBag,
  Truck,
  Award,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import type { Order } from '../../types';

export const CheckoutPage: React.FC = () => {
  const { setCheckoutOpen, formatPrice, setOrderSuccess } = useUI();
  const { items, subtotal, shipping, tax, discount, total, updateQuantity, removeItem, clearCart } = useCart();

  // Active Step: 1 (Account), 2 (Address), 3 (Review), 4 (Payment)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(2);
  const [isMobilePriceExpanded, setIsMobilePriceExpanded] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      name: 'Alexandra Thorne',
      phone: '+91 9876543210',
      type: 'RESIDENCE',
      street: '108 Haute Avenue, Near Sea Link, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      isDefault: true,
    },
    {
      id: 'addr_2',
      name: 'Alexandra Thorne (Design Studio)',
      phone: '+91 9876543210',
      type: 'ATELIER / STUDIO',
      street: 'Level 14, Tower 3, One World Center, Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013',
      isDefault: false,
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr_1');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New Address Form
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrType, setNewAddrType] = useState<'RESIDENCE' | 'ATELIER / STUDIO'>('RESIDENCE');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'>('upi');
  const [upiOption, setUpiOption] = useState<'apps' | 'qr' | 'vpa'>('apps');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('alexandra@okhdfcbank');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('Alexandra Thorne');

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Verification & Flow
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  // Scroll to top when changing steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

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
    setCurrentStep(3);
  };

  const handleSelectAddressAndProceed = (addrId: string) => {
    setSelectedAddressId(addrId);
    setCurrentStep(3);
  };

  const handleInitiatePayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (paymentMethod === 'card' || paymentMethod === 'netbanking') {
        setShowOtpScreen(true);
      } else {
        finalizeOrder();
      }
    }, 900);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpScreen(false);
      finalizeOrder();
    }, 900);
  };

  const finalizeOrder = () => {
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#121214', '#C5A880', '#D4AF37', '#10B981', '#F6F5F2']
      });
    } catch (err) {
      console.log('Confetti triggered');
    }

    let methodText = 'Cashfree UPI (Instant Pay)';
    if (paymentMethod === 'card') {
      methodText = `Credit Card (ending in ${cardNumber.slice(-4) || '9128'})`;
    } else if (paymentMethod === 'netbanking') {
      methodText = `Net Banking (${selectedBank})`;
    } else if (paymentMethod === 'wallet') {
      methodText = 'Digital Wallet (Cashfree)';
    } else if (paymentMethod === 'cod') {
      methodText = 'Cash on Delivery (Concierge)';
    }

    const generatedOrder: Order = {
      id: `BLZ-${Math.floor(10000000 + Math.random() * 90000000)}`,
      date: new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }),
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
      deliveryEstimate: '2-3 Business Days (White Glove Courier)',
      paymentMethod: methodText,
      status: 'confirmed',
    };

    clearCart();
    setCheckoutOpen(false);
    setOrderSuccess(generatedOrder);
  };

  return (
    <div className="luxury-checkout-page">
      
      {/* TOP NAVIGATION BREADCRUMB */}
      <div className="luxury-checkout-topbar">
        <div className="app-container">
          <div className="luxury-topbar-content">
            <button 
              className="luxury-back-btn"
              onClick={() => setCheckoutOpen(false)}
              type="button"
            >
              <ArrowLeft size={16} />
              <span>Return to Boutique</span>
            </button>

            <div className="luxury-checkout-secure-badge">
              <ShieldCheck size={15} className="luxury-gold-icon" />
              <span>100% Secure Checkout</span>
            </div>
          </div>

          {/* PROGRESS STEPPER BAR (INTERACTIVE) */}
          <div className="luxury-stepper-bar">
            <div 
              className={`luxury-progress-step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`} 
              onClick={() => setCurrentStep(1)}
              role="button"
              tabIndex={0}
            >
              <div className="step-circle">{currentStep > 1 ? <Check size={12} /> : '1'}</div>
              <span className="step-label">Account</span>
            </div>
            <div className="step-connector" />
            <div 
              className={`luxury-progress-step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`} 
              onClick={() => setCurrentStep(2)}
              role="button"
              tabIndex={0}
            >
              <div className="step-circle">{currentStep > 2 ? <Check size={12} /> : '2'}</div>
              <span className="step-label">Address</span>
            </div>
            <div className="step-connector" />
            <div 
              className={`luxury-progress-step ${currentStep === 3 ? 'active' : ''}`} 
              onClick={() => setCurrentStep(3)}
              role="button"
              tabIndex={0}
            >
              <div className="step-circle">3</div>
              <span className="step-label">Order Review</span>
            </div>
            {/* Payment Gateway Step Commented Out For Now
            <div className="step-connector" />
            <div 
              className={`luxury-progress-step ${currentStep === 4 ? 'active' : ''}`}
              onClick={() => setCurrentStep(4)}
              role="button"
              tabIndex={0}
            >
              <div className="step-circle">4</div>
              <span className="step-label">Payment</span>
            </div>
            */}
          </div>

        </div>
      </div>

      {/* MOBILE PRICE SUMMARY ACCORDION BAR */}
      <div className="luxury-mobile-price-strip">
        <div className="app-container">
          <div className="mobile-strip-inner" onClick={() => setIsMobilePriceExpanded(!isMobilePriceExpanded)}>
            <div className="mobile-strip-left">
              <span className="mobile-strip-label">Total Payable</span>
              <span className="mobile-strip-amount">{formatPrice(total)}</span>
            </div>
            <div className="mobile-strip-right">
              <span className="mobile-view-details">
                {isMobilePriceExpanded ? 'Hide Details' : 'View Breakdown'}
              </span>
              {isMobilePriceExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {isMobilePriceExpanded && (
            <div className="mobile-price-breakdown-box">
              <div className="breakdown-row">
                <span>Items ({items.length})</span>
                <span>{formatPrice(subtotal + (discount || 0))}</span>
              </div>
              {discount > 0 && (
                <div className="breakdown-row gold-text">
                  <span>Haute Privilege Savings</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="breakdown-row">
                <span>Express Insured Courier</span>
                <span className="gold-text">COMPLIMENTARY</span>
              </div>
              <div className="breakdown-row">
                <span>Atelier Packaging</span>
                <span className="gold-text">COMPLIMENTARY</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3D SECURE OTP MODAL */}
      {showOtpScreen && (
        <div className="luxury-otp-overlay">
          <div className="luxury-otp-card">
            <div className="luxury-otp-icon-wrap">
              <ShieldCheck size={30} color="#121214" />
            </div>
            <h3>3D Secure Authorization</h3>
            <p className="luxury-otp-desc">
              Please enter the 6-digit authentication code sent to <strong>+91 ••••• ••210</strong>
            </p>

            <form onSubmit={handleVerifyOtp} className="luxury-otp-form">
              <input
                type="text"
                className="luxury-otp-input"
                placeholder="• • • • • •"
                maxLength={6}
                value={otpValue}
                onChange={e => setOtpValue(e.target.value.replace(/\D/g, ''))}
                autoFocus
                required
              />

              <button 
                type="button" 
                className="luxury-otp-autofill-btn"
                onClick={() => setOtpValue('842910')}
              >
                ✨ Autofill Test OTP (842910)
              </button>

              <div className="luxury-otp-meta-row">
                <span>Resend Code in <strong>28s</strong></span>
                <span className="luxury-green-lock"><Lock size={12} /> Verified by Cashfree</span>
              </div>

              <div className="luxury-otp-actions">
                <button 
                  type="button" 
                  className="btn luxury-btn-outline"
                  onClick={() => setShowOtpScreen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn luxury-btn-primary"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={15} className="cf-spin" /> Authorizing...
                    </span>
                  ) : (
                    <span>Confirm • {formatPrice(total)}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN CHECKOUT CONTAINER */}
      <div className="app-container">
        <div className="luxury-checkout-grid">
          
          {/* LEFT COLUMN: Progressive 4-Step Accordion */}
          <div className="luxury-steps-container">
            
            {/* ========================================================
                STEP 1: CLIENT ACCOUNT & AUTHENTICATION
                ======================================================== */}
            <div className={`luxury-step-card ${currentStep === 1 ? 'active' : 'completed'}`}>
              <div 
                className={`luxury-step-header ${currentStep === 1 ? 'active-header' : ''}`}
                onClick={() => setCurrentStep(1)}
                style={{ cursor: 'pointer' }}
              >
                <div className="luxury-step-badge">01</div>
                <div className="luxury-step-title-wrap">
                  <span className="luxury-step-title">CLIENT ACCOUNT</span>
                  <Check size={16} className="luxury-check-icon" />
                </div>
                <button 
                  className="luxury-step-change-btn" 
                  onClick={(e) => { e.stopPropagation(); setCurrentStep(1); }}
                  type="button"
                >
                  {currentStep === 1 ? 'Active' : 'Change'}
                </button>
              </div>

              {currentStep === 1 ? (
                <div className="luxury-step-body">
                  <div className="luxury-account-edit-box">
                    <p style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: 'var(--color-dark)' }}>
                      Logged in as <strong>Alexandra Thorne</strong> (+91 9876543210)
                    </p>
                    <p style={{ margin: '0 0 16px 0', fontSize: '12.5px', color: 'var(--color-subtle)' }}>
                      Order confirmation & invoices are delivered to <strong>alexandra.thorne@example.com</strong>
                    </p>
                    <button 
                      className="btn luxury-btn-primary"
                      onClick={() => setCurrentStep(2)}
                      type="button"
                    >
                      Continue with this Account
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="luxury-step-collapsed-body"
                  onClick={() => setCurrentStep(1)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="luxury-client-name">Alexandra Thorne</span>
                  <span className="luxury-client-detail">+91 9876543210</span>
                  <span className="luxury-client-detail">alexandra.thorne@example.com</span>
                </div>
              )}
            </div>

            {/* ========================================================
                STEP 2: DELIVERY DESTINATION
                ======================================================== */}
            <div className={`luxury-step-card ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
              <div 
                className={`luxury-step-header ${currentStep === 2 ? 'active-header' : ''}`}
                onClick={() => setCurrentStep(2)}
                style={{ cursor: 'pointer' }}
              >
                <div className="luxury-step-badge">02</div>
                <div className="luxury-step-title-wrap">
                  <span className="luxury-step-title">DELIVERY DESTINATION</span>
                  {currentStep > 2 && <Check size={16} className="luxury-check-icon" />}
                </div>
                <button 
                  className="luxury-step-change-btn" 
                  onClick={(e) => { e.stopPropagation(); setCurrentStep(2); }}
                  type="button"
                >
                  {currentStep === 2 ? 'Active' : 'Change'}
                </button>
              </div>

              {currentStep === 2 ? (
                <div className="luxury-step-body">
                  <div className="luxury-addresses-stack">
                    {addresses.map(addr => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div 
                          key={addr.id} 
                          className={`luxury-address-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedAddressId(addr.id)}
                        >
                          <div className="luxury-radio-outer">
                            <input 
                              type="radio" 
                              name="luxury_address" 
                              checked={isSelected}
                              onChange={() => setSelectedAddressId(addr.id)}
                            />
                          </div>
                          <div className="luxury-address-details">
                            <div className="luxury-addr-header-row">
                              <span className="luxury-addr-name">{addr.name}</span>
                              <span className="luxury-addr-tag">{addr.type}</span>
                            </div>
                            <span className="luxury-addr-phone">{addr.phone}</span>
                            <p className="luxury-addr-street-line">
                              {addr.street}, {addr.city}, {addr.state} — <strong>{addr.pincode}</strong>
                            </p>

                            {isSelected && (
                              <button 
                                className="btn luxury-btn-primary luxury-deliver-btn"
                                onClick={() => setCurrentStep(3)}
                                type="button"
                              >
                                Deliver to this Address
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Address Option */}
                  {!isAddingNewAddress ? (
                    <button 
                      className="luxury-add-addr-btn"
                      onClick={() => setIsAddingNewAddress(true)}
                      type="button"
                    >
                      <Plus size={16} />
                      <span>Add a New Delivery Address</span>
                    </button>
                  ) : (
                    <form onSubmit={handleAddNewAddress} className="luxury-new-addr-form">
                      <div className="luxury-form-heading">New Delivery Address</div>
                      <div className="luxury-form-grid-2">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          className="luxury-input"
                          value={newAddrName}
                          onChange={e => setNewAddrName(e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="10-digit mobile number *"
                          className="luxury-input"
                          value={newAddrPhone}
                          onChange={e => setNewAddrPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div className="luxury-form-grid-2">
                        <input
                          type="text"
                          placeholder="Postal Pincode *"
                          className="luxury-input"
                          value={newAddrPincode}
                          onChange={e => setNewAddrPincode(e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="City / District *"
                          className="luxury-input"
                          value={newAddrCity}
                          onChange={e => setNewAddrCity(e.target.value)}
                          required
                        />
                      </div>
                      <textarea
                        placeholder="Street Address, Building & Suite Number *"
                        className="luxury-textarea"
                        rows={2}
                        value={newAddrStreet}
                        onChange={e => setNewAddrStreet(e.target.value)}
                        required
                      />
                      <div className="luxury-addr-type-radios">
                        <label>
                          <input
                            type="radio"
                            name="new_addr_type"
                            checked={newAddrType === 'RESIDENCE'}
                            onChange={() => setNewAddrType('RESIDENCE')}
                          /> Residence (All-day)
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="new_addr_type"
                            checked={newAddrType === 'ATELIER / STUDIO'}
                            onChange={() => setNewAddrType('ATELIER / STUDIO')}
                          /> Studio (Office)
                        </label>
                      </div>
                      <div className="luxury-form-buttons">
                        <button type="submit" className="btn luxury-btn-primary">Save & Deliver Here</button>
                        <button 
                          type="button" 
                          className="btn luxury-btn-outline"
                          onClick={() => setIsAddingNewAddress(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div 
                  className="luxury-step-collapsed-body"
                  onClick={() => setCurrentStep(2)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="luxury-client-name">{activeAddress.name}</span>
                  <span className="luxury-client-detail">
                    {activeAddress.street}, {activeAddress.city} — {activeAddress.pincode}
                  </span>
                </div>
              )}
            </div>

            {/* ========================================================
                STEP 3: ORDER SPECIFICATIONS & REVIEW
                ======================================================== */}
            <div className={`luxury-step-card ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>
              <div 
                className={`luxury-step-header ${currentStep === 3 ? 'active-header' : ''}`}
                onClick={() => setCurrentStep(3)}
                style={{ cursor: 'pointer' }}
              >
                <div className="luxury-step-badge">03</div>
                <div className="luxury-step-title-wrap">
                  <span className="luxury-step-title">ORDER REVIEW ({items.length})</span>
                  {currentStep > 3 && <Check size={16} className="luxury-check-icon" />}
                </div>
                <button 
                  className="luxury-step-change-btn" 
                  onClick={(e) => { e.stopPropagation(); setCurrentStep(3); }}
                  type="button"
                >
                  {currentStep === 3 ? 'Active' : 'Change'}
                </button>
              </div>

              {currentStep === 3 ? (
                <div className="luxury-step-body">
                  <div className="luxury-items-list">
                    {items.map(item => (
                      <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="luxury-item-card">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.title} 
                          className="luxury-item-photo"
                        />
                        <div className="luxury-item-specs">
                          <h4 className="luxury-item-name">{item.product.title}</h4>
                          <div className="luxury-item-chips">
                            <span>Size: <strong>{item.selectedSize}</strong></span>
                            <span>•</span>
                            <span>Color: <strong>{item.selectedColor}</strong></span>
                          </div>
                          
                          <div className="luxury-item-pricing">
                            <span className="luxury-item-price">{formatPrice(item.product.price)}</span>
                            {item.product.originalPrice && (
                              <span className="luxury-item-strike">{formatPrice(item.product.originalPrice)}</span>
                            )}
                          </div>

                          <div className="luxury-item-controls">
                            <div className="luxury-stepper">
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                                className="luxury-stepper-btn"
                              >
                                -
                              </button>
                              <span className="luxury-stepper-value">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                                className="luxury-stepper-btn"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              className="luxury-remove-action"
                              onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="luxury-item-delivery-estimate">
                          <span className="luxury-courier-title">Complimentary Courier</span>
                          <span className="luxury-courier-date">Est. 2-3 Days</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="luxury-step-footer-row">
                    <span className="luxury-email-notice">
                      Order dispatch updates will be sent to <strong>alexandra.thorne@example.com</strong>
                    </span>
                    <button 
                      className="btn luxury-btn-primary"
                      onClick={() => handleInitiatePayment()}
                      disabled={isProcessing}
                      type="button"
                    >
                      {isProcessing ? 'Processing Order...' : `Place Order • ${formatPrice(total)}`}
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="luxury-step-collapsed-body"
                  onClick={() => setCurrentStep(3)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{items.length} Haute Couture item(s) selected</span>
                </div>
              )}
            </div>

            {/* ========================================================
                STEP 4: PAYMENT GATEWAY (COMMENTED DOWN FOR NOW)
                ======================================================== */}
            {/*
            <div className={`luxury-step-card ${currentStep === 4 ? 'active' : ''}`}>
              <div 
                className={`luxury-step-header ${currentStep === 4 ? 'active-header' : ''}`}
                onClick={() => setCurrentStep(4)}
                style={{ cursor: 'pointer' }}
              >
                <div className="luxury-step-badge">04</div>
                <div className="luxury-step-title-wrap">
                  <span className="luxury-step-title">PAYMENT GATEWAY</span>
                  <span className="luxury-cashfree-tag">Cashfree Payments</span>
                </div>
                <button 
                  className="luxury-step-change-btn" 
                  onClick={(e) => { e.stopPropagation(); setCurrentStep(4); }}
                  type="button"
                >
                  {currentStep === 4 ? 'Active' : 'Open'}
                </button>
              </div>

              {currentStep === 4 && (
                <form onSubmit={handleInitiatePayment} className="luxury-step-body">
                  <div className="luxury-payment-modes">
                    
                    <label className={`luxury-payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                      <div className="luxury-option-header">
                        <input 
                          type="radio" 
                          name="payment_method" 
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                        />
                        <div className="luxury-option-title-wrap">
                          <span className="luxury-option-title">UPI (GPay / PhonePe / Paytm / QR)</span>
                          <span className="luxury-option-subtitle">Fast, zero-fee direct bank debit</span>
                        </div>
                        <span className="luxury-instant-badge">RECOMMENDED</span>
                      </div>

                      {paymentMethod === 'upi' && (
                        <div className="luxury-option-expanded">
                          <div className="luxury-upi-switcher">
                            <button 
                              type="button"
                              className={`luxury-upi-tab ${upiOption === 'apps' ? 'active' : ''}`}
                              onClick={() => setUpiOption('apps')}
                            >
                              UPI Apps
                            </button>
                            <button 
                              type="button"
                              className={`luxury-upi-tab ${upiOption === 'qr' ? 'active' : ''}`}
                              onClick={() => setUpiOption('qr')}
                            >
                              Scan QR
                            </button>
                            <button 
                              type="button"
                              className={`luxury-upi-tab ${upiOption === 'vpa' ? 'active' : ''}`}
                              onClick={() => setUpiOption('vpa')}
                            >
                              UPI ID
                            </button>
                          </div>

                          {upiOption === 'apps' && (
                            <div className="luxury-app-selector-grid">
                              {[
                                { id: 'gpay', name: 'Google Pay', icon: '⚡' },
                                { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                                { id: 'paytm', name: 'Paytm UPI', icon: '🔵' },
                                { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳' },
                              ].map(app => (
                                <button
                                  type="button"
                                  key={app.id}
                                  className={`luxury-upi-app-card ${selectedUpiApp === app.id ? 'active' : ''}`}
                                  onClick={() => setSelectedUpiApp(app.id)}
                                >
                                  <span className="app-icon">{app.icon}</span>
                                  <span className="app-name">{app.name}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {upiOption === 'qr' && (
                            <div className="luxury-qr-container">
                              <div className="luxury-qr-frame">
                                <QrCode size={84} color="#121214" />
                              </div>
                              <div className="luxury-qr-notes">
                                <span className="luxury-qr-heading">Scan with any UPI App</span>
                                <span className="luxury-qr-desc">Open Google Pay, PhonePe or Paytm</span>
                              </div>
                            </div>
                          )}

                          {upiOption === 'vpa' && (
                            <div className="luxury-vpa-input-group">
                              <input
                                type="text"
                                className="luxury-input"
                                placeholder="Enter UPI ID (e.g. mobile@okhdfcbank)"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                              />
                            </div>
                          )}

                          <button 
                            type="submit" 
                            className="btn luxury-btn-primary luxury-pay-btn"
                            disabled={isProcessing}
                          >
                            Pay {formatPrice(total)} via UPI
                          </button>
                        </div>
                      )}
                    </label>

                    <label className={`luxury-payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                      <div className="luxury-option-header">
                        <input 
                          type="radio" 
                          name="payment_method" 
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                        />
                        <div className="luxury-option-title-wrap">
                          <span className="luxury-option-title">Credit or Debit Card</span>
                          <span className="luxury-option-subtitle">Visa, MasterCard, RuPay, Amex</span>
                        </div>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="luxury-option-expanded">
                          <div className="luxury-card-inputs">
                            <input
                              type="text"
                              className="luxury-input"
                              placeholder="Card Number (•••• •••• •••• ••••)"
                              value={cardNumber}
                              onChange={e => setCardNumber(e.target.value)}
                              required
                            />
                            <div className="luxury-form-grid-2">
                              <input
                                type="text"
                                className="luxury-input"
                                placeholder="MM / YY"
                                value={cardExpiry}
                                onChange={e => setCardExpiry(e.target.value)}
                                required
                              />
                              <input
                                type="password"
                                className="luxury-input"
                                placeholder="CVV"
                                maxLength={4}
                                value={cardCvc}
                                onChange={e => setCardCvc(e.target.value)}
                                required
                              />
                            </div>
                            <input
                              type="text"
                              className="luxury-input"
                              placeholder="Name on Card"
                              value={cardHolder}
                              onChange={e => setCardHolder(e.target.value)}
                              required
                            />
                            <button 
                              type="submit" 
                              className="btn luxury-btn-primary luxury-pay-btn"
                              disabled={isProcessing}
                            >
                              Authorize Card • {formatPrice(total)}
                            </button>
                          </div>
                        </div>
                      )}
                    </label>

                    <label className={`luxury-payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                      <div className="luxury-option-header">
                        <input 
                          type="radio" 
                          name="payment_method" 
                          checked={paymentMethod === 'netbanking'}
                          onChange={() => setPaymentMethod('netbanking')}
                        />
                        <div className="luxury-option-title-wrap">
                          <span className="luxury-option-title">Net Banking</span>
                          <span className="luxury-option-subtitle">50+ Indian Scheduled Banks</span>
                        </div>
                      </div>

                      {paymentMethod === 'netbanking' && (
                        <div className="luxury-option-expanded">
                          <div className="luxury-banks-flex">
                            {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak'].map(b => (
                              <label key={b} className="luxury-bank-pill">
                                <input 
                                  type="radio" 
                                  name="bank_choice" 
                                  checked={selectedBank === b}
                                  onChange={() => setSelectedBank(b)}
                                />
                                <span>{b}</span>
                              </label>
                            ))}
                          </div>
                          <button 
                            type="submit" 
                            className="btn luxury-btn-primary luxury-pay-btn"
                            disabled={isProcessing}
                          >
                            Proceed to Bank • {formatPrice(total)}
                          </button>
                        </div>
                      )}
                    </label>

                    <label className={`luxury-payment-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}>
                      <div className="luxury-option-header">
                        <input 
                          type="radio" 
                          name="payment_method" 
                          checked={paymentMethod === 'wallet'}
                          onChange={() => setPaymentMethod('wallet')}
                        />
                        <div className="luxury-option-title-wrap">
                          <span className="luxury-option-title">Wallets & PayLater</span>
                          <span className="luxury-option-subtitle">Paytm, Mobikwik, Simpl</span>
                        </div>
                      </div>

                      {paymentMethod === 'wallet' && (
                        <div className="luxury-option-expanded">
                          <button 
                            type="submit" 
                            className="btn luxury-btn-primary luxury-pay-btn"
                            disabled={isProcessing}
                          >
                            Authorize Wallet • {formatPrice(total)}
                          </button>
                        </div>
                      )}
                    </label>

                    <label className={`luxury-payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <div className="luxury-option-header">
                        <input 
                          type="radio" 
                          name="payment_method" 
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                        />
                        <div className="luxury-option-title-wrap">
                          <span className="luxury-option-title">Cash on Delivery</span>
                          <span className="luxury-option-subtitle">Pay via UPI or cash upon concierge handover</span>
                        </div>
                      </div>

                      {paymentMethod === 'cod' && (
                        <div className="luxury-option-expanded">
                          <button 
                            type="submit" 
                            className="btn luxury-btn-primary luxury-pay-btn"
                            disabled={isProcessing}
                          >
                            Confirm Order • {formatPrice(total)}
                          </button>
                        </div>
                      )}
                    </label>

                  </div>
                </form>
              )}
            </div>
            */}

          </div>

          {/* RIGHT COLUMN: Sticky Price & Atelier Summary */}
          <div className="luxury-summary-sidebar">
            <div className="luxury-price-card">
              <div className="luxury-price-header">
                <h3>PRICE & ATELIER SUMMARY</h3>
              </div>

              <div className="luxury-price-body">
                <div className="luxury-price-row">
                  <span>Price ({items.length} item{items.length > 1 ? 's' : ''})</span>
                  <span>{formatPrice(subtotal + (discount || 0))}</span>
                </div>

                {discount > 0 && (
                  <div className="luxury-price-row luxury-gold-text">
                    <span>Haute Privilege Savings</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="luxury-price-row">
                  <span>Express Courier Delivery</span>
                  <span className="luxury-gold-text">COMPLIMENTARY</span>
                </div>

                <div className="luxury-price-row">
                  <span>Atelier Insurance & Packaging</span>
                  <span className="luxury-gold-text">COMPLIMENTARY</span>
                </div>

                <div className="luxury-total-row">
                  <span className="luxury-total-label">Total Payable</span>
                  <span className="luxury-total-amount">{formatPrice(total)}</span>
                </div>

                {discount > 0 && (
                  <div className="luxury-savings-pill">
                    <span>✨ You save {formatPrice(discount)} on this order</span>
                  </div>
                )}
              </div>
            </div>

            {/* Haute Couture Assurance Box */}
            <div className="luxury-assurance-box">
              <div className="luxury-assurance-item">
                <ShieldCheck size={20} className="luxury-gold-icon" />
                <div>
                  <h4>100% Premium Imported Authenticity</h4>
                  <p>Hand-picked luxury garments from international ateliers & global designers.</p>
                </div>
              </div>
              <div className="luxury-assurance-item">
                <Award size={20} className="luxury-gold-icon" />
                <div>
                  <h4>Complimentary 30-Day Returns</h4>
                  <p>Effortless doorstep exchange with insured return courier.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* MOBILE FIXED BOTTOM ACTION BAR */}
      <div className="luxury-mobile-bottom-bar">
        <div className="mobile-bar-price">
          <span className="price-sub">Total</span>
          <span className="price-main">{formatPrice(total)}</span>
        </div>

        <div className="mobile-bar-action">
          {currentStep === 1 && (
            <button 
              className="btn luxury-btn-primary mobile-cta-btn"
              onClick={() => setCurrentStep(2)}
              type="button"
            >
              Continue to Address
            </button>
          )}

          {currentStep === 2 && (
            <button 
              className="btn luxury-btn-primary mobile-cta-btn"
              onClick={() => setCurrentStep(3)}
              type="button"
            >
              Deliver Here
            </button>
          )}

          {currentStep === 3 && (
            <button 
              className="btn luxury-btn-primary mobile-cta-btn"
              onClick={() => handleInitiatePayment()}
              disabled={isProcessing}
              type="button"
            >
              {isProcessing ? 'Processing...' : `Place Order • ${formatPrice(total)}`}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
