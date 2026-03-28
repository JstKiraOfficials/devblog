import { Modal, Button } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDeleteModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  loading?: boolean
}

export const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  title = 'this post',
  loading,
}: ConfirmDeleteModalProps) => (
  <Modal open={open} onClose={onClose} title="Confirm Delete">
    <div className="flex gap-4 mb-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertTriangle size={18} className="text-red-400" />
      </div>
      <div>
        <p className="text-text-primary text-sm">
          Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.
        </p>
      </div>
    </div>
    <div className="flex gap-3 justify-end">
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>
        Delete
      </Button>
    </div>
  </Modal>
)
