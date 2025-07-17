import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, User, LogOut, ShieldCheck, ShoppingCart, Brain, Menu, X, Users, Home } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useVipStatus } from '@/hooks/useVipStatus';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const { isVip } = useVipStatus();
  const { items } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('ออกจากระบบสำเร็จ');
    } catch (error) {
      console.error('Sign out error in header:', error);
      // Show success message anyway since we're redirecting
      toast.success('ออกจากระบบสำเร็จ');
    }
  };

  const totalItems = (items || []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold text-primary">
          Begins Guide
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="text-foreground/60 transition-colors hover:text-foreground/80 flex items-center gap-1">
            <Home className="h-4 w-4" />
            หน้าแรก
          </Link>
          <Link to="/courses" className="text-foreground transition-colors hover:text-foreground/90 font-semibold">
            คอร์สเรียน
          </Link>
          <Link to="/articles" className="text-foreground/60 transition-colors hover:text-foreground/80">
            บทความ
          </Link>
          <Link to="/products" className="text-foreground/60 transition-colors hover:text-foreground/80">
            สินค้าดิจิทัล
          </Link>
          {user && isVip && (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-foreground/60 transition-colors hover:text-foreground/80 flex items-center gap-1 focus:outline-none">
                <Brain className="h-4 w-4" />
                Pro Member
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs ml-1">PRO</Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/pro')}>
                  <User className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Pro Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/toolbox')}>
                  <Brain className="mr-2 h-4 w-4 text-purple-600" />
                  <span>AI Tools</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/affiliate')}>
                  <Users className="mr-2 h-4 w-4 text-green-600" />
                  <span>Affiliate</span>
                  <Badge className="ml-auto bg-green-500 text-white text-xs">30%</Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Shopping Cart */}
          <Button variant="ghost" size="sm" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Link>
          </Button>

          {loading ? (
            <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">เข้าสู่ระบบด้วย</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    {isVip && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 mt-1 w-fit">
                        PRO
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>โปรไฟล์</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                    <span>ผู้ดูแลระบบ</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/courses">คอร์สเรียน</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  เข้าสู่ระบบ
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background/95 backdrop-blur-sm">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              to="/" 
              className="block text-foreground/60 transition-colors hover:text-foreground/80 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              หน้าแรก
            </Link>
            <Link 
              to="/courses" 
              className="block text-foreground transition-colors hover:text-foreground/90 py-2 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              คอร์สเรียน
            </Link>
            <Link 
              to="/articles" 
              className="block text-foreground/60 transition-colors hover:text-foreground/80 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              บทความ
            </Link>
            <Link 
              to="/products" 
              className="block text-foreground/60 transition-colors hover:text-foreground/80 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              สินค้าดิจิทัล
            </Link>
            {user && isVip && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 text-foreground/80 mb-3">
                  <Brain className="h-4 w-4" />
                  <span className="font-medium">Pro Member</span>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">PRO</Badge>
                </div>
                <div className="ml-6 space-y-2">
                  <Link 
                    to="/pro" 
                    className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 text-blue-600" />
                    Pro Dashboard
                  </Link>
                  <Link 
                    to="/toolbox" 
                    className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Brain className="h-4 w-4 text-purple-600" />
                    AI Tools
                  </Link>
                  <Link 
                    to="/affiliate" 
                    className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4 text-green-600" />
                    Affiliate
                    <Badge className="bg-green-500 text-white text-xs">30%</Badge>
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
