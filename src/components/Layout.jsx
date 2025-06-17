import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Building2, 
  Home, 
  FileText, 
  DollarSign, 
  Users, 
  Settings, 
  Menu, 
  LogOut,
  User,
  Bell,
  Search,
  Calculator,
  Wrench,
  BarChart3,
  Calendar,
  FileBarChart
} from 'lucide-react';

const Layout = ({ children, currentPage = 'dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    {
      name: 'لوحة التحكم',
      href: '/dashboard',
      icon: Home,
      id: 'dashboard'
    },
    {
      name: 'العقارات',
      href: '/properties',
      icon: Building2,
      id: 'properties',
      children: [
        { name: 'المشاريع', href: '/projects', id: 'projects' },
        { name: 'المباني', href: '/buildings', id: 'buildings' },
        { name: 'الوحدات', href: '/units', id: 'units' },
      ]
    },
    {
      name: 'العقود',
      href: '/contracts',
      icon: FileText,
      id: 'contracts',
      children: [
        { name: 'قائمة العقود', href: '/contracts-list', id: 'contracts-list' },
        { name: 'الأشخاص', href: '/persons', id: 'persons' },
        { name: 'الدفعات', href: '/payments', id: 'payments' },
        { name: 'الشيكات', href: '/cheques', id: 'cheques' },
      ]
    },
    {
      name: 'المحاسبة',
      href: '/finance',
      icon: Calculator,
      id: 'finance',
      children: [
        { name: 'المصروفات', href: '/expenses', id: 'expenses' },
        { name: 'التقارير المالية', href: '/financial-reports', id: 'financial-reports' },
        { name: 'قائمة الدخل', href: '/income-statement', id: 'income-statement' },
      ]
    },
    {
      name: 'الصيانة',
      href: '/maintenance',
      icon: Wrench,
      id: 'maintenance'
    },
    {
      name: 'التقارير',
      href: '/reports',
      icon: FileBarChart,
      id: 'reports'
    },
    {
      name: 'الإعدادات',
      href: '/settings',
      icon: Settings,
      id: 'settings'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* شعار الشركة */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-lg truncate">
            {company?.name || 'نظام إدارة العقارات'}
          </h2>
          <p className="text-sm text-muted-foreground truncate">
            {company?.address || 'منصة متكاملة'}
          </p>
        </div>
      </div>

      {/* القائمة الرئيسية */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <div key={item.id}>
            <Button
              variant={currentPage === item.id ? 'default' : 'ghost'}
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                navigate(item.href);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Button>
            
            {item.children && (
              <div className="mr-8 mt-2 space-y-1">
                {item.children.map((child) => (
                  <Button
                    key={child.id}
                    variant={currentPage === child.id ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(child.href);
                      setSidebarOpen(false);
                    }}
                  >
                    {child.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* معلومات المستخدم */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {user?.first_name?.charAt(0) || 'م'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* الشريط الجانبي للشاشات الكبيرة */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:z-50 lg:w-72 lg:block">
        <div className="bg-card border-l border-border h-full">
          <SidebarContent />
        </div>
      </div>

      {/* الشريط الجانبي للشاشات الصغيرة */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* المحتوى الرئيسي */}
      <div className="lg:pr-72">
        {/* الشريط العلوي */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* زر القائمة للشاشات الصغيرة */}
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>

              {/* شريط البحث */}
              <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-96">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="البحث في النظام..."
                  className="bg-transparent border-none outline-none flex-1 text-sm"
                />
              </div>
            </div>

            {/* أدوات الشريط العلوي */}
            <div className="flex items-center gap-4">
              {/* التنبيهات */}
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>

              {/* قائمة المستخدم */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>
                        {user?.first_name?.charAt(0) || 'م'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    الملف الشخصي
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    الإعدادات
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* المحتوى */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

