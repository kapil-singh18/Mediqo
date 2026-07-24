import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import toast from 'react-hot-toast';

export const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for contacting Mediqo. Our team will get back to you shortly.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Contact Mediqo Healthcare</h1>
        <p className="text-sm text-gray-500">Have questions about our clinic operations or need help? Reach out to us.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Get in Touch</h2>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">Address</strong>
                Mediqo Healthcare Tower, 12th Avenue, Medical Hub, City Center
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">Phone Support</strong>
                +1 (800) 555-MEDI
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">Email Address</strong>
                care@mediqo.com
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">Operating Hours</strong>
                Monday - Saturday: 8:00 AM - 8:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Your Name" placeholder="e.g. John Doe" required />
            <Input label="Email Address" type="email" placeholder="e.g. john@example.com" required />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Message</label>
              <textarea
                rows={4}
                required
                placeholder="How can Mediqo assist you today?"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
            <Button type="submit" className="w-full">
              <Send className="w-4 h-4 mr-2" /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
