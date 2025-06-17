// خدمة API للتواصل مع النظام الخلفي
const API_BASE_URL = 'https://property-management-backend-2.onrender.com/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // إعداد الرؤوس
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // طلب HTTP عام
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ في الطلب');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // طرق HTTP
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // تعيين التوكن
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // إزالة التوكن
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // المصادقة
  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async logout() {
    this.removeToken();
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  // الشركات
  async getCompanies() {
    return this.get('/auth/companies');
  }

  // لوحة التحكم
  async getDashboardOverview() {
    return this.get('/dashboard/overview');
  }

  async getRecentActivities(limit = 10) {
    return this.get(`/dashboard/recent-activities?limit=${limit}`);
  }

  async getRevenueChart(months = 6) {
    return this.get(`/dashboard/charts/revenue?months=${months}`);
  }

  async getOccupancyChart() {
    return this.get('/dashboard/charts/occupancy');
  }

  async getUpcomingEvents() {
    return this.get('/dashboard/upcoming-events');
  }

  async getAlerts() {
    return this.get('/dashboard/alerts');
  }

  // العقارات
  async getProjects(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/property/projects?${queryString}`);
  }

  async createProject(data) {
    return this.post('/property/projects', data);
  }

  async getBuildings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/property/buildings?${queryString}`);
  }

  async createBuilding(data) {
    return this.post('/property/buildings', data);
  }

  async getBuilding(id) {
    return this.get(`/property/buildings/${id}`);
  }

  async getUnits(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/property/units?${queryString}`);
  }

  async createUnit(data) {
    return this.post('/property/units', data);
  }

  async updateUnit(id, data) {
    return this.put(`/property/units/${id}`, data);
  }

  async getPropertyTypes() {
    return this.get('/property/property-types');
  }

  async getPropertyCategories() {
    return this.get('/property/property-categories');
  }

  async getPropertyStats() {
    return this.get('/property/stats');
  }

  // العقود
  async getContracts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/contract?${queryString}`);
  }

  async createContract(data) {
    return this.post('/contract', data);
  }

  async getContract(id) {
    return this.get(`/contract/${id}`);
  }

  async getPersons(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/contract/persons?${queryString}`);
  }

  async createPerson(data) {
    return this.post('/contract/persons', data);
  }

  async getPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/contract/payments?${queryString}`);
  }

  async markPaymentPaid(id, data) {
    return this.post(`/contract/payments/${id}/pay`, data);
  }

  async getCheques(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/contract/cheques?${queryString}`);
  }

  async createCheque(data) {
    return this.post('/contract/cheques', data);
  }

  async getContractStats() {
    return this.get('/contract/stats');
  }

  // المالية
  async getExpenses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/finance/expenses?${queryString}`);
  }

  async createExpense(data) {
    return this.post('/finance/expenses', data);
  }

  async updateExpense(id, data) {
    return this.put(`/finance/expenses/${id}`, data);
  }

  async getExpenseCategories() {
    return this.get('/finance/expense-categories');
  }

  async createExpenseCategory(data) {
    return this.post('/finance/expense-categories', data);
  }

  async getMaintenanceRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/finance/maintenance-requests?${queryString}`);
  }

  async createMaintenanceRequest(data) {
    return this.post('/finance/maintenance-requests', data);
  }

  async getIncomeStatement(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/finance/reports/income-statement?${queryString}`);
  }

  async getCashFlow(months = 6) {
    return this.get(`/finance/reports/cash-flow?months=${months}`);
  }

  async getReceivablesReport() {
    return this.get('/finance/reports/receivables');
  }

  async getFinanceStats() {
    return this.get('/finance/stats');
  }
}

export default new ApiService();

