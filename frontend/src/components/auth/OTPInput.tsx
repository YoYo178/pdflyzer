import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
}

function OTPInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value) {
      const chars = value.split('').slice(0, length);
      setOtp([...chars, ...Array(length - chars.length).fill('')]);
    } else {
      setOtp(Array(length).fill(''));
    }
  }, [value, length]);

  const updateValue = useCallback(
    (newOtp: string[]) => {
      const otpString = newOtp.join('');
      onChange?.(otpString);
      if (otpString.length === length) {
        onComplete?.(otpString);
      }
    },
    [onChange, onComplete, length],
  );

  const handleChange = useCallback(
    (index: number, inputValue: string) => {
      if (disabled) return;
      // Only allow digits
      const digit = inputValue.replace(/\D/g, '').slice(-1);
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);
      updateValue(newOtp);

      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [disabled, otp, updateValue, length],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [disabled, otp],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, length);
      const newOtp = Array(length).fill('');
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      updateValue(newOtp);
      if (pastedData.length === length) {
        inputRefs.current[length - 1]?.focus();
      } else if (pastedData.length > 0) {
        inputRefs.current[pastedData.length]?.focus();
      }
    },
    [disabled, updateValue, length],
  );

  return (
    <div className='flex items-center justify-center gap-2 sm:gap-3'>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled}
            autoFocus={index === 0}
            className={cn(
              'h-12 w-10 sm:h-14 sm:w-12 rounded-xl border bg-secondary/20 text-center text-lg font-semibold text-foreground backdrop-blur-sm transition-all duration-200',
              'border-border',
              'focus:border-teal-500/60 focus:bg-secondary/40 focus:outline-none focus:ring-4 focus:ring-teal-500/10',
              'dark:focus:border-teal-300/40 dark:focus:ring-teal-300/10',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          />
        ))}
    </div>
  );
}

export default OTPInput;
