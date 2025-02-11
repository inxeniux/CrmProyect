// src/server/initCron.ts
import cron from 'node-cron';
import { processScheduledEmails } from '../workers/emailWorkers';

export function initCron() {
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
    // Ejecutar cada 15 minutos
    cron.schedule('*/15 * * * *', async () => {
      console.log('Iniciando procesamiento de emails programados...');
      try {
        await processScheduledEmails();
        console.log('Procesamiento completado');
      } catch (error) {
        console.error('Error procesando emails:', error);
      }
    });
  }
}