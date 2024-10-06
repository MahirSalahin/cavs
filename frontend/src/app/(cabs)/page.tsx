
import { LinkButton } from '@/components/ui/linkButton';
import { ArrowRight } from 'lucide-react';
import { FadeDown, FadeUp } from '@/components/Animation';
import { decodeJWT, getUser } from '@/lib/auth-actions';
// import { Card, CardContent } from '@/components/ui/card';
import UserDetails, { UserDetailsFallback } from '@/components/UserDetails';

export default async function HomePage() {
  const user = await getUser()
  await decodeJWT()
  // console.log(user)
  return (
    <section className='flex justify-center items-center flex-col text-center'>
      <FadeDown>
        <h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium text-center leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl ">CABS is the new way<br className="hidden md:block" /> to build you opinion stronger.</h1>
      </FadeDown>

      <FadeUp delay={0.3}>
        <p className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl text-balance">Beautifully designed, animated components and templates built with<br className="hidden md:block" /> Tailwind CSS, React, and Framer Motion.</p>
      </FadeUp>

      <FadeUp delay={0.7}>
        <LinkButton className='flex items-center gap-1' href="/polls">Get Started <ArrowRight size={16} /></LinkButton>
      </FadeUp>

      <FadeUp delay={1.1}>
        <div className='mt-8'>
          {user ?
            <UserDetails
              full_name={user.user_metadata.full_name}
              email={user.email}
              avatar_url={user.user_metadata.avatar_url}
            />
            : <UserDetailsFallback />
          }
        </div>
      </FadeUp>

    </section>
  );
}
