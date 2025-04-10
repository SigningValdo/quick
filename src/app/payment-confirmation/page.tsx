"use client";

// Importer le composant ConfettiExplosion en haut du fichier
// import { ConfettiExplosion } from "@/components/confetti-explosion";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

interface PaymentConfirmationProps {
  searchParams: {
    status?: string;
  };
}

export default function PaymentConfirmation({
  searchParams,
}: PaymentConfirmationProps) {
  const { status } = searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="bg-white p-8 rounded-lg shadow-md text-center"
      >
        {status === "success" && <ConfettiExplosion />}
        {status === "success" ? (
          <>
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been processed.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600">
              There was an error processing your payment. Please try again.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface ConfettiExplosionProps {
  duration?: number;
  particleCount?: number;
  spread?: number;
  colors?: string[];
}

const ConfettiExplosion = ({
  duration = 3000,
  particleCount = 100,
  spread = 70,
  colors = ["#26a69a", "#4db6ac", "#80cbc4", "#b2dfdb", "#e0f2f1"],
}: ConfettiExplosionProps) => {
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    if (!isExploding) {
      setIsExploding(true);

      const end = Date.now() + duration;

      // Lancer des confettis à intervalles réguliers
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }

        const particleCountVariation = Math.floor(Math.random() * 30) - 15;

        confetti({
          particleCount: particleCount + particleCountVariation,
          spread: spread,
          origin: { y: 0.6, x: Math.random() },
          colors: colors,
          disableForReducedMotion: true,
        });
      }, 250);

      // Nettoyage
      return () => {
        clearInterval(interval);
        confetti.reset();
      };
    }
  }, [isExploding, duration, particleCount, spread, colors]);

  return null;
};
