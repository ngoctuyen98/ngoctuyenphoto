
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  onSuccess: () => void;
}

const ALLOWED_EMAIL = '98nguyenngoctuyen@gmail.com';
const ALLOWED_PASSWORD = 'tuyen123@';

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email !== ALLOWED_EMAIL || password !== ALLOWED_PASSWORD) {
        toast({
          title: "Authentication failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Store auth state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      
      toast({
        title: "Login successful",
        description: "Welcome to your photography portfolio!"
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-thin text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600 font-light">Sign in to manage your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-sm font-light text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-light text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
            placeholder="Enter your password"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-light"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
