import { cookies } from "next/headers";

export const LOCALES = ["ary", "ar", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "locale";

export const LOCALE_META: Record<
  Locale,
  { label: string; dir: "rtl" | "ltr"; htmlLang: string; intl: string }
> = {
  ary: { label: "الدارجة", dir: "rtl", htmlLang: "ar-MA", intl: "ar-MA" },
  ar: { label: "العربية", dir: "rtl", htmlLang: "ar", intl: "ar" },
  fr: { label: "Français", dir: "ltr", htmlLang: "fr", intl: "fr-FR" },
};

const fr = {
  nav: {
    dashboard: "Tableau de bord",
    pipeline: "Pipeline",
    contacts: "Contacts",
    inbox: "Messages",
  },
  common: {
    add: "Ajouter",
    save: "Enregistrer",
    cancel: "Annuler",
    search: "Rechercher",
    signOut: "Se déconnecter",
    language: "Langue",
    none: "—",
    noOwner: "Non assigné",
  },
  auth: {
    tagline: "Toutes vos conversations WhatsApp et vos ventes, au même endroit.",
    signInTitle: "Connexion",
    signUpTitle: "Créer un compte",
    email: "E-mail",
    password: "Mot de passe",
    signIn: "Se connecter",
    signUp: "Créer mon compte",
    toSignUp: "Pas encore de compte ? Créez-en un",
    toSignIn: "Déjà un compte ? Connectez-vous",
    checkEmail: "Compte créé. Ouvrez le lien envoyé par e-mail pour confirmer, puis connectez-vous.",
    invalid: "E-mail ou mot de passe incorrect.",
    passwordShort: "Le mot de passe doit contenir au moins 8 caractères.",
    generic: "Une erreur est survenue. Réessayez dans un instant.",
  },
  onboarding: {
    title: "Créez l’espace de votre entreprise",
    help: "Vous pourrez inviter votre équipe ensuite. Le pipeline de départ est prêt à l’emploi.",
    companyName: "Nom de l’entreprise",
    submit: "Créer l’espace",
    error: "Impossible de créer l’espace. Vérifiez le nom et réessayez.",
  },
  dashboard: {
    title: "Tableau de bord",
    byStage: "Affaires par étape",
    forecast: "Montant en cours",
    overdue: "Relances en retard",
    overdueEmpty: "Aucune relance en retard.",
    overdueHelp: "Affaires sans activité depuis {days} jours ou plus.",
    deals: "affaires",
    daysShort: "j",
    noDeals: "Aucune affaire pour l’instant. Ajoutez la première dans le pipeline.",
  },
  pipeline: {
    title: "Pipeline",
    newDeal: "Nouvelle affaire",
    dealTitle: "Titre de l’affaire",
    amount: "Montant",
    contact: "Contact",
    stage: "Étape",
    moveTo: "Déplacer vers",
    empty: "Aucune affaire à cette étape.",
    noContact: "Sans contact",
    createError: "Impossible d’ajouter l’affaire.",
    moveError: "Impossible de déplacer l’affaire.",
  },
  contacts: {
    title: "Contacts",
    newContact: "Nouveau contact",
    fullName: "Nom complet",
    alias: "Autre écriture du nom (optionnel)",
    aliasHelp: "Par exemple le nom en lettres arabes ou latines, pour le retrouver avec les deux.",
    phone: "Téléphone",
    phoneHelp: "Format 06 12 34 56 78 ou +33 6 12 34 56 78",
    email: "E-mail",
    searchPlaceholder: "Nom, téléphone ou e-mail",
    empty: "Aucun contact. Ajoutez-en un, ou attendez le premier message WhatsApp.",
    noResults: "Aucun contact ne correspond à votre recherche.",
    createError: "Impossible d’ajouter le contact. Le numéro existe peut-être déjà.",
    invalidPhone: "Numéro de téléphone invalide.",
  },
  inbox: {
    title: "Messages",
    empty: "Aucune conversation. Les messages WhatsApp apparaîtront ici dès que le numéro sera connecté.",
    pick: "Choisissez une conversation.",
    inbound: "Reçu",
    outbound: "Envoyé",
    back: "Retour aux conversations",
    readOnly: "L’envoi de messages sera disponible après la connexion de WhatsApp Business.",
    noMessages: "Aucun message.",
  },
};

export type Dict = typeof fr;

const ar: Dict = {
  nav: {
    dashboard: "لوحة المتابعة",
    pipeline: "مراحل الصفقات",
    contacts: "جهات الاتصال",
    inbox: "الرسائل",
  },
  common: {
    add: "إضافة",
    save: "حفظ",
    cancel: "إلغاء",
    search: "بحث",
    signOut: "تسجيل الخروج",
    language: "اللغة",
    none: "—",
    noOwner: "غير مسند",
  },
  auth: {
    tagline: "كل محادثات واتساب ومبيعاتك في مكان واحد.",
    signInTitle: "تسجيل الدخول",
    signUpTitle: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "دخول",
    signUp: "إنشاء الحساب",
    toSignUp: "ليس لديك حساب؟ أنشئ حساباً",
    toSignIn: "لديك حساب؟ سجّل الدخول",
    checkEmail: "تم إنشاء الحساب. افتح الرابط المرسل إلى بريدك للتأكيد ثم سجّل الدخول.",
    invalid: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    passwordShort: "يجب ألا تقل كلمة المرور عن 8 أحرف.",
    generic: "حدث خطأ. حاول مرة أخرى بعد قليل.",
  },
  onboarding: {
    title: "أنشئ مساحة شركتك",
    help: "يمكنك دعوة فريقك لاحقاً. مراحل الصفقات الأولية جاهزة للاستخدام.",
    companyName: "اسم الشركة",
    submit: "إنشاء المساحة",
    error: "تعذّر إنشاء المساحة. تحقق من الاسم وحاول مجدداً.",
  },
  dashboard: {
    title: "لوحة المتابعة",
    byStage: "الصفقات حسب المرحلة",
    forecast: "المبلغ الجاري",
    overdue: "متابعات متأخرة",
    overdueEmpty: "لا توجد متابعات متأخرة.",
    overdueHelp: "صفقات بلا أي نشاط منذ {days} أيام أو أكثر.",
    deals: "صفقات",
    daysShort: "يوم",
    noDeals: "لا توجد صفقات بعد. أضف أول صفقة من صفحة المراحل.",
  },
  pipeline: {
    title: "مراحل الصفقات",
    newDeal: "صفقة جديدة",
    dealTitle: "عنوان الصفقة",
    amount: "المبلغ",
    contact: "جهة الاتصال",
    stage: "المرحلة",
    moveTo: "نقل إلى",
    empty: "لا توجد صفقات في هذه المرحلة.",
    noContact: "بدون جهة اتصال",
    createError: "تعذّرت إضافة الصفقة.",
    moveError: "تعذّر نقل الصفقة.",
  },
  contacts: {
    title: "جهات الاتصال",
    newContact: "جهة اتصال جديدة",
    fullName: "الاسم الكامل",
    alias: "كتابة أخرى للاسم (اختياري)",
    aliasHelp: "مثلاً الاسم بالحروف العربية أو اللاتينية، لتجده بالكتابتين.",
    phone: "الهاتف",
    phoneHelp: "بالشكل 06 12 34 56 78 أو +33 6 12 34 56 78",
    email: "البريد الإلكتروني",
    searchPlaceholder: "الاسم أو الهاتف أو البريد",
    empty: "لا توجد جهات اتصال. أضف واحدة، أو انتظر أول رسالة واتساب.",
    noResults: "لا توجد جهة اتصال تطابق بحثك.",
    createError: "تعذّرت إضافة جهة الاتصال. ربما الرقم موجود مسبقاً.",
    invalidPhone: "رقم الهاتف غير صالح.",
  },
  inbox: {
    title: "الرسائل",
    empty: "لا توجد محادثات. ستظهر رسائل واتساب هنا بمجرد ربط الرقم.",
    pick: "اختر محادثة.",
    inbound: "واردة",
    outbound: "صادرة",
    back: "العودة إلى المحادثات",
    readOnly: "إرسال الرسائل سيتوفر بعد ربط واتساب للأعمال.",
    noMessages: "لا توجد رسائل.",
  },
};

const ary: Dict = {
  nav: {
    dashboard: "لوحة التتبع",
    pipeline: "الصفقات",
    contacts: "الكليان",
    inbox: "الرسائل",
  },
  common: {
    add: "زيد",
    save: "سجّل",
    cancel: "إلغاء",
    search: "قلّب",
    signOut: "خرج",
    language: "اللغة",
    none: "—",
    noOwner: "ما مسند لحد",
  },
  auth: {
    tagline: "كل محادثات واتساب ديالك والمبيعات فبلاصة وحدة.",
    signInTitle: "الدخول",
    signUpTitle: "سجّل حساب جديد",
    email: "الإيميل",
    password: "كلمة السر",
    signIn: "دخل",
    signUp: "صاوب الحساب",
    toSignUp: "ما عندكش حساب؟ صاوب واحد",
    toSignIn: "عندك حساب؟ دخل",
    checkEmail: "تصاوب الحساب. حل الرابط اللي جاك فالإيميل باش تأكد، من بعد دخل.",
    invalid: "الإيميل ولا كلمة السر ماشي صحاح.",
    passwordShort: "كلمة السر خاصها تكون 8 حروف على الأقل.",
    generic: "وقع مشكل. عاود من بعد شوية.",
  },
  onboarding: {
    title: "صاوب البلاصة ديال الشركة ديالك",
    help: "من بعد تقدر تعيط للفريق ديالك. المراحل الأولى واجدين.",
    companyName: "سمية الشركة",
    submit: "صاوب البلاصة",
    error: "ما قدرناش نصاوبو البلاصة. شوف السمية وعاود.",
  },
  dashboard: {
    title: "لوحة التتبع",
    byStage: "الصفقات على حسب المرحلة",
    forecast: "الفلوس اللي جارية",
    overdue: "متابعات تأخرات",
    overdueEmpty: "ما كاين حتى متابعة متأخرة.",
    overdueHelp: "صفقات ما وقع فيها والو من {days} أيام ولا كثر.",
    deals: "صفقات",
    daysShort: "يوم",
    noDeals: "باقي ما كاينش صفقات. زيد أول وحدة من صفحة الصفقات.",
  },
  pipeline: {
    title: "الصفقات",
    newDeal: "صفقة جديدة",
    dealTitle: "عنوان الصفقة",
    amount: "المبلغ",
    contact: "الكليان",
    stage: "المرحلة",
    moveTo: "نقل ل",
    empty: "ما كاينش صفقات فهاد المرحلة.",
    noContact: "بلا كليان",
    createError: "ما قدرناش نزيدو الصفقة.",
    moveError: "ما قدرناش ننقلو الصفقة.",
  },
  contacts: {
    title: "الكليان",
    newContact: "كليان جديد",
    fullName: "الاسم الكامل",
    alias: "كتابة أخرى للسمية (اختياري)",
    aliasHelp: "بحال السمية بالحروف العربية ولا اللاتينية، باش تلقاه بجوج.",
    phone: "التيليفون",
    phoneHelp: "بحال 06 12 34 56 78 ولا +33 6 12 34 56 78",
    email: "الإيميل",
    searchPlaceholder: "الاسم، التيليفون ولا الإيميل",
    empty: "ما كاين حتى كليان. زيد واحد، ولا تسنى أول ميساج فواتساب.",
    noResults: "ما كاين حتى كليان كيوافق البحث ديالك.",
    createError: "ما قدرناش نزيدو الكليان. يمكن النمرة كاينة من قبل.",
    invalidPhone: "نمرة التيليفون ماشي صحيحة.",
  },
  inbox: {
    title: "الرسائل",
    empty: "ما كاينة حتى محادثة. ميساجات واتساب غادي يبانو هنا من ما تربط النمرة.",
    pick: "اختار محادثة.",
    inbound: "جاية",
    outbound: "مرسولة",
    back: "رجع للمحادثات",
    readOnly: "الإرسال غادي يتفعل من بعد ما تربط واتساب للأعمال.",
    noMessages: "ما كاين حتى ميساج.",
  },
};

const dictionaries: Record<Locale, Dict> = { ary, ar, fr };

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}
