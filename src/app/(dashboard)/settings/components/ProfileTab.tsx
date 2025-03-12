"use client";

import { Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader } from "react-icons/fi";

// Lazy load components
const ProfileForm = lazy(() => import("./ProfileForm"));
const PasswordForm = lazy(() => import("./PasswordForm"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full p-8 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <FiLoader className="w-6 h-6 text-primary-50" />
    </motion.div>
  </div>
);

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

export default function ProfileTab() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-0 space-y-6"
    >
      <AnimatePresence mode="wait">
        <Suspense key="profile-form" fallback={<LoadingFallback />}>
          <motion.div key="profile-motion" variants={itemVariants}>
            <ProfileForm />
          </motion.div>
        </Suspense>

        <Suspense key="password-form" fallback={<LoadingFallback />}>
          <motion.div key="password-motion" variants={itemVariants}>
            <PasswordForm />
          </motion.div>
        </Suspense>
      </AnimatePresence>
    </motion.div>
  );
}
