import React, { useState, useEffect } from 'react';
import { Bill, User } from '../../types';
import { receptionistApi } from '../../services/receptionistApi';
import { CreateBillModal } from '../../components/receptionist/CreateBillModal';
import { BillInvoiceModal } from '../../components/receptionist/BillInvoiceModal';

import {
  Receipt,
  Filter,
  PlusCircle,
  RefreshCw,
  Printer,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/LayoutPrimitives';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';

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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Billing & Invoicing Desk"
        subtitle="Manage consultation fee receipts, laboratory charges, payment statuses, and printable invoices."
        badgeText="Revenue Management"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setBillToEdit(null);
                setCreateBillModalOpen(true);
              }}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Issue New Bill Invoice
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={fetchBills}
              title="Refresh Invoices"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        }
      />

      {/* Toolbar Filters */}
      <Card className="p-4 border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-80">
          <SearchInput
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search invoice #, patient, doctor..."
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-[8px] border border-slate-200">
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
      </Card>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-[12px] text-xs font-bold">
          {error}
        </div>
      )}

      {/* Invoices Table */}
      <Card className="border border-slate-200 overflow-hidden p-0">
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
                  <tr key={bill._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-extrabold text-slate-900">
                      <span className="text-xs font-black text-[#5F6FFF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
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
                      <span className="text-sm font-black text-slate-900">${bill.total}</span>
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
                          className="p-2 rounded-[8px] bg-blue-50 hover:bg-blue-100 text-[#5F6FFF] transition-colors"
                          title="Print / View Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setBillToEdit(bill);
                            setCreateBillModalOpen(true);
                          }}
                          className="p-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Edit Invoice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteBill(bill._id)}
                          className="p-2 rounded-[8px] bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
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
      </Card>

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
