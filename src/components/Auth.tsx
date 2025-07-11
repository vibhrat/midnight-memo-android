
import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { signIn, signUp } from '@/integrations/firebase/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
  const { user } = useFirebaseAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // If user is already authenticated, redirect
    if (user) {
      onAuthSuccess();
    }
  }, [user, onAuthSuccess]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { user: signedInUser, error } = await signIn(email, password);
        if (error) {
          throw new Error(error);
        }
        if (signedInUser) {
          toast({
            title: "Success",
            description: "Logged in successfully!",
          });
          onAuthSuccess();
        }
      } else {
        const { user: signedUpUser, error } = await signUp(email, password);
        if (error) {
          throw new Error(error);
        }
        if (signedUpUser) {
          toast({
            title: "Success",
            description: "Account created successfully!",
          });
          onAuthSuccess();
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          {/* Vertex Logo */}
          <div className="flex justify-center mb-8">
            <svg width="88" height="107" viewBox="0 0 177 215" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M48.0001 136H128L95.0001 215H81.0001L48.0001 136Z" fill="white"/>
              <path d="M115 107.5L109 136H128L176.5 68L165.5 0V57.5L115 107.5Z" fill="white"/>
              <path d="M61.5 107.5L67.0001 136H48.0001L0 68L11 0V57.5L61.5 107.5Z" fill="white"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#DBDBDB] tracking-widest">VERTEX</h1>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-0 border-b border-[#9B9B9B] pb-2 text-[#DBDBDB] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#DBDBDB] transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-0 border-b border-[#9B9B9B] pb-2 text-[#DBDBDB] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#DBDBDB] transition-colors"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DBDBDB] hover:bg-[#9B9B9B] text-[#000000] mt-8"
          >
            {loading ? 'Loading...' : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </Button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="block w-full text-[#DBDBDB] hover:text-[#9B9B9B]"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
