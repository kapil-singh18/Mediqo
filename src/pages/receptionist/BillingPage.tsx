import React, { useState, useEffect } from 'react';
import { Bill, User } from '../../types';
import { receptionistApi } from '../../services/receptionistApi';
import { CreateBillModal } from '../../components/receptionist/CreateBillModal';
import { BillInvoiceModal } from '../../components/receptionist/BillInvoiceModal';

import {
  Receipt,
  Search,
  Filter,
  PlusCircle,
  RefreshCw,
  Printer,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [patientsList, setPatientsList] = useState<User[]>([]);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [createBillModalOpen, setCreateBillModalOpen] = useState(false);
  const [billToEdit, setBillToEdit] = useState<Bill | null>(null);
  const [selectedBillForPrint, setSelectedBillForPrint] = useState<Bill | null>(null);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const [billRes, ptsRes, docsRes] = await Promise.all([
        receptionistApi.getBills({
          search,
          status: statusFilter,
        }),
        receptionistApi.getPatients({ limit: 100 }),
        receptionistApi.getDoctors(),
      ]);

      if (billRes.success && billRes.data) {
        setBills(billRes.data.bills || []);
      }

      if (ptsRes.success && ptsRes.data) {
        setPatientsList(ptsRes.data.patients || []);
      }

      if (docsRes.success && docsRes.data) {
        setDoctorsList(docsRes.data.doctors || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bills list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [search, statusFilter]);

  const handleDeleteBill = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice record?')) {
      await receptionistApi.deleteBill(id);
      fetchBills();
    }
  };

  const handleTogglePaymentStatus = async (bill: Bill) => {
    const nextStatus = bill.status === 'Paid' ? 'Pending' : 'Paid';
    await receptionistApi.updateBill(bill._id, { status: nextStatus });
    fetchBills();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-purple-700" />
            Billing & Invoicing Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage consultation fee receipts, laboratory charges, payment statuses, and printable invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setBillToEdit(null);
              setCreateBillModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue New Bill Invoice</span>
          </button>

          <button
            onClick={fetchBills}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Invoices"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search invoice #, patient, doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-800 focus:outline-none"
            >
              <option value="all">All Invoices</option>
              <option value="Paid">Paid (Settled)</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading invoice history...</div>
        ) : bills.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No invoice records found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-200/80">
                  <th className="p-4 pl-6">Invoice #</th>
                  <th className="p-4">Billed Patient</th>
                  <th className="p-4">Doctor / Specialty</th>
                  <th className="p-4">Date & Method</th>
                  <th className="p-4">Grand Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Invoice Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {bills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-4 pl-6 font-extrabold text-slate-900">
                      <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                        #{bill.billNumber}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-extrabold text-slate-900">{bill.patientName || 'Patient'}</p>
                      <p className="text-[10px] text-slate-400">{bill.patientPhone || 'N/A'}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900">{bill.doctorName}</p>
                      <p className="text-[10px] text-slate-400">{bill.doctorSpeciality || 'General'}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800">📅 {bill.date}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{bill.paymentMethod || 'Cash'}</p>
                    </td>

                    <td className="p-4">
                      <span className="text-sm font-black text-slate-900">₹{bill.total}</span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePaymentStatus(bill)}
                        title="Click to toggle Paid/Pending"
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold inline-flex items-center gap-1 transition-transform active:scale-95 ${
                          bill.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {bill.status === 'Paid' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        <span>{bill.status}</span>
                      </button>
                    </td>

                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedBillForPrint(bill)}
                          className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                          title="Print / View Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setBillToEdit(bill);
                            setCreateBillModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Edit Invoice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteBill(bill._id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateBillModal
        isOpen={createBillModalOpen}
        onClose={() => setCreateBillModalOpen(false)}
        onSuccess={fetchBills}
        patientsList={patientsList}
        doctorsList={doctorsList}
        billToEdit={billToEdit}
      />

      <BillInvoiceModal
        bill={selectedBillForPrint}
        onClose={() => setSelectedBillForPrint(null)}
      />
    </div>
  );
};
