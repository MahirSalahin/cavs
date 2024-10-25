import { LinkButton } from '@/components/ui/linkButton';
import { ArrowRight } from 'lucide-react';
import { FadeDown, FadeUp } from '@/components/Animation';
import AnimatedText from '@/components/AnimatedText';
import { supabase } from '@/services/supabaseClient';
import { getUser } from '@/lib/auth-actions';

export default async function HomePage() {
  const user = await getUser();
  console.log({user});

  return (
    <section className="flex justify-center items-center flex-col text-center container">
      <FadeDown>
        <h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium text-center leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl">
          Have Your Say,<br/> The Anonymous Way!<br/>
        </h1>
      </FadeDown>
      <FadeUp>
        <h2  className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-4xl font-medium text-center leading-none tracking-tighter text-transparent text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to CUET Anonymous Voting System, <span><AnimatedText text='CAVS' className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl' /></span>
        </h2>
      </FadeUp>

      <FadeUp delay={0.3}>
        <p className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl text-balance">
          Vote without fear, without bias. Your voice, your choice, anonymously recorded.<br className="hidden md:block" />
          Join your peers at CUET and make your opinion count securely and privately.
        </p>
      </FadeUp>

      <FadeUp delay={0.7}>
        <LinkButton className="flex items-center gap-1" href="/polls/all">
          Get Started <ArrowRight size={16} />
        </LinkButton>
      </FadeUp>
    </section>
  );
}
