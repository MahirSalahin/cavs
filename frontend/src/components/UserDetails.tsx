import { Card, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProps {
    email?: string;
    full_name?: string;
    avatar_url?: string;
}

export default function UserDetails({ email, full_name, avatar_url }: UserProps) {
    // const formatDate = (dateString?: string) => {
    //     if (!dateString) return 'N/A';
    //     const date = new Date(dateString);
    //     return date.toLocaleString('en-US', {
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //     });
    // };

    const getInitials = (name?: string) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-16 h-16">
                    <AvatarImage src={avatar_url} alt={full_name} />
                    <AvatarFallback>{getInitials(full_name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                    <h5>{full_name || 'N/A'}</h5>
                    <p className="text-sm text-muted-foreground">{email || 'N/A'}</p>
                </div>
            </CardHeader>
        </Card>
    )
}


export function UserDetailsFallback(){
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </CardHeader>
        </Card>
    );
}