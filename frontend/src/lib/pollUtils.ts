import { axios } from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export const usePollActions = () => {
    const { toast } = useToast()
    const router = useRouter()

    const onDelete = async (pollId: string, updatePollsAfterDelete?: (pollId: string) => void) => {
        const access_token = localStorage.getItem('access_token')
        const res = await axios(`/api/v1/polls/${pollId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        if (res.success) {
            toast({
                title: "Success ✅",
                description: "The Poll is deleted successfully!",
            })
            if (updatePollsAfterDelete) {
                updatePollsAfterDelete(pollId)
            } else {
                router.push('/polls/all')
            }
        } else {
            toast({
                title: "Error ❌",
                description: "Something went wrong!",
            })
        }
    }

    const onShare = async (pollId: string) => {
        const pollUrl = `${window.location.origin}/polls/vote/${pollId}`
        try {
            await navigator.clipboard.writeText(pollUrl)
            toast({
                title: "Copied! ✅",
                description: "Poll url has been copied to clipboard.",
            })
        } catch {
            toast({
                title: "Error ❌",
                description: "Failed to copy url. Please try again.",
            })
        }
    }

    return { onDelete, onShare }
}