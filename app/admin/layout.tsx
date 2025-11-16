import { ConfirmProvider } from '@/hooks/use-confirm'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ConfirmProvider>{children}</ConfirmProvider>
}
