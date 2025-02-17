
import { Metadata } from 'next';
import ResetPasswordForm from './resetPasswordForm';

export const metadata: Metadata = {
  title: 'Restablecer Contraseña | Niux',
  description: 'Restablezca su contraseña de niux',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm/>;
}

