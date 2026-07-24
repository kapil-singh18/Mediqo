import React, { useState, useEffect } from 'react';
import { User, Bill, BillItem } from '../../types';
import { receptionistApi, BillFormInput } from '../../services/receptionistApi';
import {
  X,
  Receipt,
  Plus,
  Trash2,
  DollarSign,
  User as UserIcon,
  Stethoscope,
  Save,
  CreditCard,
} from 'lucide-react';

interface CreateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientsList: User[];
  doctorsList: any[];
  preselectedPatient?: User | null;
  billToEdit?: Bill | null;
}

export const CreateBillModal: React.FC<CreateBillModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  patientsList,
  doctorsList,
  preselectedPatient,
  billToEdit,
}) => {
  const [patientId, setPatientId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpeciality, setDoctorSpeciality] = useState('General Medicine');
  const [consultationFee, setConsultationFee] = useState<number>(50);
  const [items, setItems] = useState<BillItem[]>([
    { description: 'Registration & Desk Charges', amount: 10, quantity: 1 },
  ]);
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [status, setStatus] = useState<'Paid' | 'Pending' | 'Partial' | 'Overdue'>('Paid');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (billToEdit) {
      setPatientId(billToEdit.patientId || '');
      setDoctorName(billToEdit.doctorName || '');
      setDoctorSpeciality(billToEdit.doctorSpeciality || 'General Medicine');
      setConsultationFee(billToEdit.consultationFee || 0);
      setItems(
        billToEdit.items && billToEdit.items.length > 0
          ? billToEdit.items
          : [{ description: 'General Consultation', amount: billToEdit.consultationFee || 50, quantity: 1 }]
      );
      setDiscount(billToEdit.discount || 0);
      setTax(billToEdit.tax || 0);
      setPaymentMethod(billToEdit.paymentMethod || 'Cash');
      setStatus(billToEdit.status || 'Paid');
      setDueDate(billToEdit.dueDate || new Date().toISOString().split('T')[0]);
      setNotes(billToEdit.notes || '');
    } else if (preselectedPatient) {
      setPatientId(preselectedPatient.id || (preselectedPatient as any)._id || '');
      if (doctorsList.length > 0) {
        setDoctorName(doctorsList[0].name);
        setDoctorSpeciality(doctorsList[0].speciality || 'General Medicine');
        setConsultationFee(doctorsList[0].fees || 50);
      }
    } else {
      if (patientsList.length > 0 && !patientId) {
        setPatientId(patientsList[0].id || (patientsList[0] as any)._id || '');
      }
      if (doctorsList.length > 0 && !doctorName) {
        setDoctorName(doctorsList[0].name);
        setDoctorSpeciality(doctorsList[0].speciality || 'General Medicine');
        setConsultationFee(doctorsList[0].fees || 50);
      }
    }
  }, [isOpen, billToEdit, preselectedPatient, patientsList, doctorsList]);

  if (!isOpen) return null;

  const handleDoctorSelect = (name: string) => {
    setDoctorName(name);
    const doc = doctorsList.find((d) => d.name === name);
    if (doc) {
      setDoctorSpeciality(doc.speciality || 'General Medicine');
      setConsultationFee(doc.fees || 50);
    }
  };

  const addItem = () => {
    setItems([...items, { description: '', amount: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BillItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const subtotal = consultationFee + items.reduce((sum, item) => sum + Number(item.amount || 0) * Number(item.quantity || 1), 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0) + Number(tax || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setError('Please select a patient');
      return;
    }
    if (!doctorName) {
      setError('Please specify attending doctor');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: BillFormInput = {
        patientId,
        doctorName,
        doctorSpeciality,
        consultationFee,
        items,
        discount,
        tax,
        paymentMethod,
        status,
        dueDate,
        notes,
      };

      if (billToEdit) {
        await receptionistApi.updateBill(billToEdit._id, payload);
      } else {
        await receptionistApi.createBill(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to process bill invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-800 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Receipt className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">{billToEdit ? 'Edit Invoice' : 'Generate Patient Bill'}</h2>
              <p className="text-xs text-purple-200">Record payments and medical fee invoices.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Patient Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
              Billed Patient *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
                disabled={!!billToEdit}
              >
                <option value="">-- Choose Patient --</option>
                {patientsList.map((p) => {
                  const id = p.id || (p as any)._id;
                  return (
                    <option key={id} value={id}>
                      {p.name} ({p.phone || p.email})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Doctor Selection & Consultation Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Attending Doctor *
              </label>
              <div className="relative">
                <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={doctorName}
                  onChange={(e) => handleDoctorSelect(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                >
                  <option value="">-- Select Doctor --</option>
                  {doctorsList.map((d) => (
                    <option key={d._id} value={d.name}>
                      {d.name} ({d.speciality})
                    </option>
                  ))}
                  <option value="General Clinic Desk">General Clinic Desk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-2.5 text-xs font-extrabold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Additional Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Additional Services & Charges
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Description (e.g. Lab Test, Bandages)"
                    value={item.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="number"
                    placeholder="Amount ₹"
                    value={item.amount}
                    onChange={(e) => updateItem(idx, 'amount', Number(e.target.value))}
                    className="w-24 px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Discounts & Tax */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Discount (₹)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Tax / Service Surcharge (₹)
              </label>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl"
              />
            </div>
          </div>

          {/* Payment Method & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Insurance">Insurance Claim</option>
                <option value="UPI/Online">UPI / Online Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                Payment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900"
              >
                <option value="Paid">Paid (Settled)</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Grand Total Calculation Banner */}
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-purple-700 uppercase">Calculated Grand Total</p>
              <p className="text-xs text-purple-600">
                Fee (₹{consultationFee}) + Items (₹{subtotal - consultationFee}) - Disc (₹{discount}) + Tax (₹{tax})
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-purple-900">₹{grandTotal}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition-all shadow-md shadow-purple-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Invoice...' : billToEdit ? 'Update Invoice' : 'Generate Bill Invoice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
