import React, { useState } from 'react';
import { QrCode, Ticket, CheckCircle2, DollarSign, Smartphone, CreditCard, Download, User, Mail, Sparkles, X } from 'lucide-react';

export default function EventRegistrationModal({ event, onClose }) {
  const [activeStep, setActiveStep] = useState('ticket'); // 'ticket' | 'payment' | 'qr'
  const [selectedTier, setSelectedTier] = useState('standard');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa' | 'card'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const ticketTiers = [
    { id: 'free', name: 'General Admission', price: 'Free', perks: ['Access to main event', 'Digital badge'] },
    { id: 'standard', name: 'Standard Ticket', price: 'KES 1,500 ($12)', perks: ['Access to main event', 'Q&A participation', 'Digital certificate'] },
    { id: 'vip', name: 'VIP Pass', price: 'KES 4,500 ($35)', perks: ['Front row seating', 'VIP Lounge access', 'Exclusive speaker networking', 'Event recording'] },
  ];

  const currentTier = ticketTiers.find(t => t.id === selectedTier) || ticketTiers[1];

  const handleRegister = (e) => {
    e.preventDefault();
    if (currentTier.id === 'free') {
      setActiveStep('qr');
      setIsSuccess(true);
    } else {
      setActiveStep('payment');
    }
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setActiveStep('qr');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-slate-100 font-sans">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{event?.title || 'MASAA Event Registration'}</h2>
              <p className="text-xs text-blue-100">{event?.date || 'Upcoming Event'} • QR Check-In Enabled</p>
            </div>
          </div>
          <button onClick={onClose} className="text-blue-100 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* STEP 1: SELECT TIER & ATTENDEE INFO */}
          {activeStep === 'ticket' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Select Ticket Tier</label>
                <div className="space-y-3">
                  {ticketTiers.map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        selectedTier === tier.id 
                          ? 'bg-blue-600/10 border-blue-500 text-white' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-white">{tier.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{tier.perks.join(' • ')}</div>
                      </div>
                      <div className="text-right font-extrabold text-blue-400 text-sm">{tier.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Attendee Info</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
              >
                <span>Continue to {currentTier.id === 'free' ? 'Get Ticket' : 'Payment'}</span>
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT (M-PESA / STRIPE) */}
          {activeStep === 'payment' && (
            <div className="space-y-5">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400">Total Amount</div>
                  <div className="text-lg font-bold text-white">{currentTier.price}</div>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30">
                  {currentTier.name}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-4 rounded-2xl border text-center transition ${
                      paymentMethod === 'mpesa'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                    <div className="text-xs">M-Pesa STK Push</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border text-center transition ${
                      paymentMethod === 'card'
                        ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                    <div className="text-xs">Credit / Debit Card</div>
                  </button>
                </div>
              </div>

              {paymentMethod === 'mpesa' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500">You will receive an instant PIN prompt on your phone.</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveStep('ticket')}
                  className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-2/3 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <span>Confirm & Pay {currentTier.price}</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: QR CODE TICKET & CHECK-IN CONFIRMATION */}
          {activeStep === 'qr' && (
            <div className="text-center space-y-5">
              <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Registration Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">Your digital QR Ticket has been generated for {fullName || 'Attendee'}.</p>
              </div>

              {/* QR Code Card Display */}
              <div className="p-6 bg-white text-slate-950 rounded-2xl max-w-xs mx-auto space-y-4 shadow-xl">
                <div className="font-extrabold text-sm tracking-tight border-b pb-2">MASAA EVENT PASS</div>
                
                {/* Visual Mock QR Code */}
                <div className="w-40 h-40 mx-auto bg-slate-950 rounded-xl p-3 flex flex-col justify-between items-center relative overflow-hidden">
                  <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-white rounded">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`rounded-xs ${i % 2 === 0 ? 'bg-slate-950' : 'bg-blue-600'}`} />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 font-mono text-[10px] font-bold text-slate-900 border-2 border-slate-900">
                    SCAN FOR ENTRY
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-700">
                  Ticket ID: <span className="font-mono text-blue-600">MASAA-QR-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition"
              >
                Close & Return to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
