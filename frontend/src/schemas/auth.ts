import * as v from 'valibot';

export const registerFormSchema = v.config(
  v.pipe(
    v.object({
      fullName: v.pipe(
        v.string('Invalid full name value'),
        v.trim(),
        v.minLength(1, 'Full name is required'),
        v.check((input) => input.includes(' '), 'Please enter your full name'),
      ),
      email: v.pipe(
        v.string('Invalid email value'),
        v.trim(),
        v.minLength(1, 'Email is required'),
        v.email('Invalid email'),
      ),
      password: v.pipe(
        v.string('Invalid password value'),
        v.minLength(8, 'Password must be at least 8 characters long'),
        v.maxLength(128, 'Password must not exceed 128 characters'),

        v.check(
          (input) => /[a-z]/.test(input),
          'Password must contain at least one lowercase letter',
        ),

        v.check(
          (input) => /[A-Z]/.test(input),
          'Password must contain at least one uppercase letter',
        ),

        v.check(
          (input) => /\d/.test(input),
          'Password must contain at least one numeric digit',
        ),

        v.check(
          (input) => /[^A-Za-z0-9]/.test(input),
          'Password must contain at least one special character',
        ),

        v.check(
          (input) => !/\s/.test(input),
          'Password must not contain whitespace or spaces',
        ),
      ),
      confirmPassword: v.pipe(
        v.string('Invalid confirm password value'),
        v.minLength(1, 'Confirm password is required'),
      ),
    }),
    v.forward(
      v.partialCheck(
        [['password'], ['confirmPassword']],
        (input) => input.password === input.confirmPassword,
        'Passwords do not match',
      ),
      ['confirmPassword'],
    ),
  ),
  { abortPipeEarly: false },
);

export type TRegisterSchema = v.InferOutput<typeof registerFormSchema>;
