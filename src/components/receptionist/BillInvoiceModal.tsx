import React from 'react';
import { Bill } from '../../types';
import { X, Printer, CheckCircle, Clock, Stethoscope, Building2, Download } from 'lucide-react';

interface BillInvoiceModalProps {
  bill: Bill | null;
  onClose: () => void;
}

export const BillInvoiceModal: React.FC<BillInvoiceModalProps> = ({ bill, onClose }) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 print:shadow-none print:border-none print:m-0 print:w-full">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-slate-300">Official Patient Receipt Invoice</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 space-y-6 text-slate-800" id="printable-receipt">
          {/* Clinic Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">Mediqo Health</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Multi-Specialty Healthcare & Diagnostics</p>
              <p className="text-[11px] text-slate-400 mt-0.5">100 Healthcare Blvd, Suite 400 • +1 (800) 555-0199</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                INVOICE #{bill.billNumber}
              </span>
              <p className="text-xs font-bold text-slate-600 mt-2">Date: {bill.date}</p>
              <p className="text-xs font-semibold text-slate-400">Payment: {bill.paymentMethod || 'Cash'}</p>
            </div>
          </div>

          {/* Billed To & Attending Doctor */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Billed Patient</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">{bill.patientName || 'Patient'}</p>
              <p className="text-xs text-slate-500">{bill.patientPhone ? `Phone: ${bill.patientPhone}` : `ID: ${bill.patientId}`}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attending Specialist</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">{bill.doctorName}</p>
              <p className="text-xs text-slate-500">{bill.doctorSpeciality || 'General Medicine'}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-2.5 font-bold text-slate-800">Doctor Consultation Fee</td>
                  <td className="py-2.5 text-center">1</td>
                  <td className="py-2.5 text-right">₹{bill.consultationFee}</td>
                  <td className="py-2.5 text-right font-bold">₹{bill.consultationFee}</td>
                </tr>

                {bill.items &&
                  bill.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 text-slate-700">{item.description}</td>
                      <td className="py-2.5 text-center">{item.quantity || 1}</td>
                      <td className="py-2.5 text-right">₹{item.amount}</td>
                      <td className="py-2.5 text-right font-bold">
                        ₹{(Number(item.amount) * Number(item.quantity || 1))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Breakdown & Grand Total */}
          <div className="border-t border-slate-200 pt-4 space-y-1.5 text-xs text-right">
            {bill.discount ? (
              <p className="text-slate-500">
                Discount Applied: <span className="text-rose-600 font-bold">-₹{bill.discount}</span>
              </p>
            ) : null}
            {bill.tax ? (
              <p className="text-slate-500">
                Tax / Surcharge: <span className="font-bold">+₹{bill.tax}</span>
              </p>
            ) : null}

            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-left">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                    bill.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {bill.status === 'Paid' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  Status: {bill.status.toUpperCase()}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount Due</span>
                <span className="text-2xl font-black text-slate-900">₹{bill.total}</span>
              </div>
            </div>
          </div>

          {/* Footer notice */}
          <div className="pt-4 border-t border-dashed border-slate-200 text-center text-[11px] text-slate-400">
            Thank you for choosing Mediqo Health Clinic. Please retain this bill for medical claims.
          </div>
        </div>
      </div>
    </div>
  );
};
