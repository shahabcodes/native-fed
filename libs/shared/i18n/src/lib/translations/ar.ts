export const AR_TRANSLATIONS = {
  common: {
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    search: 'بحث',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    submit: 'إرسال',
    reset: 'إعادة تعيين',
    close: 'إغلاق',
    yes: 'نعم',
    no: 'لا',
    all: 'الكل',
    actions: 'الإجراءات',
    status: 'الحالة',
    date: 'التاريخ',
    time: 'الوقت',
    description: 'الوصف',
    details: 'التفاصيل',
    name: 'الاسم',
    type: 'النوع',
    welcome: 'مرحباً',
    clearSearch: 'مسح البحث',
    retry: 'حاول مرة أخرى'
  },
  auth: {
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    signUp: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    signInTitle: 'مرحباً بعودتك',
    signInSubtitle: 'سجل الدخول للمتابعة إلى حسابك',
    logout: 'تسجيل الخروج'
  },
  dashboard: {
    title: 'لوحة التحكم',
    subtitle: 'نظرة عامة على أنشطة التفتيش',
    totalInspections: 'إجمالي التفتيشات',
    pendingReview: 'في انتظار المراجعة',
    completedToday: 'المكتملة اليوم',
    recentActivity: 'النشاط الأخير',
    quickActions: 'إجراءات سريعة',
    viewAll: 'عرض الكل'
  },
  inspection: {
    title: 'التفتيشات',
    subtitle: 'إدارة وتتبع جميع التفتيشات',
    newInspection: 'تفتيش جديد',
    newInspectionInfo: 'نموذج التفتيش الجديد سيكون متاحاً قريباً',
    inspectionDetails: 'تفاصيل التفتيش',
    inspector: 'المفتش',
    location: 'الموقع',
    scheduledDate: 'التاريخ المجدول',
    completedDate: 'تاريخ الإكمال',
    findings: 'النتائج',
    recommendations: 'التوصيات',
    attachments: 'المرفقات',
    statusPending: 'قيد الانتظار',
    statusInProgress: 'قيد التنفيذ',
    statusCompleted: 'مكتمل',
    statusCancelled: 'ملغي',
    priority: 'الأولوية',
    priorityLow: 'منخفضة',
    priorityMedium: 'متوسطة',
    priorityHigh: 'عالية',
    priorityCritical: 'حرجة',
    loading: 'جاري تحميل التفتيشات...',
    viewAll: 'عرض جميع التفتيشات',
    filters: {
      all: 'الكل',
      pending: 'قيد الانتظار',
      inProgress: 'قيد التنفيذ',
      completed: 'مكتمل'
    },
    titles: {
      pending: 'التفتيشات قيد الانتظار',
      inProgress: 'التفتيشات قيد التنفيذ',
      completed: 'التفتيشات المكتملة'
    },
    subtitles: {
      pending: 'التفتيشات التي تنتظر البدء',
      inProgress: 'التفتيشات الجاري العمل عليها',
      completed: 'التفتيشات المنتهية'
    },
    empty: {
      allTitle: 'لا توجد تفتيشات',
      allMessage: 'حاول تعديل البحث',
      pendingTitle: 'لا توجد تفتيشات قيد الانتظار',
      pendingMessage: 'جميع التفتيشات قد بدأت أو اكتملت',
      inProgressTitle: 'لا توجد تفتيشات قيد التنفيذ',
      inProgressMessage: 'لا توجد تفتيشات يتم العمل عليها حالياً',
      completedTitle: 'لا توجد تفتيشات مكتملة',
      completedMessage: 'لم يتم إكمال أي تفتيش بعد'
    },
    errors: {
      loadFailed: 'فشل تحميل التفتيشات. يرجى المحاولة مرة أخرى.'
    }
  },
  errors: {
    required: 'هذا الحقل مطلوب',
    email: 'يرجى إدخال بريد إلكتروني صحيح',
    minLength: 'الحد الأدنى {{min}} حرف مطلوب',
    maxLength: 'الحد الأقصى {{max}} حرف مسموح',
    generic: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    notFound: 'المورد غير موجود',
    unauthorized: 'غير مصرح لك بتنفيذ هذا الإجراء',
    networkError: 'خطأ في الشبكة. يرجى التحقق من الاتصال.',
    sessionExpired: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.',
    forbidden: 'ليس لديك صلاحية لتنفيذ هذا الإجراء.',
    serverError: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
    moduleLoadFailed: 'فشل تحميل جزء من التطبيق. يرجى تحديث الصفحة.'
  },
  navigation: {
    dashboard: 'لوحة التحكم',
    inspections: 'التفتيشات',
    reports: 'التقارير',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    help: 'المساعدة'
  },
  notifications: {
    success: 'نجاح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات'
  }
};
