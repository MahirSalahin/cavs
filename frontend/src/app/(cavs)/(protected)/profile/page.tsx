import { getUser } from '@/lib/auth-actions'
import { Metadata } from 'next'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    return <div className="container mt-8 text-center">User not found</div>
  }

  return (
    <div className='container max-w-2xl mt-8'>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url} alt={user.full_name} />
            <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.full_name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}