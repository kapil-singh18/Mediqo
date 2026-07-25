import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { Bill } from '../../types';
import { patientApi } from '../../services/patientApi';
import { EmptyState } from '../../components/patient/EmptyState';
import { LoadingSpinner } from '../../components/patient/LoadingSpinner';
import { StatusBadge } from '../../components/patient/StatusBadge';
import { PageHeader } from '../../components/ui/LayoutPrimitives';
import { Card } from '../../components/ui/Card';
import toast from 'react-hot-toast';

export const BillsPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const data = await patientApi.getMyBills();
        setBills(data);
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch bills');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const totalPending = bills
    .filter((b) => b.status === 'Pending')
    .reduce((sum, b) => sum + b.total, 0);

  const totalPaid = bills
    .filter((b) => b.status === 'Paid')
    .reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <PageHeader
        title="Consultation Bills"
        subtitle="Read-only invoices for your clinic appointments and specialist visits."
        badgeText="Financial Statement"
        action={
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 border border-emerald-200/60 px-4 py-2 rounded-[12px] text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Paid Total</span>
              <p className="text-base font-extrabold text-emerald-800">${totalPaid}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200/60 px-4 py-2 rounded-[12px] text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Pending Due</span>
              <p className="text-base font-extrabold text-amber-800">${totalPending}</p>
            </div>
          </div>
        }
      />

      {/* Main Bills List */}
      {loading ? (
        <LoadingSpinner label="Fetching billing statements..." />
      ) : bills.length === 0 ? (
        <EmptyState
          illustrationType="bills"
          title="No Invoices Found"
          description="You currently have no clinic invoices recorded. Invoices will automatically generate when appointments are booked."
        />
      ) : (
        <Card className="p-0 overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80">
                  <th className="py-3.5 px-6">Bill Number</th>
                  <th className="py-3.5 px-6">Doctor / Service</th>
                  <th className="py-3.5 px-6">Appointment Date</th>
                  <th className="py-3.5 px-6">Fee</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {bills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                      {bill.billNumber}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{bill.doctorName}</p>
                      <p className="text-[11px] text-[#5F6FFF] font-semibold">{bill.doctorSpeciality}</p>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-slate-600 font-medium">
                      {bill.appointmentDate}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      ${bill.consultationFee}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <StatusBadge status={bill.status} />
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-slate-900 text-sm whitespace-nowrap">
                      ${bill.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Clinic Billing System Integrated
            </span>
            <span>Total Invoices: {bills.length}</span>
          </div>
        </Card>
      )}
    </div>
  );
};
