import { useState, useEffect } from 'react';
import { supabase, SiteContent } from '../../lib/supabase';
import { Save, Check, AlertCircle, ChevronDown } from 'lucide-react';

const SECTION_GROUPS: { id: string; label: string }[] = [
  { id: 'header', label: 'الهيدر / العلامة التجارية' },
  { id: 'home_hero', label: 'الرئيسية - البانر الرئيسي' },
  { id: 'home_mission', label: 'الرئيسية - المهمة والرؤية' },
  { id: 'home_how_it_works', label: 'الرئيسية - كيف يعمل' },
  { id: 'home_cta', label: 'الرئيسية - دعوة للعمل' },
  { id: 'about_hero', label: 'من نحن - العنوان' },
  { id: 'about_story', label: 'من نحن - قصتنا' },
  { id: 'about_services', label: 'من نحن - خدماتنا' },
  { id: 'about_values', label: 'من نحن - قيمنا' },
  { id: 'about_impact', label: 'من نحن - تأثيرنا' },
  { id: 'activities', label: 'الأنشطة' },
  { id: 'contact_info', label: 'اتصل بنا - معلومات التواصل' },
  { id: 'contact_services', label: 'اتصل بنا - الخدمات' },
  { id: 'donate_channels', label: 'التبرع - القنوات' },
  { id: 'volunteer_areas', label: 'التطوع - المجالات' },
  { id: 'footer', label: 'الفوتر' },
  { id: 'social_links', label: 'روابط التواصل الاجتماعي' },
  { id: 'privacy', label: 'سياسة الخصوصية' },
];

const FIELD_LABELS: Record<string, string> = {
  'nav.logo_url': 'رابط الشعار',
  'brand.name': 'اسم الجمعية',
  'brand.tagline': 'الشعار النصي',
  'brand.description': 'وصف الجمعية',
  'home.title': 'العنوان الرئيسي',
  'home.titleHighlight': 'النص المميز',
  'home.subtitle': 'العنوان الفرعي',
  'home.registrationInfo': 'معلومات التسجيل',
  'home.needHelp': 'زر أحتاج مساعدة',
  'home.mission': 'عنوان المهمة',
  'home.missionDesc': 'وصف المهمة',
  'home.vision': 'عنوان الرؤية',
  'home.visionDesc': 'وصف الرؤية',
  'home.goal': 'عنوان الهدف',
  'home.goalDesc': 'وصف الهدف',
  'home.values': 'عنوان القيم',
  'home.valuesDesc': 'وصف القيم',
  'home.howItWorks': 'عنوان كيف يعمل',
  'home.howItWorksDesc': 'وصف كيف يعمل',
  'home.step1Title': 'الخطوة ١ - العنوان',
  'home.step1Desc': 'الخطوة ١ - الوصف',
  'home.step2Title': 'الخطوة ٢ - العنوان',
  'home.step2Desc': 'الخطوة ٢ - الوصف',
  'home.step3Title': 'الخطوة ٣ - العنوان',
  'home.step3Desc': 'الخطوة ٣ - الوصف',
  'home.ctaTitle': 'عنوان دعوة العمل',
  'home.ctaDesc': 'وصف دعوة العمل',
  'home.getStarted': 'نص زر ابدأ',
  'about.title': 'عنوان الصفحة',
  'about.subtitle': 'العنوان الفرعي',
  'about.ourStory': 'عنوان قصتنا',
  'about.ourStoryDesc': 'وصف قصتنا',
  'about.peopleHelped': 'نص الأشخاص المساعدين',
  'about.activeVolunteers': 'نص المتطوعين',
  'about.citiesReached': 'نص المدن',
  'about.satisfactionRate': 'نص معدل الرضا',
  'about.whatWeDo': 'عنوان ما نفعله',
  'about.whatWeDoDesc': 'وصف ما نفعله',
  'about.medicineAssistance': 'المساعدة في الأدوية',
  'about.medicineAssistanceDesc': 'وصف المساعدة في الأدوية',
  'about.elderlySupport': 'دعم كبار السن',
  'about.elderlySupportDesc': 'وصف دعم كبار السن',
  'about.communityNetwork': 'شبكة المجتمع',
  'about.communityNetworkDesc': 'وصف شبكة المجتمع',
  'about.ourValues': 'عنوان قيمنا',
  'about.ourValuesDesc': 'وصف قيمنا',
  'about.compassion': 'التعاطف',
  'about.compassionDesc': 'وصف التعاطف',
  'about.integrity': 'النزاهة',
  'about.integrityDesc': 'وصف النزاهة',
  'about.community': 'المجتمع',
  'about.communityDesc': 'وصف المجتمع',
  'about.excellence': 'التميز',
  'about.excellenceDesc': 'وصف التميز',
  'about.impactGrows': 'عنوان تأثيرنا',
  'about.impactGrowsDesc': 'وصف تأثيرنا',
  'activities.title': 'عنوان الصفحة',
  'activities.subtitle': 'العنوان الفرعي',
  'activities.activity1Title': 'النشاط ١ - العنوان',
  'activities.activity1Desc': 'النشاط ١ - الوصف',
  'activities.activity2Title': 'النشاط ٢ - العنوان',
  'activities.activity2Desc': 'النشاط ٢ - الوصف',
  'activities.activity3Title': 'النشاط ٣ - العنوان',
  'activities.activity3Desc': 'النشاط ٣ - الوصف',
  'activities.activity4Title': 'النشاط ٤ - العنوان',
  'activities.activity4Desc': 'النشاط ٤ - الوصف',
  'activities.activity5Title': 'النشاط ٥ - العنوان',
  'activities.activity5Desc': 'النشاط ٥ - الوصف',
  'activities.activity6Title': 'النشاط ٦ - العنوان',
  'activities.activity6Desc': 'النشاط ٦ - الوصف',
  'activities.activity7Title': 'النشاط ٧ - العنوان',
  'activities.activity7Desc': 'النشاط ٧ - الوصف',
  'activities.activity8Title': 'النشاط ٨ - العنوان',
  'activities.activity8Desc': 'النشاط ٨ - الوصف',
  'activities.activity9Title': 'النشاط ٩ - العنوان',
  'activities.activity9Desc': 'النشاط ٩ - الوصف',
  'activities.activity10Title': 'النشاط ١٠ - العنوان',
  'activities.activity10Desc': 'النشاط ١٠ - الوصف',
  'contact.title': 'عنوان الصفحة',
  'contact.subtitle': 'العنوان الفرعي',
  'contact.headOfficeAddress': 'عنوان المقر',
  'contact.phone': 'رقم الهاتف',
  'contact.email': 'البريد الإلكتروني',
  'contact.workingHoursValue': 'ساعات العمل',
  'contact.service1Title': 'الخدمة ١ - العنوان',
  'contact.service1Desc': 'الخدمة ١ - الوصف',
  'contact.service2Title': 'الخدمة ٢ - العنوان',
  'contact.service2Desc': 'الخدمة ٢ - الوصف',
  'contact.service3Title': 'الخدمة ٣ - العنوان',
  'contact.service3Desc': 'الخدمة ٣ - الوصف',
  'contact.service4Title': 'الخدمة ٤ - العنوان',
  'contact.service4Desc': 'الخدمة ٤ - الوصف',
  'contact.closingMessage': 'رسالة الختام',
  'donate.title': 'عنوان الصفحة',
  'donate.subtitle': 'العنوان الفرعي',
  'donate.bankAccountNumber': 'رقم الحساب البنكي',
  'donate.bankName': 'اسم البنك',
  'donate.beneficiaryNameValue': 'اسم المستفيد',
  'volunteer.title': 'عنوان الصفحة',
  'volunteer.desc': 'وصف الصفحة',
  'volunteer.area1Title': 'المجال ١ - العنوان',
  'volunteer.area1Desc': 'المجال ١ - الوصف',
  'volunteer.area2Title': 'المجال ٢ - العنوان',
  'volunteer.area2Desc': 'المجال ٢ - الوصف',
  'volunteer.area3Title': 'المجال ٣ - العنوان',
  'volunteer.area3Desc': 'المجال ٣ - الوصف',
  'volunteer.area4Title': 'المجال ٤ - العنوان',
  'volunteer.area4Desc': 'المجال ٤ - الوصف',
  'footer.description': 'وصف الفوتر',
  'footer.address': 'العنوان',
  'footer.email': 'البريد الإلكتروني',
  'footer.phone': 'رقم الهاتف',
  'social.facebook': 'رابط فيسبوك',
  'social.instagram': 'رابط انستجرام',
  'social.linkedin': 'رابط لينكد إن',
  'privacy.title': 'عنوان الصفحة',
  'privacy.subtitle': 'العنوان الفرعي',
  'privacy.section1Title': 'القسم ١ - العنوان',
  'privacy.section2Title': 'القسم ٢ - العنوان',
  'privacy.section3Title': 'القسم ٣ - العنوان',
};

interface Props {
  onRefresh: () => void;
}

export function SiteContentTab({ onRefresh }: Props) {
  const [allContent, setAllContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState('header');
  const [editedFields, setEditedFields] = useState<Record<string, { content_ar: string; content_en: string }>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mobileGroupOpen, setMobileGroupOpen] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section_key');

      if (error) throw error;
      setAllContent((data || []) as SiteContent[]);
    } finally {
      setLoading(false);
    }
  };

  const groupContent = allContent.filter((c) => c.section_group === activeGroup);

  const getFieldValue = (key: string, field: 'content_ar' | 'content_en') => {
    if (editedFields[key]) return editedFields[key][field];
    const item = allContent.find((c) => c.section_key === key);
    return item ? item[field] : '';
  };

  const handleFieldChange = (key: string, field: 'content_ar' | 'content_en', value: string) => {
    const item = allContent.find((c) => c.section_key === key);
    const current = editedFields[key] || {
      content_ar: item?.content_ar || '',
      content_en: item?.content_en || '',
    };
    setEditedFields({
      ...editedFields,
      [key]: { ...current, [field]: value },
    });
  };

  const hasChanges = Object.keys(editedFields).length > 0;

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    setSaveStatus('idle');

    try {
      const updates = Object.entries(editedFields).map(([key, values]) => {
        const item = allContent.find((c) => c.section_key === key);
        if (!item) return Promise.resolve({ data: null, error: new Error(`Item not found: ${key}`) });
        return supabase
          .from('site_content')
          .update({
            content_ar: values.content_ar,
            content_en: values.content_en,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);
      });

      const results = await Promise.all(updates);
      const hasError = results.some((r) => r.error);

      if (hasError) {
        setSaveStatus('error');
      } else {
        setSaveStatus('success');
        setEditedFields({});
        await fetchContent();
        onRefresh();
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const isLongText = (key: string) => {
    return key.includes('Desc') || key.includes('desc') || key.includes('subtitle') || key.includes('Subtitle') ||
      key.includes('registrationInfo') || key.includes('closingMessage') || key.includes('ourStoryDesc') ||
      key.includes('Content') || key.includes('description');
  };

  const isUrl = (item: SiteContent) => item.content_type === 'url' || item.content_type === 'image';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeGroupLabel = SECTION_GROUPS.find((g) => g.id === activeGroup)?.label || '';

  return (
    <div>
      {/* Save status bar */}
      {saveStatus === 'success' && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm">
          <Check className="w-4 h-4" />
          تم حفظ التغييرات بنجاح
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="w-4 h-4" />
          حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section selector - Desktop sidebar */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
              أقسام الموقع
            </h3>
            {SECTION_GROUPS.map((group) => {
              const groupItemCount = allContent.filter((c) => c.section_group === group.id).length;
              return (
                <button
                  key={group.id}
                  onClick={() => {
                    setActiveGroup(group.id);
                    setEditedFields({});
                    setSaveStatus('idle');
                  }}
                  className={`w-full text-right px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    activeGroup === group.id
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className="text-xs text-gray-400 dark:text-gray-500">{groupItemCount}</span>
                  <span>{group.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section selector - Mobile dropdown */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileGroupOpen(!mobileGroupOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileGroupOpen ? 'rotate-180' : ''}`} />
            <span>{activeGroupLabel}</span>
          </button>
          {mobileGroupOpen && (
            <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-64 overflow-y-auto">
              {SECTION_GROUPS.map((group) => (
                <button
                  key={group.id}
                  onClick={() => {
                    setActiveGroup(group.id);
                    setEditedFields({});
                    setSaveStatus('idle');
                    setMobileGroupOpen(false);
                  }}
                  className={`w-full text-right px-4 py-2.5 text-sm transition-colors ${
                    activeGroup === group.id
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content editor */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{activeGroupLabel}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{groupContent.length} حقل</p>
            </div>
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
              </button>
            )}
          </div>

          {groupContent.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <p>لا توجد حقول في هذا القسم</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupContent.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isUrl(item) && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                          {item.content_type}
                        </span>
                      )}
                      {item.updated_at && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          آخر تحديث: {new Date(item.updated_at).toLocaleDateString('ar-EG')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {FIELD_LABELS[item.section_key] || item.section_key}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Arabic field */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                        عربي
                      </label>
                      {isLongText(item.section_key) ? (
                        <textarea
                          value={getFieldValue(item.section_key, 'content_ar')}
                          onChange={(e) => handleFieldChange(item.section_key, 'content_ar', e.target.value)}
                          rows={4}
                          dir="rtl"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
                        />
                      ) : (
                        <input
                          type={isUrl(item) ? 'url' : 'text'}
                          value={getFieldValue(item.section_key, 'content_ar')}
                          onChange={(e) => handleFieldChange(item.section_key, 'content_ar', e.target.value)}
                          dir={isUrl(item) ? 'ltr' : 'rtl'}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      )}
                    </div>

                    {/* English field */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                        English
                      </label>
                      {isLongText(item.section_key) ? (
                        <textarea
                          value={getFieldValue(item.section_key, 'content_en')}
                          onChange={(e) => handleFieldChange(item.section_key, 'content_en', e.target.value)}
                          rows={4}
                          dir="ltr"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
                        />
                      ) : (
                        <input
                          type={isUrl(item) ? 'url' : 'text'}
                          value={getFieldValue(item.section_key, 'content_en')}
                          onChange={(e) => handleFieldChange(item.section_key, 'content_en', e.target.value)}
                          dir="ltr"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Floating save button for mobile */}
              {hasChanges && (
                <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
