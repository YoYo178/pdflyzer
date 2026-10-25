import type { TOAuthMode } from '@/api/handlers/auth/types';
import { IconArrowLeft } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import AuthOptions from './AuthOptions';

const METHOD_PARAM = 'method';
const EMAIL_METHOD = 'email';

const EASE = [0.22, 1, 0.36, 1] as const;

// With only two stages, the travel direction is implied by the stage being
// entered: the email stage always slides in from the right and exits right,
// the options stage always slides in from the left. Browser back and forward
// therefore animate exactly like the in-app controls.
const EMAIL_STAGE_MOTION = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 40 },
} as const;

const OPTIONS_STAGE_MOTION = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
} as const;

const stageTransition = { duration: 0.26, ease: EASE };

interface AuthFlowProps {
  mode: TOAuthMode;
  /** Rendered on the email stage. Remounted every time the stage is entered. */
  form: ReactNode;
}

/**
 * Two stage auth flow: pick a method, then supply credentials.
 *
 * The active stage lives in the `?method=email` search param so the browser
 * back button, a page refresh and shared links all behave as expected.
 */
function AuthFlow({ mode, form }: AuthFlowProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const stage =
    searchParams.get(METHOD_PARAM) === EMAIL_METHOD ? 'email' : 'options';

  const setMethod = useCallback(
    (method: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (method === null) next.delete(METHOD_PARAM);
        else next.set(METHOD_PARAM, method);

        return next;
      });
    },
    [setSearchParams],
  );

  const onSelectEmail = useCallback(() => setMethod(EMAIL_METHOD), [setMethod]);
  const onBack = useCallback(() => setMethod(null), [setMethod]);

  return (
    <div className='mx-auto mt-8 w-full max-w-sm'>
      <motion.div
        layout
        transition={{ layout: { duration: 0.32, ease: EASE } }}
        className='grid'
      >
        <AnimatePresence initial={false} mode='sync'>
          {stage === 'options' ? (
            <motion.div
              key='options'
              {...OPTIONS_STAGE_MOTION}
              transition={stageTransition}
              className='[grid-area:1/1]'
            >
              <AuthOptions mode={mode} onSelectEmail={onSelectEmail} />
            </motion.div>
          ) : (
            <motion.div
              key='email'
              {...EMAIL_STAGE_MOTION}
              transition={stageTransition}
              className='[grid-area:1/1]'
            >
              <div className='text-left'>
                <div className='flex items-center justify-between gap-4'>
                  <button
                    type='button'
                    onClick={onBack}
                    className='group -ml-1 inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
                  >
                    <IconArrowLeft className='h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5' />
                    Back
                  </button>
                </div>

                <div className='mt-6'>{form}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default AuthFlow;
