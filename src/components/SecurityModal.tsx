
import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SecurityModalProps {
  onSuccess: () => void;
  onCancel: () => void;
  action: string;
}

const SecurityModal: React.FC<SecurityModalProps> = ({ onSuccess, onCancel, action }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = '2025';
    
    if (code === correctCode) {
      onSuccess();
    } else {
      setError('رمز الأمان غير صحيح');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-red-50 to-orange-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg ml-3 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            رمز الأمان مطلوب
          </h2>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-gray-600 text-center">
            أدخل رمز الأمان للمتابعة مع: {action}
          </p>
          
          <Input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError('');
            }}
            placeholder="أدخل رمز الأمان"
            className="text-center text-2xl tracking-widest h-14"
            maxLength={4}
          />
          
          {error && (
            <p className="text-red-600 text-center text-sm">{error}</p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              تأكيد
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityModal;
