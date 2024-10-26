'use client';

import { useLoadingOverlay } from '@/hooks/use-loading-overlay';
import {
    Dialog,
    DialogOverlay,
} from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react';

export default function LoadingOverlayProvider() {
    const open = useLoadingOverlay(state => state.isOpen)
    return (
        <>
            <Dialog open={open}>
                <DialogOverlay className='flex justify-center items-center w-full h-full'>
                    <Loader2 className="animate-spin text-white" size={40} />
                </DialogOverlay>
            </Dialog>
        </>
    )
}
