import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Home, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import apiService from '../lib/api';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // تحميل البيانات بشكل متوازي
      const [
        overviewRes,
        activitiesRes,
        revenueRes,
        occupancyRes,
        eventsRes,
        alertsRes
      ] = await Promise.all([
        apiService.getDashboardOverview(),
        apiService.getRecentActivities(5),
        apiService.getRevenueChart(6),
        apiService.getOccupancyChart(),
        apiService.getUpcomingEvents(),
        apiService.getAlerts()
      ]);

      setOverview(overviewRes);
      setRecentActivities(activitiesRes.activities);
      setRevenueData(revenueRes.revenue_data);
      setOccupancyData(occupancyRes);
      setUpcomingEvents(eventsRes.events);
      setAlerts(alertsRes.alerts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'contract_created':
        return <FileText className="w-4 h-4" />;
      case 'payment_received':
        return <DollarSign className="w-4 h-4" />;
      case 'maintenance_request':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
    }
  };

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان الرئيسي */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">نظرة عامة على أداء النظام</p>
        </div>
        <Button onClick={loadDashboardData}>
          تحديث البيانات
        </Button>
      </div>

      {/* التنبيهات */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
              {getAlertIcon(alert.type)}
              <AlertDescription className="mr-2">
                <strong>{alert.title}:</strong> {alert.message}
                {alert.action && (
                  <Button variant="link" size="sm" className="p-0 h-auto mr-2">
                    {alert.action}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المباني</p>
                <p className="text-3xl font-bold">{overview?.properties?.total_buildings || 0}</p>
              </div>
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">معدل الإشغال</p>
                <p className="text-3xl font-bold">{overview?.properties?.occupancy_rate || 0}%</p>
                <p className="text-xs text-muted-foreground">
                  {overview?.properties?.occupied_units || 0} من {overview?.properties?.total_units || 0} وحدة
                </p>
              </div>
              <Home className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الإيرادات الشهرية</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(overview?.finance?.monthly_revenue || 0)}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  {overview?.finance?.net_income >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={overview?.finance?.net_income >= 0 ? 'text-green-600' : 'text-red-600'}>
                    صافي الربح: {formatCurrency(overview?.finance?.net_income || 0)}
                  </span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">العقود النشطة</p>
                <p className="text-3xl font-bold">{overview?.contracts?.active_contracts || 0}</p>
                {overview?.contracts?.expiring_contracts > 0 && (
                  <p className="text-xs text-yellow-600">
                    {overview.contracts.expiring_contracts} عقد ينتهي قريباً
                  </p>
                )}
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* مخطط الإيرادات */}
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات الشهرية</CardTitle>
            <CardDescription>إيرادات آخر 6 أشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'الإيرادات']}
                  labelFormatter={(label) => `الشهر: ${label}`}
                />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* مخطط الإشغال */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الوحدات</CardTitle>
            <CardDescription>حالة الوحدات الحالية</CardDescription>
          </CardHeader>
          <CardContent>
            {occupancyData?.overall_stats && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'مؤجرة', value: occupancyData.overall_stats.occupied_units },
                      { name: 'متاحة', value: occupancyData.overall_stats.available_units },
                      { name: 'صيانة', value: occupancyData.overall_stats.maintenance_units },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieColors.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* الأنشطة الحديثة والأحداث القادمة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الأنشطة الحديثة */}
        <Card>
          <CardHeader>
            <CardTitle>الأنشطة الحديثة</CardTitle>
            <CardDescription>آخر العمليات في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  لا توجد أنشطة حديثة
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* الأحداث القادمة */}
        <Card>
          <CardHeader>
            <CardTitle>الأحداث القادمة</CardTitle>
            <CardDescription>المهام والمواعيد المهمة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="mt-1">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{event.title}</p>
                      <Badge variant={event.priority === 'high' ? 'destructive' : 'secondary'}>
                        {event.priority === 'high' ? 'عاجل' : 'عادي'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  لا توجد أحداث قادمة
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* إجراءات سريعة */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
          <CardDescription>الوصول السريع للعمليات الشائعة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Building2 className="w-6 h-6" />
              إضافة مبنى
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="w-6 h-6" />
              عقد جديد
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <DollarSign className="w-6 h-6" />
              تسجيل دفعة
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="w-6 h-6" />
              إضافة شخص
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

