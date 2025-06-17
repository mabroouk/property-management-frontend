import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Lock, User } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
    } catch (err) {
      setError(err.message || 'فشل في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* شعار النظام */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            نظام إدارة العقارات
          </h1>
          <p className="text-gray-600">
            منصة متكاملة لإدارة المكاتب العقارية
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              أدخل بيانات الدخول للوصول إلى النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="أدخل اسم المستخدم"
                    className="pr-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="أدخل كلمة المرور"
                    className="pr-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>

            {/* بيانات تجريبية */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">بيانات تجريبية:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>اسم المستخدم: admin</p>
                <p>كلمة المرور: admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* معلومات إضافية */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2025 نظام إدارة العقارات. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

