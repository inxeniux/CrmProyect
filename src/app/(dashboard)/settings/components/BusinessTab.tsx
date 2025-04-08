"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import BussinessData from "./business/BussinessData";
import UserCreationForm from "./business/UserCreationForm";
import UsersTable from "./business/UsersTable";

export default function BusinessTab() {
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Callback para cuando se crea un usuario para actualizar la tabla
  const handleUserCreated = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  // Animation variants for staggered children
  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerAnimation}
      className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-0"
    >
      <motion.div variants={itemAnimation}>
        <BussinessData />
      </motion.div>

      {/* Formulario de creación de usuario */}
      <div className="mt-6">
        <UserCreationForm onUserCreated={handleUserCreated} />
      </div>

      {/* Tabla de usuarios */}
      <motion.div variants={itemAnimation} className="mt-6 sm:mt-8 md:mt-10">
        <UsersTable key={`users-table-${refreshCounter}`} />
      </motion.div>
    </motion.div>
  );
}
