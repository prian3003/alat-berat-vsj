import { ConfirmProvider } from '@/hooks/use-confirm'
import { AuthProvider } from '@/context/AuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </AuthProvider>
  )
}
