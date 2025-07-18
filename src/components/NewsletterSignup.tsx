
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';
import { toast } from 'sonner';
import { Mail, Loader2 } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  showName?: boolean;
  variant?: 'card' | 'inline';
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = '',
  title = 'รับข่าวสารจาก begins.Guide',
  description = 'รับเคล็ดลับและข่าวสารล่าสุดเกี่ยวกับการประกอบธุรกิจและการจัดการการเงิน',
  buttonText = 'สมัครรับข่าวสาร',
  showName = false,
  variant = 'card'
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  
  const { subscribeToNewsletter } = useNewsletterSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('กรุณากรอกอีเมล');
      return;
    }

    if (!acceptTerms) {
      toast.error('กรุณายอมรับเงื่อนไขการใช้งาน');
      return;
    }

    subscribeToNewsletter.mutate(
      { 
        email: email.trim(), 
        source: 'newsletter_signup'
      },
      {
        onSuccess: () => {
          setEmail('');
          setName('');
          toast.success('สมัครรับข่าวสารสำเร็จ!', {
            description: 'คุณจะได้รับอีเมลยืนยันในอีกสักครู่'
          });
        },
        onError: (error: any) => {
          toast.error('เกิดข้อผิดพลาดในการสมัครรับข่าวสาร', {
            description: error.message || 'กรุณาลองใหม่อีกครั้ง'
          });
        }
      }
    );
  };

  const content = (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {showName && (
          <Input
            type="text"
            placeholder="ชื่อของคุณ (ไม่บังคับ)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        
        <Input
          type="email"
          placeholder="อีเมลของคุณ"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="newsletter-terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <label
            htmlFor="newsletter-terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ยอมรับการรับข่าวสารและเคล็ดลับจาก begins.Guide
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={subscribeToNewsletter.isPending}
        >
          {subscribeToNewsletter.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังสมัครสมาชิก...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>
    </>
  );

  if (variant === 'card') {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg ${className}`}>
      {content}
    </div>
  );
};

export default NewsletterSignup;
