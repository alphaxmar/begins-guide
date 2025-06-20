
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNewsletterSubscription } from '@/hooks/useEmailSubscription';
import { Mail } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const subscribe = useNewsletterSubscription();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      subscribe.mutate(email, {
        onSuccess: () => {
          setEmail('');
        }
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          รับข่าวสารจาก Begins Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="กรอกอีเมลของคุณ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="w-full"
            disabled={subscribe.isPending}
          >
            {subscribe.isPending ? 'กำลังสมัคร...' : 'สมัครรับข่าวสาร'}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-2">
          รับเทคนิคและเคล็ดลับการทำธุรกิจใหม่ๆ ทุกสัปดาห์
        </p>
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;
