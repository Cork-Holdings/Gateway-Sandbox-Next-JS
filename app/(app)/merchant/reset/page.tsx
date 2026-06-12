import MerchantResetForm from '@/components/custom/forms/merchant/reset/reset-form';
import { LockKeyhole } from 'lucide-react';

const ResetPage = () => {
  return (
    <main className="flex items-center justify-center w-full min-h-screen bg-slate-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 bg-[#3977BF]/10 rounded-2xl flex items-center justify-center mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
            <LockKeyhole className="h-6 w-6 text-[#3977BF]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 text-center tracking-tight">
            Reset Your Password
          </h2>
          <p className="text-sm text-slate-500 text-center mt-2 max-w-xs">
            We'll send a secure validation link or OTP code to verify your identity.
          </p>
        </div>

        <MerchantResetForm />

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Need help? <a href="#" className="text-[#3977BF] hover:text-[#3B3C8C] font-semibold transition-colors">Contact Support</a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default ResetPage;