'use client';

import { motion } from 'framer-motion';

export default function Overlay() {
  return (
    <>
      <motion.div
        className="mugran-mark"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <img src="/whitelogo.svg" alt="Mugran" />
      </motion.div>

      <div className="mugran-overlay">
        <motion.div
          className="mugran-glass-panel"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        >
          <div className="mugran-eyebrow">Coming Soon</div>
          <div className="mugran-headline">Designing the next big thing.</div>
          <div className="mugran-subline">
            Mugran Creative Agency. Launching Soon.
          </div>
        </motion.div>
      </div>
    </>
  );
}
