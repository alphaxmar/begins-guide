
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold text-primary">
          Begins Guide
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="text-foreground/60 transition-colors hover:text-foreground/80">
            หน้าแรก
          </Link>
          <Link to="/articles" className="text-foreground/60 transition-colors hover:text-foreground/80">
            บทความ
          </Link>
          <Link to="/courses" className="text-foreground/60 transition-colors hover:text-foreground/80">
            คอร์สออนไลน์
          </Link>
        </nav>
        <Button>
          <LogIn className="mr-2 h-4 w-4" />
          เข้าสู่ระบบ
        </Button>
      </div>
    </header>
  );
};

export default Header;
