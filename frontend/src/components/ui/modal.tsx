import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ModalProps {
    title: string
    description: string
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
};

export default function Modal({ title, description, isOpen, onClose, children }: ModalProps) {
    const onChange = (open: boolean) => {
        if (!open) onClose();
    }
    return (
        <div className='p-'>
            <Dialog open={isOpen} onOpenChange={onChange}>
                <DialogContent className='!p-4'>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <div>
                        {children}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
