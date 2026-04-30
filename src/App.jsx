import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BadgePercent,
  Building2,
  ChevronRight,
  Edit3,
  Eye,
  EyeOff,
  FolderTree,
  Layers3,
  LogOut,
  Menu as MenuIcon,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Utensils,
  X,
} from 'lucide-react'
import './App.css'

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://207.180.254.216'
const ADMIN_TOKEN_KEY = 'boneless61_admin_token'
const BASE_URL_KEY = 'boneless61_api_base_url'
const UI_LANG_KEY = 'boneless61_ui_language'

const copy = {
  en: {
    brand: 'Boneless 61',
    backOffice: 'Back Office',
    signInTitle: 'Back office sign in',
    signInCopy: 'Manage branches, menu items, options, and offers.',
    serverAddress: 'Server address',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    manage: 'Manage',
    sync: 'Sync',
    add: 'Add',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    logout: 'Logout',
    search: 'Search',
    actions: 'Actions',
    active: 'Active',
    off: 'Off',
    loading: 'Loading...',
    noItems: 'No items yet.',
    items: 'items',
    editItem: 'Edit item',
    addItem: 'Add item',
    signedIn: 'Signed in',
    updated: 'Back office updated',
    changesSaved: 'Changes saved',
    itemAdded: 'Item added',
    itemDeleted: 'Item deleted',
    deleteConfirm: 'Delete',
    select: 'Select',
    statsBranches: 'Branches',
    statsMenuItems: 'Menu Items',
    statsActiveOffers: 'Active Offers',
    statsMenuOptions: 'Menu Options',
    langButton: 'العربية',
    resources: {
      branches: ['Branches', 'Pickup hubs and delivery locations'],
      categories: ['Menu Categories', 'Burger, boneless, sides and other app tabs'],
      items: ['Menu Items', 'Products, prices, calories and images'],
      optionGroups: ['Option Groups', 'Required sauce choices and add-on groups'],
      options: ['Options', 'Sauces, dips, upgrades and paid extras'],
      offers: ['Offers', 'Promo codes, BOGO deals and date windows'],
    },
    columns: {
      name: 'Name',
      city: 'City',
      address: 'Address',
      is_active: 'Active',
      name_en: 'English name',
      name_ar: 'Arabic name',
      sort_order: 'Sort order',
      category: 'Category',
      price_syp: 'Price SYP',
      calories: 'Calories',
      is_available: 'Available',
      label_en: 'English label',
      item: 'Menu item',
      is_required: 'Required',
      multi_select: 'Multi select',
      group: 'Group',
      extra_price_syp: 'Extra price SYP',
      is_default: 'Default',
      title: 'Title',
      code: 'Code',
      type: 'Type',
      discount_value: 'Discount value',
    },
    fields: {
      name: 'Name',
      city: 'City',
      address: 'Address',
      lat: 'Latitude',
      lng: 'Longitude',
      is_active: 'Active',
      name_en: 'English name',
      name_ar: 'Arabic name',
      sort_order: 'Sort order',
      category_id: 'Category',
      description_en: 'English description',
      description_ar: 'Arabic description',
      price_syp: 'Price SYP',
      calories: 'Calories',
      image_url: 'Image URL',
      is_available: 'Available',
      item_id: 'Menu item',
      label_en: 'English label',
      label_ar: 'Arabic label',
      is_required: 'Required',
      multi_select: 'Multi select',
      group_id: 'Option group',
      extra_price_syp: 'Extra price SYP',
      is_default: 'Default option',
      title: 'Title',
      description: 'Description',
      code: 'Promo code',
      type: 'Type',
      discount_value: 'Discount value',
      min_order_syp: 'Minimum order SYP',
      starts_at: 'Starts at',
      expires_at: 'Expires at',
    },
  },
  ar: {
    brand: 'بونلس 61',
    backOffice: 'لوحة الإدارة',
    signInTitle: 'تسجيل دخول الإدارة',
    signInCopy: 'إدارة الفروع، عناصر القائمة، الخيارات، والعروض.',
    serverAddress: 'عنوان الخادم',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    signingIn: 'جار تسجيل الدخول...',
    manage: 'الإدارة',
    sync: 'تحديث',
    add: 'إضافة',
    save: 'حفظ',
    saving: 'جار الحفظ...',
    cancel: 'إلغاء',
    logout: 'تسجيل الخروج',
    search: 'بحث',
    actions: 'إجراءات',
    active: 'نشط',
    off: 'متوقف',
    loading: 'جار التحميل...',
    noItems: 'لا توجد عناصر بعد.',
    items: 'عنصر',
    editItem: 'تعديل عنصر',
    addItem: 'إضافة عنصر',
    signedIn: 'تم تسجيل الدخول',
    updated: 'تم تحديث لوحة الإدارة',
    changesSaved: 'تم حفظ التغييرات',
    itemAdded: 'تمت إضافة العنصر',
    itemDeleted: 'تم حذف العنصر',
    deleteConfirm: 'حذف',
    select: 'اختر',
    statsBranches: 'الفروع',
    statsMenuItems: 'عناصر القائمة',
    statsActiveOffers: 'العروض النشطة',
    statsMenuOptions: 'خيارات القائمة',
    langButton: 'English',
    resources: {
      branches: ['الفروع', 'نقاط الاستلام ومواقع التوصيل'],
      categories: ['تصنيفات القائمة', 'تصنيفات التطبيق مثل البرغر والبونلس والجوانب'],
      items: ['عناصر القائمة', 'المنتجات والأسعار والسعرات والصور'],
      optionGroups: ['مجموعات الخيارات', 'اختيارات الصوص والإضافات المطلوبة'],
      options: ['الخيارات', 'الصوصات والإضافات والترقيات المدفوعة'],
      offers: ['العروض', 'أكواد الخصم وعروض بوجو وفترات العرض'],
    },
    columns: {
      name: 'الاسم',
      city: 'المدينة',
      address: 'العنوان',
      is_active: 'نشط',
      name_en: 'الاسم بالإنجليزية',
      name_ar: 'الاسم بالعربية',
      sort_order: 'الترتيب',
      category: 'التصنيف',
      price_syp: 'السعر ل.س',
      calories: 'السعرات',
      is_available: 'متوفر',
      label_en: 'العنوان بالإنجليزية',
      item: 'عنصر القائمة',
      is_required: 'مطلوب',
      multi_select: 'اختيار متعدد',
      group: 'المجموعة',
      extra_price_syp: 'السعر الإضافي ل.س',
      is_default: 'افتراضي',
      title: 'العنوان',
      code: 'الكود',
      type: 'النوع',
      discount_value: 'قيمة الخصم',
    },
    fields: {
      name: 'الاسم',
      city: 'المدينة',
      address: 'العنوان',
      lat: 'خط العرض',
      lng: 'خط الطول',
      is_active: 'نشط',
      name_en: 'الاسم بالإنجليزية',
      name_ar: 'الاسم بالعربية',
      sort_order: 'الترتيب',
      category_id: 'التصنيف',
      description_en: 'الوصف بالإنجليزية',
      description_ar: 'الوصف بالعربية',
      price_syp: 'السعر ل.س',
      calories: 'السعرات',
      image_url: 'رابط الصورة',
      is_available: 'متوفر',
      item_id: 'عنصر القائمة',
      label_en: 'العنوان بالإنجليزية',
      label_ar: 'العنوان بالعربية',
      is_required: 'مطلوب',
      multi_select: 'اختيار متعدد',
      group_id: 'مجموعة الخيارات',
      extra_price_syp: 'السعر الإضافي ل.س',
      is_default: 'خيار افتراضي',
      title: 'العنوان',
      description: 'الوصف',
      code: 'كود الخصم',
      type: 'النوع',
      discount_value: 'قيمة الخصم',
      min_order_syp: 'الحد الأدنى للطلب ل.س',
      starts_at: 'يبدأ في',
      expires_at: 'ينتهي في',
    },
  },
}

const adminResources = [
  {
    key: 'branches',
    title: 'Branches',
    endpoint: '/api/admin/branches',
    icon: Building2,
    description: 'Pickup hubs and delivery locations',
    idLabel: 'branch',
    columns: ['name', 'city', 'address', 'is_active'],
    form: [
      { name: 'name', label: 'Name', required: true },
      { name: 'city', label: 'City', required: true },
      { name: 'address', label: 'Address', required: true },
      { name: 'lat', label: 'Latitude', type: 'number', step: 'any' },
      { name: 'lng', label: 'Longitude', type: 'number', step: 'any' },
      { name: 'is_active', label: 'Active', type: 'boolean', defaultValue: true },
    ],
  },
  {
    key: 'categories',
    title: 'Menu Categories',
    endpoint: '/api/admin/menu-categories',
    icon: FolderTree,
    description: 'Burger, boneless, sides and other app tabs',
    idLabel: 'menuCategory',
    columns: ['name_en', 'name_ar', 'sort_order', 'is_active'],
    form: [
      { name: 'name_en', label: 'English name', required: true },
      { name: 'name_ar', label: 'Arabic name', required: true },
      { name: 'sort_order', label: 'Sort order', type: 'number', defaultValue: 1 },
      { name: 'is_active', label: 'Active', type: 'boolean', defaultValue: true },
    ],
  },
  {
    key: 'items',
    title: 'Menu Items',
    endpoint: '/api/admin/menu-items',
    icon: Utensils,
    description: 'Products, prices, calories and images',
    idLabel: 'menuItem',
    columns: ['name_en', 'category', 'price_syp', 'calories', 'is_available'],
    form: [
      { name: 'category_id', label: 'Category', type: 'select', source: 'categories', required: true },
      { name: 'name_en', label: 'English name', required: true },
      { name: 'name_ar', label: 'Arabic name', required: true },
      { name: 'description_en', label: 'English description', type: 'textarea' },
      { name: 'description_ar', label: 'Arabic description', type: 'textarea' },
      { name: 'price_syp', label: 'Price SYP', type: 'number', required: true },
      { name: 'calories', label: 'Calories', type: 'number' },
      { name: 'image_url', label: 'Image URL', type: 'url' },
      { name: 'is_available', label: 'Available', type: 'boolean', defaultValue: true },
    ],
  },
  {
    key: 'optionGroups',
    title: 'Option Groups',
    endpoint: '/api/admin/option-groups',
    icon: Layers3,
    description: 'Required sauce choices and add-on groups',
    idLabel: 'optionGroup',
    columns: ['label_en', 'item', 'is_required', 'multi_select'],
    form: [
      { name: 'item_id', label: 'Menu item', type: 'select', source: 'items', required: true },
      { name: 'label_en', label: 'English label', required: true },
      { name: 'label_ar', label: 'Arabic label', required: true },
      { name: 'is_required', label: 'Required', type: 'boolean', defaultValue: false },
      { name: 'multi_select', label: 'Multi select', type: 'boolean', defaultValue: false },
    ],
  },
  {
    key: 'options',
    title: 'Options',
    endpoint: '/api/admin/options',
    icon: SlidersHorizontal,
    description: 'Sauces, dips, upgrades and paid extras',
    idLabel: 'menuOption',
    columns: ['name_en', 'group', 'extra_price_syp', 'is_default'],
    form: [
      { name: 'group_id', label: 'Option group', type: 'select', source: 'optionGroups', required: true },
      { name: 'name_en', label: 'English name', required: true },
      { name: 'name_ar', label: 'Arabic name', required: true },
      { name: 'extra_price_syp', label: 'Extra price SYP', type: 'number', defaultValue: 0 },
      { name: 'is_default', label: 'Default option', type: 'boolean', defaultValue: false },
    ],
  },
  {
    key: 'offers',
    title: 'Offers',
    endpoint: '/api/admin/offers',
    icon: BadgePercent,
    description: 'Promo codes, BOGO deals and date windows',
    idLabel: 'offer',
    columns: ['title', 'code', 'type', 'discount_value', 'is_active'],
    form: [
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'code', label: 'Promo code' },
      { name: 'type', label: 'Type', type: 'enum', options: ['PERCENTAGE', 'FIXED', 'BOGO'], required: true },
      { name: 'discount_value', label: 'Discount value', type: 'number', defaultValue: 0 },
      { name: 'min_order_syp', label: 'Minimum order SYP', type: 'number', defaultValue: 0 },
      { name: 'starts_at', label: 'Starts at', type: 'datetime-local' },
      { name: 'expires_at', label: 'Expires at', type: 'datetime-local' },
      { name: 'is_active', label: 'Active', type: 'boolean', defaultValue: true },
    ],
  },
]

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  return []
}

function unwrapItem(payload, idLabel) {
  return payload?.[idLabel] || payload?.data || payload
}

function formatValue(value, column = '', lang = 'en') {
  if (value === null || value === undefined || value === '') return '-'
  if (typeof value === 'boolean') return value ? copy[lang].active : copy[lang].off
  if (column.includes('price') || column.includes('syp') || column === 'min_order_syp' || column === 'total_syp') {
    return `${Number(value).toLocaleString()} SYP`
  }
  if (typeof value === 'object') {
    return (
      (lang === 'ar' ? value.name_ar : value.name_en) ||
      value.name ||
      (lang === 'ar' ? value.label_ar : value.label_en) ||
      value.name_en ||
      value.label_en ||
      value.title ||
      value.order_number ||
      value.reason ||
      value.id ||
      JSON.stringify(value)
    )
  }
  return String(value)
}

function fieldInitialValue(field) {
  if (field.defaultValue !== undefined) return field.defaultValue
  if (field.type === 'boolean') return false
  return ''
}

function makeInitialForm(config, item = null) {
  return config.form.reduce((values, field) => {
    const raw = item?.[field.name]
    values[field.name] = raw ?? fieldInitialValue(field)
    if (field.type === 'datetime-local' && raw) values[field.name] = String(raw).slice(0, 16)
    return values
  }, {})
}

function App() {
  const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem(BASE_URL_KEY) || DEFAULT_BASE_URL)
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '')
  const [uiLang, setUiLang] = useState(() => localStorage.getItem(UI_LANG_KEY) || 'en')
  const [admin, setAdmin] = useState(null)
  const [activeKey, setActiveKey] = useState('branches')
  const [records, setRecords] = useState({})
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [loginValues, setLoginValues] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const activeAdminResource = useMemo(
    () => adminResources.find((resource) => resource.key === activeKey),
    [activeKey],
  )
  const activeConfig = activeAdminResource || adminResources[0]
  const text = copy[uiLang]
  const isArabic = uiLang === 'ar'
  const resourceTitle = useCallback((key) => text.resources[key]?.[0] || key, [text])
  const resourceDescription = useCallback((key) => text.resources[key]?.[1] || '', [text])

  const request = useCallback(
    async (path, token, options = {}) => {
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
        ...options,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      })
      const text = await response.text()
      const payload = text ? JSON.parse(text) : {}
      if (!response.ok) {
        const details = payload.errors
          ? Object.values(payload.errors).flat().join(' ')
          : payload.message || `Request failed with ${response.status}`
        throw new Error(details)
      }
      return payload
    },
    [baseUrl],
  )

  const adminFetch = useCallback((path, options = {}) => request(path, adminToken, options), [adminToken, request])
  const loadAdminResource = useCallback(
    async (resource, options = {}) => {
      const payload = await adminFetch(resource.endpoint)
      setRecords((current) => ({ ...current, [resource.key]: normalizeList(payload) }))
      if (!options.silent) setNotice(`${resourceTitle(resource.key)} ${uiLang === 'ar' ? 'تم تحديثه' : 'updated'}`)
    },
    [adminFetch, resourceTitle, uiLang],
  )

  const loadAll = useCallback(async () => {
    if (!adminToken) return
    setLoading(true)
    setError('')
    try {
      const me = await adminFetch('/api/admin/auth/me')
      setAdmin(me.admin_user)
      await Promise.all(adminResources.map((resource) => loadAdminResource(resource, { silent: true })))
      setNotice(text.updated)
    } catch (err) {
      setError(err.message)
      if (err.message.includes('Unauthenticated')) {
        localStorage.removeItem(ADMIN_TOKEN_KEY)
        setAdminToken('')
      }
    } finally {
      setLoading(false)
    }
  }, [adminFetch, adminToken, loadAdminResource, text.updated])

  useEffect(() => {
    localStorage.setItem(BASE_URL_KEY, baseUrl)
  }, [baseUrl])

  useEffect(() => {
    localStorage.setItem(UI_LANG_KEY, uiLang)
  }, [uiLang])

  useEffect(() => {
    const timer = window.setTimeout(loadAll, 0)
    return () => window.clearTimeout(timer)
  }, [loadAll])

  async function login(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const payload = await request('/api/admin/auth/login', '', {
        method: 'POST',
        body: JSON.stringify(loginValues),
      })
      localStorage.setItem(ADMIN_TOKEN_KEY, payload.token)
      setAdminToken(payload.token)
      setAdmin(payload.admin_user)
      setNotice(text.signedIn)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    setBusy(true)
    try {
      if (adminToken) await adminFetch('/api/admin/auth/logout', { method: 'POST' })
    } catch {
      // The token is cleared locally even if the server already revoked it.
    } finally {
      localStorage.removeItem(ADMIN_TOKEN_KEY)
      setAdminToken('')
      setAdmin(null)
      setRecords({})
      setBusy(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setFormValues(makeInitialForm(activeAdminResource))
    setFormOpen(true)
  }

  function openEdit(item) {
    setEditing(item)
    setFormValues(makeInitialForm(activeAdminResource, item))
    setFormOpen(true)
  }

  function cleanPayload(values) {
    return Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        if (value === '') return [key, null]
        return [key, value]
      }),
    )
  }

  async function saveRecord(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const path = editing ? `${activeAdminResource.endpoint}/${editing.id}` : activeAdminResource.endpoint
      const method = editing ? 'PATCH' : 'POST'
      const payload = await adminFetch(path, {
        method,
        body: JSON.stringify(cleanPayload(formValues)),
      })
      const saved = unwrapItem(payload, activeAdminResource.idLabel)
      setRecords((current) => {
        const list = current[activeAdminResource.key] || []
        const next = editing ? list.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...list]
        return { ...current, [activeAdminResource.key]: next }
      })
      setNotice(editing ? text.changesSaved : text.itemAdded)
      setFormOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function deleteRecord(item) {
    const label = item.name_en || item.name || item.title || item.id
    if (!window.confirm(`${text.deleteConfirm} ${label}?`)) return
    setBusy(true)
    setError('')
    try {
      await adminFetch(`${activeAdminResource.endpoint}/${item.id}`, { method: 'DELETE' })
      setRecords((current) => ({
        ...current,
        [activeAdminResource.key]: (current[activeAdminResource.key] || []).filter((record) => record.id !== item.id),
      }))
      setNotice(text.itemDeleted)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const activeRecords = useMemo(() => {
    const list = records[activeConfig.key] || []
    const needle = query.trim().toLowerCase()
    if (!needle) return list
    return list.filter((item) => JSON.stringify(item).toLowerCase().includes(needle))
  }, [activeConfig.key, query, records])

  const stats = useMemo(
    () => [
      { label: text.statsBranches, value: records.branches?.length || 0, icon: Building2 },
      { label: text.statsMenuItems, value: records.items?.length || 0, icon: Utensils },
      { label: text.statsActiveOffers, value: records.offers?.filter((offer) => offer.is_active).length || 0, icon: BadgePercent },
      { label: text.statsMenuOptions, value: records.options?.length || 0, icon: SlidersHorizontal },
    ],
    [records, text],
  )

  if (!adminToken) {
    return (
      <main className="auth-shell" dir={isArabic ? 'rtl' : 'ltr'}>
        <section className="auth-card">
          <div className="brand-mark">B61</div>
          <div className="language-row">
            <p className="eyebrow">{text.brand}</p>
            <button className="language-button" type="button" onClick={() => setUiLang(isArabic ? 'en' : 'ar')}>
              {text.langButton}
            </button>
          </div>
          <h1>{text.signInTitle}</h1>
          <p className="auth-copy">{text.signInCopy}</p>
          <form className="auth-form" onSubmit={login}>
            <label>
              {text.serverAddress}
              <input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} />
            </label>
            <label>
              {text.email}
              <input
                type="email"
                value={loginValues.email}
                onChange={(event) => setLoginValues((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>
            <label>
              {text.password}
              <span className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginValues.password}
                  onChange={(event) => setLoginValues((current) => ({ ...current, password: event.target.value }))}
                  required
                />
                <button type="button" className="icon-button" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            {error && <div className="alert error">{error}</div>}
            <button className="primary-action" type="submit" disabled={busy}>
              <ShieldCheck size={18} />
              {busy ? text.signingIn : text.signIn}
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell" dir={isArabic ? 'rtl' : 'ltr'}>
      <aside className={`sidebar ${drawerOpen ? 'open' : ''}`}>
        <div className="sidebar-head">
          <div className="brand-mark">B61</div>
          <div>
            <p className="eyebrow">{text.brand}</p>
            <strong>{text.backOffice}</strong>
          </div>
          <button className="icon-button mobile-only" type="button" onClick={() => setDrawerOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <NavGroup
          title={text.manage}
          items={adminResources}
          text={text}
          resourceTitle={resourceTitle}
          activeKey={activeKey}
          onSelect={(key) => {
            setActiveKey(key)
            setQuery('')
            setDrawerOpen(false)
          }}
        />
        <div className="sidebar-foot">
          <div className="admin-chip">
            <ShieldCheck size={16} />
            <span>{admin?.full_name || admin?.email || 'Admin'}</span>
          </div>
          <button className="ghost-action" type="button" onClick={logout} disabled={busy}>
            <LogOut size={17} />
            {text.logout}
          </button>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="icon-button mobile-only" type="button" onClick={() => setDrawerOpen(true)}>
            <MenuIcon size={20} />
          </button>
          <div>
            <p className="eyebrow">{text.backOffice}</p>
            <h1>{resourceTitle(activeConfig.key)}</h1>
          </div>
          <div className="topbar-actions">
            <button className="ghost-action" type="button" onClick={() => setUiLang(isArabic ? 'en' : 'ar')}>
              {text.langButton}
            </button>
            <button
              className="ghost-action"
              type="button"
              onClick={loadAll}
              disabled={loading}
            >
              <RefreshCw size={17} />
              {text.sync}
            </button>
            <button className="primary-action" type="button" onClick={openCreate}>
              <Plus size={18} />
              {text.add}
            </button>
          </div>
        </header>

        {(error || notice) && (
          <div className={`alert ${error ? 'error' : 'success'}`}>
            {error || notice}
            <button type="button" onClick={() => (error ? setError('') : setNotice(''))}>
              <X size={16} />
            </button>
          </div>
        )}

        <section className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <article className="stat-card" key={stat.label}>
                <Icon size={20} />
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </article>
            )
          })}
        </section>

        <section className="resource-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{resourceDescription(activeConfig.key)}</p>
              <h2>{activeRecords.length} {text.items}</h2>
            </div>
            <label className="search-box">
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.search} />
            </label>
          </div>
          <ResourceTable
            columns={activeConfig.columns}
            records={activeRecords}
            loading={loading}
            text={text}
            lang={uiLang}
            onEdit={openEdit}
            onDelete={deleteRecord}
          />
        </section>
      </section>

      {formOpen && (
        <FormDrawer
          resource={activeAdminResource}
          values={formValues}
          records={records}
          text={text}
          resourceTitle={resourceTitle}
          editing={editing}
          busy={busy}
          onClose={() => setFormOpen(false)}
          onSubmit={saveRecord}
          onChange={(name, value) => setFormValues((current) => ({ ...current, [name]: value }))}
        />
      )}
    </main>
  )
}

function NavGroup({ title, items, activeKey, onSelect, resourceTitle }) {
  return (
    <div className="nav-section">
      <p className="eyebrow">{title}</p>
      <nav className="nav-list">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              className={item.key === activeKey ? 'active' : ''}
              type="button"
              onClick={() => onSelect(item.key)}
            >
              <Icon size={18} />
              <span>{resourceTitle(item.key)}</span>
              <ChevronRight size={16} />
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function ResourceTable({ columns, records, loading, readOnly, onEdit, onDelete, text, lang }) {
  if (loading) return <div className="empty-state">{text.loading}</div>
  if (!records.length) return <div className="empty-state">{text.noItems}</div>
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{text.columns[column] || column.replaceAll('_', ' ')}</th>
            ))}
            {!readOnly && <th>{text.actions}</th>}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id || record.order_number || `${record.name || record.reason}-${index}`}>
              {columns.map((column) => (
                <td key={column} data-label={text.columns[column] || column.replaceAll('_', ' ')}>
                  {renderCell(record, column, lang, text)}
                </td>
              ))}
              {!readOnly && (
                <td className="row-actions">
                  <button className="icon-button" type="button" onClick={() => onEdit(record)} title="Edit">
                    <Edit3 size={16} />
                  </button>
                  <button className="icon-button danger" type="button" onClick={() => onDelete(record)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderCell(record, column, lang, text) {
  const value = record[column]
  if (column === 'category') return formatValue(record.category, column, lang)
  if (column === 'item') return formatValue(record.item || record.menu_item, column, lang)
  if (column === 'group') return formatValue(record.group || record.option_group, column, lang)
  if (column === 'loyalty_tier') return formatValue(record.loyalty_tier, column, lang)
  if (column === 'current_tier') return formatValue(record.current_tier, column, lang)
  if (column === 'next_tier') return formatValue(record.next_tier, column, lang)
  if (column === 'earning_rate') return `${record.earning_rate?.points_per_syp || '-'} SYP / point`
  if (typeof value === 'boolean') return <span className={`status ${value ? 'on' : 'off'}`}>{value ? text.active : text.off}</span>
  return formatValue(value, column, lang)
}

function FormDrawer({ resource, values, records, editing, busy, onClose, onSubmit, onChange, text, resourceTitle }) {
  return (
    <div className="drawer-backdrop">
      <aside className="form-drawer">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">{editing ? text.editItem : text.addItem}</p>
            <h2>{resourceTitle(resource.key)}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form className="record-form" onSubmit={onSubmit}>
          {resource.form.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={values[field.name]}
              records={records}
              text={text}
              onChange={(value) => onChange(field.name, value)}
            />
          ))}
          <div className="drawer-actions">
            <button className="ghost-action" type="button" onClick={onClose}>
              {text.cancel}
            </button>
            <button className="primary-action" type="submit" disabled={busy}>
              <Save size={17} />
              {busy ? text.saving : text.save}
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}

function FormField({ field, value, records, onChange, text }) {
  const linked = field.source ? records[field.source] || [] : []
  const id = `field-${field.name}`
  if (field.type === 'boolean') {
    return (
      <label className="switch-row" htmlFor={id}>
        <span>{text.fields[field.name] || field.label}</span>
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
      </label>
    )
  }
  if (field.type === 'textarea') {
    return (
      <label>
        {text.fields[field.name] || field.label}
        <textarea id={id} value={value || ''} onChange={(event) => onChange(event.target.value)} required={field.required} />
      </label>
    )
  }
  if (field.type === 'select') {
    return (
      <label>
        {text.fields[field.name] || field.label}
        <select id={id} value={value || ''} onChange={(event) => onChange(event.target.value)} required={field.required}>
          <option value="">{text.select} {text.fields[field.name] || field.label}</option>
          {linked.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name_en || item.label_en || item.name || item.title || item.id}
            </option>
          ))}
        </select>
      </label>
    )
  }
  if (field.type === 'enum') {
    return (
      <label>
        {text.fields[field.name] || field.label}
        <select id={id} value={value || ''} onChange={(event) => onChange(event.target.value)} required={field.required}>
          <option value="">{text.select} {text.fields[field.name] || field.label}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    )
  }
  return (
    <label>
      {text.fields[field.name] || field.label}
      <input
        id={id}
        type={field.type || 'text'}
        step={field.step}
        value={value || ''}
        onChange={(event) => {
          const nextValue = field.type === 'number' && event.target.value !== '' ? event.target.valueAsNumber : event.target.value
          onChange(nextValue)
        }}
        required={field.required}
      />
    </label>
  )
}

export default App
