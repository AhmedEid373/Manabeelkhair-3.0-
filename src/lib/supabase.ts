// ─────────────────────────────────────────────────────────────────────────────
// Local database — replaces Supabase entirely.
// All data is persisted in localStorage. No external services required.
// Admin credentials: admin@manabeaalkhair.org / Admin@2024
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────────────────────

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'donation' | 'volunteer' | 'inquiry' | 'partnership' | 'helper' | 'needer';
  message: string | null;
  location: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DonationRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  amount: string;
  donation_method: string;
  allocation: string | null;
  privacy_agreed: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes: string | null;
  created_at: string;
};

export type VolunteerRequest = {
  id: string;
  full_name: string;
  age: string;
  email: string;
  phone: string;
  region: string;
  skills: string;
  availability: string;
  volunteer_type: string;
  notes: string;
  terms_agreed: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes: string | null;
  created_at: string;
};

export type SiteContent = {
  id: string;
  section_key: string;
  content_ar: string;
  content_en: string;
  content_type: string;
  section_group: string;
  updated_at: string;
  updated_by: string | null;
};

type DbRow = Record<string, unknown>;

// ── Storage helpers ───────────────────────────────────────────────────────────

function getTable(name: string): DbRow[] {
  try {
    return JSON.parse(localStorage.getItem(`localdb_${name}`) || '[]');
  } catch {
    return [];
  }
}

function setTable(name: string, rows: DbRow[]) {
  localStorage.setItem(`localdb_${name}`, JSON.stringify(rows));
}

function uuid(): string {
  return crypto.randomUUID();
}

// ── Seed site_content on first load ──────────────────────────────────────────

function seedSiteContent() {
  if (localStorage.getItem('localdb_seeded')) return;

  const rows: DbRow[] = [
    // Header
    { section_key: 'nav.logo_url', content_ar: '/logo-new-disgin.png', content_en: '/logo-new-disgin.png', content_type: 'image', section_group: 'header' },
    { section_key: 'brand.name', content_ar: 'جمعية منابع الخير', content_en: 'Manabea Al-Khair Association', content_type: 'text', section_group: 'header' },
    { section_key: 'brand.tagline', content_ar: 'نصنع الخير ونجعل العطاء أسلوب حياة', content_en: 'Spreading Goodness, Making Giving a Way of Life', content_type: 'text', section_group: 'header' },
    { section_key: 'brand.description', content_ar: 'دعم كبار السن والذين لا يستطيعون تحمل تكاليف الأدوية من خلال التعاطف المجتمعي والجهود التطوعية', content_en: 'Supporting the elderly and those who cannot afford medication through community compassion and volunteer efforts', content_type: 'text', section_group: 'header' },
    // Home Hero
    { section_key: 'home.title', content_ar: 'جمعية منابع الخير', content_en: 'Manabea Al-Khair Association', content_type: 'text', section_group: 'home_hero' },
    { section_key: 'home.titleHighlight', content_ar: '', content_en: '', content_type: 'text', section_group: 'home_hero' },
    { section_key: 'home.subtitle', content_ar: 'نصنع الخير ونجعل العطاء أسلوب حياة', content_en: 'Spreading Goodness, Making Giving a Way of Life', content_type: 'text', section_group: 'home_hero' },
    { section_key: 'home.registrationInfo', content_ar: 'جمعية خيرية مشهرة برقم ٨٤٨٢ لسنة ٢٠١٠ بالقاهرة تعمل على تقديم خدمات اجتماعية وتنموية متكاملة لدعم الأسر الأكثر احتياجًا وتعزيز التكافل الاجتماعي وتحقيق أثر مستدام.', content_en: 'A charitable association registered under No. 8482 of 2010 in Cairo, providing integrated social and developmental services to support the most needy families, enhance social solidarity, and achieve sustainable impact.', content_type: 'text', section_group: 'home_hero' },
    { section_key: 'home.needHelp', content_ar: 'أحتاج مساعدة', content_en: 'I Need Help', content_type: 'text', section_group: 'home_hero' },
    // Home Mission
    { section_key: 'home.mission', content_ar: 'مهمتنا', content_en: 'Our Mission', content_type: 'text', section_group: 'home_mission' },
    { section_key: 'home.missionDesc', content_ar: 'بناء جسور بين من يريدون المساعدة ومن يحتاجون الدعم', content_en: 'Building bridges between those who want to help and those who need support', content_type: 'text', section_group: 'home_mission' },
    { section_key: 'home.vision', content_ar: 'رؤيتنا', content_en: 'Our Vision', content_type: 'text', section_group: 'home_mission' },
    { section_key: 'home.visionDesc', content_ar: 'أن تكون جمعية منابع الخير رائدة في العمل الخيري والتنموي محليًا، مسهمةً في بناء مجتمع متماسك ومستدام يقوم على التكافل والرحمة.', content_en: 'For Manabea Al-Khair Association to be a leader in charitable and developmental work locally, contributing to building a cohesive and sustainable society based on solidarity and compassion.', content_type: 'text', section_group: 'home_mission' },
    { section_key: 'home.goal', content_ar: 'هدفنا', content_en: 'Our Goal', content_type: 'text', section_group: 'home_mission' },
    { section_key: 'home.goalDesc', content_ar: 'تسعى جمعية منابع الخير إلى دعم الأسر الأكثر احتياجًا وتمكين المجتمعات المحلية عبر برامج مساندة اجتماعية وصحية وتنموية تعليمية، مع إدارة رشيدة للموارد وشراكات فعالة لتحقيق أثر مستدام.', content_en: 'Manabea Al-Khair strives to support the most needy families and empower local communities through social, health, educational and developmental assistance programs, with sound resource management and effective partnerships to achieve sustainable impact.', content_type: 'text', section_group: 'home_mission' },
    { section_key: 'home.values', content_ar: 'قيمنا', content_en: 'Our Values', content_type: 'text', section_group: 'home_mission' },
    { section_key: 'home.valuesDesc', content_ar: 'الشفافية · المسؤولية المجتمعية · التكافل · الاحترافية · الاستدامة · احترام الكرامة الإنسانية', content_en: 'Transparency · Social Responsibility · Solidarity · Professionalism · Sustainability · Respect for Human Dignity', content_type: 'text', section_group: 'home_mission' },
    // Home How It Works
    { section_key: 'home.howItWorks', content_ar: 'كيف يعمل', content_en: 'How It Works', content_type: 'text', section_group: 'home_how_it_works' },
    { section_key: 'home.howItWorksDesc', content_ar: 'خطوات بسيطة لإحداث فرق', content_en: 'Simple steps to make a difference', content_type: 'text', section_group: 'home_how_it_works' },
    { section_key: 'home.step1Title', content_ar: 'شارك حاجتك', content_en: 'Share Your Need', content_type: 'text', section_group: 'home_how_it_works' },
    { section_key: 'home.step1Desc', content_ar: 'املأ نموذج الاتصال البسيط الخاص بنا لإخبارنا كيف يمكننا المساعدة أو كيف ترغب في التطوع.', content_en: 'Fill out our simple contact form to let us know how we can help or how you would like to volunteer.', content_type: 'text', section_group: 'home_how_it_works' },
    { section_key: 'home.step2Title', content_ar: 'نحن نربط', content_en: 'We Connect', content_type: 'text', section_group: 'home_how_it_works' },
    { section_key: 'home.step2Desc', content_ar: 'يقوم متطوعونا بمراجعة الطلبات ومطابقة المساعدين مع المحتاجين بناءً على الموقع والمتطلبات.', content_en: 'Our volunteers review requests and match helpers with those in need based on location and requirements.', content_type: 'text', section_group: 'home_how_it_works' },
    { section_key: 'home.step3Title', content_ar: 'تقديم المساعدة', content_en: 'Support Delivered', content_type: 'text', section_group: 'home_how_it_works' },
    { section_key: 'home.step3Desc', content_ar: 'يتم تقديم الدعم بسرعة، سواء كان دواءً أو مساعدة أو مجرد محادثة رعاية.', content_en: 'Support is delivered quickly, whether it is medicine, assistance, or just a caring conversation.', content_type: 'text', section_group: 'home_how_it_works' },
    // Home CTA
    { section_key: 'home.ctaTitle', content_ar: 'هل أنت مستعد لإحداث فرق؟', content_en: 'Ready to Make a Difference?', content_type: 'text', section_group: 'home_cta' },
    { section_key: 'home.ctaDesc', content_ar: 'سواء كنت بحاجة إلى مساعدة أو تريد التطوع، نحن هنا للمساعدة في ربط مجتمعنا.', content_en: 'Whether you need help or want to volunteer, we are here to help connect our community.', content_type: 'text', section_group: 'home_cta' },
    { section_key: 'home.getStarted', content_ar: 'ابدأ اليوم', content_en: 'Get Started Today', content_type: 'text', section_group: 'home_cta' },
    // About Hero
    { section_key: 'about.title', content_ar: 'عن منابع الخير', content_en: 'About Manabea Al-Khair', content_type: 'text', section_group: 'about_hero' },
    { section_key: 'about.subtitle', content_ar: 'تأسست على مبدأ أن كل شخص يستحق الوصول إلى الرعاية الأساسية، نحن نسد الفجوة بين من يحتاجون المساعدة ومن يمكنهم تقديمها.', content_en: 'Founded on the principle that every person deserves access to basic care, we bridge the gap between those who need help and those who can provide it.', content_type: 'text', section_group: 'about_hero' },
    // About Story
    { section_key: 'about.ourStory', content_ar: 'قصتنا', content_en: 'Our Story', content_type: 'text', section_group: 'about_story' },
    { section_key: 'about.ourStoryDesc', content_ar: 'جمعية منابع الخير مشهرة برقم ٨٤٨٢ لسنة ٢٠١٠ بالقاهرة. هي جمعية خيرية غير هادفة للربح تهدف إلى خدمة المجتمع من خلال برامج ومبادرات تنموية وإنسانية متكاملة. تنفذ الجمعية برامجها وفق إطار مؤسسي مسؤول يضمن استهداف المستفيدين بكفاءة وتحقيق أثر اجتماعي مستدام. نعمل على تمكين الأسر، تقديم الرعاية الصحية والاجتماعية، وحماية البيئة، إلى جانب الأنشطة الثقافية والعلمية والدينية.', content_en: 'Manabea Al-Khair Association is registered under No. 8482 of 2010 in Cairo. It is a non-profit charitable association that aims to serve the community through integrated developmental and humanitarian programs and initiatives. The association implements its programs according to a responsible institutional framework that ensures efficient targeting of beneficiaries and achieving sustainable social impact. We work to empower families, provide healthcare and social care, protect the environment, alongside cultural, scientific and religious activities.', content_type: 'text', section_group: 'about_story' },
    { section_key: 'about.peopleHelped', content_ar: 'شخص تمت مساعدته', content_en: 'People Helped', content_type: 'text', section_group: 'about_story' },
    { section_key: 'about.activeVolunteers', content_ar: 'متطوع نشط', content_en: 'Active Volunteers', content_type: 'text', section_group: 'about_story' },
    { section_key: 'about.citiesReached', content_ar: 'مدينة تم الوصول إليها', content_en: 'Cities Reached', content_type: 'text', section_group: 'about_story' },
    { section_key: 'about.satisfactionRate', content_ar: 'معدل الرضا', content_en: 'Satisfaction Rate', content_type: 'text', section_group: 'about_story' },
    // About Services
    { section_key: 'about.whatWeDo', content_ar: 'ما نفعله', content_en: 'What We Do', content_type: 'text', section_group: 'about_services' },
    { section_key: 'about.whatWeDoDesc', content_ar: 'خدماتنا ومبادراتنا الأساسية', content_en: 'Our core services and initiatives', content_type: 'text', section_group: 'about_services' },
    { section_key: 'about.medicineAssistance', content_ar: 'المساعدة في الأدوية', content_en: 'Medicine Assistance', content_type: 'text', section_group: 'about_services' },
    { section_key: 'about.medicineAssistanceDesc', content_ar: 'نربط الأفراد الذين لا يستطيعون تحمل تكاليف أدويتهم بالمتبرعين والصيدليات الراغبة في المساعدة، لضمان عدم حرمان أي شخص من العلاجات الأساسية.', content_en: 'We connect individuals who cannot afford their medications with donors and pharmacies willing to help, ensuring no one is denied essential treatments.', content_type: 'text', section_group: 'about_services' },
    { section_key: 'about.elderlySupport', content_ar: 'دعم كبار السن', content_en: 'Elderly Support', content_type: 'text', section_group: 'about_services' },
    { section_key: 'about.elderlySupportDesc', content_ar: 'يقدم متطوعونا الصحبة والمساعدة في المهام اليومية والمساعدة في التعامل مع أنظمة الرعاية الصحية لكبار السن من أفراد المجتمع.', content_en: 'Our volunteers provide companionship, assistance with daily tasks, and help navigating healthcare systems for elderly community members.', content_type: 'text', section_group: 'about_services' },
    { section_key: 'about.communityNetwork', content_ar: 'شبكة المجتمع', content_en: 'Community Network', content_type: 'text', section_group: 'about_services' },
    { section_key: 'about.communityNetworkDesc', content_ar: 'نبني شبكات دعم محلية مستدامة، نربط الجيران لمساعدة بعضهم البعض وتعزيز روابط المجتمع الدائمة.', content_en: 'We build sustainable local support networks, connecting neighbors to help each other and strengthen lasting community bonds.', content_type: 'text', section_group: 'about_services' },
    // About Values
    { section_key: 'about.ourValues', content_ar: 'قيمنا', content_en: 'Our Values', content_type: 'text', section_group: 'about_values' },
    { section_key: 'about.ourValuesDesc', content_ar: 'المبادئ التي توجه كل ما نقوم به', content_en: 'The principles that guide everything we do', content_type: 'text', section_group: 'about_values' },
    { section_key: 'about.compassion', content_ar: 'التعاطف', content_en: 'Compassion', content_type: 'text', section_group: 'about_values' },
    { section_key: 'about.compassionDesc', content_ar: 'نتعامل مع كل تفاعل بتعاطف وفهم، معترفين بالكرامة في كل شخص.', content_en: 'We approach every interaction with empathy and understanding, recognizing the dignity in every person.', content_type: 'text', section_group: 'about_values' },
    { section_key: 'about.integrity', content_ar: 'النزاهة', content_en: 'Integrity', content_type: 'text', section_group: 'about_values' },
    { section_key: 'about.integrityDesc', content_ar: 'نحافظ على الشفافية في جميع عملياتنا ونضمن وصول كل مورد إلى من يحتاجه أكثر من غيره.', content_en: 'We maintain transparency in all our operations and ensure every resource reaches those who need it most.', content_type: 'text', section_group: 'about_values' },
    { section_key: 'about.community', content_ar: 'المجتمع', content_en: 'Community', content_type: 'text', section_group: 'about_values' },
    { section_key: 'about.communityDesc', content_ar: 'نؤمن بقوة العمل الجماعي ونعزز الروابط التي تقوي مجتمعاتنا.', content_en: 'We believe in the power of collective action and foster bonds that strengthen our communities.', content_type: 'text', section_group: 'about_values' },
    { section_key: 'about.excellence', content_ar: 'التميز', content_en: 'Excellence', content_type: 'text', section_group: 'about_values' },
    { section_key: 'about.excellenceDesc', content_ar: 'نسعى لأعلى المعايير في تقديم خدماتنا، ونحرص على التحسين المستمر في طريقة خدمة مجتمعنا.', content_en: 'We strive for the highest standards in delivering our services, continually improving how we serve our community.', content_type: 'text', section_group: 'about_values' },
    // About Impact
    { section_key: 'about.impactGrows', content_ar: 'تأثيرنا يستمر في النمو', content_en: 'Our Impact Continues to Grow', content_type: 'text', section_group: 'about_impact' },
    { section_key: 'about.impactGrowsDesc', content_ar: 'كل يوم، يكتشف المزيد من الناس قوة الدعم المجتمعي. انضم إلينا في خلق عالم لا يواجه فيه أحد تحدياته بمفرده.', content_en: 'Every day, more people discover the power of community support. Join us in creating a world where no one faces their challenges alone.', content_type: 'text', section_group: 'about_impact' },
    // Activities
    { section_key: 'activities.title', content_ar: 'الأنشطة', content_en: 'Activities', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.subtitle', content_ar: 'تعرّف على البرامج والمبادرات التي نقدمها لخدمة مجتمعنا', content_en: 'Discover the programs and initiatives we offer to serve our community', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity1Title', content_ar: 'المساعدات الاجتماعية (النشاط الرئيسي)', content_en: 'Social Assistance (Main Activity)', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity1Desc', content_ar: 'تقديم مساعدات مالية وعينية طارئة ومخططة للأسر الأولى بالرعاية لتلبية الاحتياجات الأساسية وتحسين مستوى المعيشة.', content_en: 'Providing emergency and planned financial and in-kind assistance to priority families to meet basic needs and improve living standards.', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity2Title', content_ar: 'الخدمات الثقافية والعلمية والدينية', content_en: 'Cultural, Scientific & Religious Services', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity2Desc', content_ar: 'تنظيم برامج توعوية، ورش عمل، دورات تدريبية، ومحاضرات دينية وثقافية تهدف إلى نشر المعرفة والقيم الإيجابية.', content_en: 'Organizing awareness programs, workshops, training courses, and religious and cultural lectures aimed at spreading knowledge and positive values.', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity3Title', content_ar: 'رعاية المسجونين وأسرهم', content_en: "Care for Prisoners & Their Families", content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity3Desc', content_ar: "تقديم دعم اجتماعي وإنساني لأسر المسجونين، والمساهمة في برامج التأهيل الاجتماعي للمفرج عنهم لتمكين عودتهم للمجتمع.", content_en: "Providing social and humanitarian support to prisoners' families, and contributing to social rehabilitation programs for released individuals to enable their reintegration into society.", content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity4Title', content_ar: 'الدفاع الاجتماعي', content_en: 'Social Defense', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity4Desc', content_ar: 'تنفيذ حملات توعوية وبرامج وقائية للحماية من المخاطر الاجتماعية والعمل على تأهيل الفئات المعرضة للانحراف.', content_en: 'Implementing awareness campaigns and preventive programs to protect against social risks and rehabilitate groups at risk of delinquency.', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity5Title', content_ar: 'حماية البيئة والمحافظة عليها', content_en: 'Environmental Protection & Conservation', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity5Desc', content_ar: 'تنظيم حملات تشجير وتنظيف، والتوعية بأهمية الحفاظ على الموارد الطبيعية وسبل العيش المستدامة.', content_en: 'Organizing tree-planting and cleanup campaigns, and raising awareness about the importance of preserving natural resources and sustainable livelihoods.', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity6Title', content_ar: 'التنمية الاقتصادية لزيادة دخل الأسرة', content_en: 'Economic Development to Increase Family Income', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity6Desc', content_ar: 'إطلاق برامج لتمويل ودعم المشروعات الصغيرة ومتناهية الصغر وتقديم تدريبات لرفع مهارات التشغيل وريادة الأعمال.', content_en: 'Launching programs to finance and support small and micro enterprises, and providing training to enhance employment skills and entrepreneurship.', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity7Title', content_ar: 'التنظيم والإدارة', content_en: 'Organization & Management', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity7Desc', content_ar: 'تبني سياسات وإجراءات إدارية ومالية تضمن الكفاءة والشفافية في إدارة الموارد والمشروعات وتحقيق الأهداف.', content_en: 'Adopting administrative and financial policies and procedures that ensure efficiency and transparency in resource management, project implementation, and goal achievement.', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity8Title', content_ar: 'رعاية الفئات الخاصة وذوي الإعاقة', content_en: 'Care for Special Groups & People with Disabilities', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity8Desc', content_ar: 'تقديم برامج دعم تعليمي وصحي واجتماعي لذوي الاحتياجات الخاصة وتهيئة فرص دمج فعّالة.', content_en: 'Providing educational, health and social support programs for people with special needs and creating effective inclusion opportunities.', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity9Title', content_ar: 'الرعاية الصحية', content_en: 'Healthcare', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity9Desc', content_ar: 'تنفيذ قوافل طبية، عيادات متنقلة، وحملات طبية وقائية مع توفير الأدوية والدعم الصحي اللازم للمحتاجين.', content_en: 'Implementing medical convoys, mobile clinics, and preventive medical campaigns while providing medicines and necessary health support to those in need.', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity10Title', content_ar: 'رعاية الشيخوخة', content_en: 'Elder Care', content_type: 'text', section_group: 'activities' },
    { section_key: 'activities.activity10Desc', content_ar: 'تقديم خدمات صحية ونفسية واجتماعية لكبار السن، وتنظيم برامج ترفيهية ورعاية يومية تضمن كرامتهم وجودة حياتهم.', content_en: 'Providing health, psychological, and social services for the elderly, and organizing recreational programs and daily care that ensure their dignity and quality of life.', content_type: 'text', section_group: 'activities' },
    // Contact Info
    { section_key: 'contact.title', content_ar: 'تواصل معنا', content_en: 'Contact Us', content_type: 'text', section_group: 'contact_info' },
    { section_key: 'contact.subtitle', content_ar: 'سواء كنت بحاجة إلى مساعدة أو تريد التطوع، نحن هنا لربطك بمجتمعنا.', content_en: 'Whether you need help or want to volunteer, we are here to connect you with our community.', content_type: 'text', section_group: 'contact_info' },
    { section_key: 'contact.headOfficeAddress', content_ar: '١١، ١٦٢ (ب)، شارع ١٠٥\nالطابق الأرضي – المعادي، القاهرة', content_en: '11, 162 (B), Street 105\nGround Floor – Maadi, Cairo', content_type: 'text', section_group: 'contact_info' },
    { section_key: 'contact.phone', content_ar: '+20 122 214 2359', content_en: '+20 122 214 2359', content_type: 'text', section_group: 'contact_info' },
    { section_key: 'contact.email', content_ar: 'manabeaalkhair@gmail.com', content_en: 'manabeaalkhair@gmail.com', content_type: 'text', section_group: 'contact_info' },
    { section_key: 'contact.workingHoursValue', content_ar: 'السبت – الخميس: ٩:٠٠ ص – ٥:٠٠ م', content_en: 'Saturday – Thursday: 9:00 AM – 5:00 PM', content_type: 'text', section_group: 'contact_info' },
    // Contact Services
    { section_key: 'contact.service1Title', content_ar: 'خدمة طلب مندوب للتحصيل', content_en: 'Field Representative Collection Service', content_type: 'text', section_group: 'contact_services' },
    { section_key: 'contact.service1Desc', content_ar: 'يمكنكم طلب مندوب رسمي لاستلام التبرعات من منازلكم أو مقار أعمالكم مع إيصال رسمي مختوم.', content_en: 'You can request an official representative to collect donations from your home or workplace with an official stamped receipt.', content_type: 'text', section_group: 'contact_services' },
    { section_key: 'contact.service2Title', content_ar: 'خدمة التطوع', content_en: 'Volunteering Service', content_type: 'text', section_group: 'contact_services' },
    { section_key: 'contact.service2Desc', content_ar: 'إذا كنت ترغب في الانضمام إلى فريقنا كمتطوع، اختر "تطوع" من سبب التواصل، وسيتواصل معك فريق الموارد البشرية.', content_en: 'If you wish to join our team as a volunteer, select "Volunteer" from the contact reason, and our HR team will contact you.', content_type: 'text', section_group: 'contact_services' },
    { section_key: 'contact.service3Title', content_ar: 'خدمة الشراكات المؤسسية', content_en: 'Institutional Partnership Service', content_type: 'text', section_group: 'contact_services' },
    { section_key: 'contact.service3Desc', content_ar: 'الجمعيات والشركات الراغبة في التعاون أو رعاية المبادرات يمكنها التواصل عبر اختيار "شراكة" من النموذج.', content_en: 'Organizations and companies wishing to cooperate or sponsor initiatives can contact us by selecting "Partnership" from the form.', content_type: 'text', section_group: 'contact_services' },
    { section_key: 'contact.service4Title', content_ar: 'خدمة الاستفسارات السريعة', content_en: 'Quick Inquiries Service', content_type: 'text', section_group: 'contact_services' },
    { section_key: 'contact.service4Desc', content_ar: 'لأي أسئلة عامة، تواصلوا معنا مباشرة عبر الهاتف أو البريد الإلكتروني، وسيتم الرد خلال ٢٤ ساعة عمل.', content_en: 'For any general questions, contact us directly by phone or email, and we will respond within 24 working hours.', content_type: 'text', section_group: 'contact_services' },
    { section_key: 'contact.closingMessage', content_ar: 'في جمعية منابع الخير نؤمن أن التواصل الفعّال هو جسر أساسي لتعزيز الثقة والتعاون مع المجتمع. تواصلكم معنا يساعدنا على تقديم خدماتنا بشكل أفضل، ويمنحنا فرصة للعمل معًا في نشر الخير وتحقيق التنمية المستدامة.', content_en: 'At Manabea Al-Khair Association, we believe that effective communication is a fundamental bridge for building trust and cooperation with the community. Your contact with us helps us deliver our services better and gives us the opportunity to work together in spreading goodness and achieving sustainable development.', content_type: 'text', section_group: 'contact_services' },
    // Donate Channels
    { section_key: 'donate.title', content_ar: 'تبرع الآن, ساهم في رسم بصمة أمل', content_en: 'Donate Now, Help Shape a Story of Hope', content_type: 'text', section_group: 'donate_channels' },
    { section_key: 'donate.subtitle', content_ar: 'تبرعك يصنع فرقًا حقيقي. من مصادر طعام إلى رعاية صحية كل مساهمة تُسهم في تحسين حياة أسر وأفراد محتاجين. التبرعات تُدار بمسؤولية كاملة لتصل إلى المستفيدين بأسرع وقت', content_en: 'Your donation makes a real difference. From food to healthcare, every contribution helps improve the lives of needy families and individuals. Donations are managed with full responsibility to reach beneficiaries as quickly as possible.', content_type: 'text', section_group: 'donate_channels' },
    { section_key: 'donate.bankAccountNumber', content_ar: '0229006740290013', content_en: '0229006740290013', content_type: 'text', section_group: 'donate_channels' },
    { section_key: 'donate.bankName', content_ar: 'البنك الأهلي المصري', content_en: 'National Bank of Egypt', content_type: 'text', section_group: 'donate_channels' },
    { section_key: 'donate.beneficiaryNameValue', content_ar: 'جمعية منابع الخير', content_en: 'Manabea Al-Khair Association', content_type: 'text', section_group: 'donate_channels' },
    // Volunteer Areas
    { section_key: 'volunteer.title', content_ar: 'تطوع معنا · كن جزءًا من العمل الإنساني', content_en: 'Volunteer With Us · Be Part of Humanitarian Work', content_type: 'text', section_group: 'volunteer_areas' },
    { section_key: 'volunteer.desc', content_ar: 'نرحب بالمتطوعين الراغبين في الانضمام لفرقنا في التوزيع، التدريب، التنظيم، والدعم اللوجيستي. نوفّر تدريبًا موجزًا وتوزيع مهام واضح يضمن الاستفادة القصوى للمتطوعين والمستفيدين.', content_en: 'We welcome volunteers wishing to join our teams in distribution, training, organization, and logistical support. We provide brief training and clear task assignments to ensure maximum benefit for volunteers and beneficiaries.', content_type: 'text', section_group: 'volunteer_areas' },
    { section_key: 'volunteer.area1Title', content_ar: 'ميداني', content_en: 'Field', content_type: 'text', section_group: 'volunteer_areas' },
    { section_key: 'volunteer.area1Desc', content_ar: 'المشاركة في التوزيع والقوافل الإنسانية والأعمال الميدانية المباشرة.', content_en: 'Participating in distribution, humanitarian convoys, and direct field operations.', content_type: 'text', section_group: 'volunteer_areas' },
    { section_key: 'volunteer.area2Title', content_ar: 'إداري', content_en: 'Administrative', content_type: 'text', section_group: 'volunteer_areas' },
    { section_key: 'volunteer.area2Desc', content_ar: 'دعم العمليات التنظيمية، التوثيق، وإدارة الملفات والبيانات.', content_en: 'Supporting organizational operations, documentation, and file and data management.', content_type: 'text', section_group: 'volunteer_areas' },
    { section_key: 'volunteer.area3Title', content_ar: 'إعلامي', content_en: 'Media', content_type: 'text', section_group: 'volunteer_areas' },
    { section_key: 'volunteer.area3Desc', content_ar: 'التصوير، التصميم، إنتاج المحتوى، وإدارة وسائل التواصل الاجتماعي.', content_en: 'Photography, design, content production, and social media management.', content_type: 'text', section_group: 'volunteer_areas' },
    { section_key: 'volunteer.area4Title', content_ar: 'تدريبي', content_en: 'Training', content_type: 'text', section_group: 'volunteer_areas' },
    { section_key: 'volunteer.area4Desc', content_ar: 'تقديم ورش عمل، دورات تدريبية، ودعم بناء القدرات للمتطوعين والمستفيدين.', content_en: 'Conducting workshops, training courses, and capacity building support for volunteers and beneficiaries.', content_type: 'text', section_group: 'volunteer_areas' },
    // Footer
    { section_key: 'footer.description', content_ar: 'ربط القلوب، تغيير الحياة من خلال التعاطف والدعم المجتمعي.', content_en: 'Connecting hearts, changing lives through compassion and community support.', content_type: 'text', section_group: 'footer' },
    { section_key: 'footer.address', content_ar: '١١، ١٦٢ (ب)، شارع ١٠٥ – المعادي، القاهرة', content_en: '11, 162 (B), Street 105 – Maadi, Cairo', content_type: 'text', section_group: 'footer' },
    { section_key: 'footer.email', content_ar: 'manabeaalkhair@gmail.com', content_en: 'manabeaalkhair@gmail.com', content_type: 'text', section_group: 'footer' },
    { section_key: 'footer.phone', content_ar: '+20 122 214 2359', content_en: '+20 122 214 2359', content_type: 'text', section_group: 'footer' },
    // Social Links
    { section_key: 'social.facebook', content_ar: 'https://www.facebook.com/ManabeaAlkhair/', content_en: 'https://www.facebook.com/ManabeaAlkhair/', content_type: 'url', section_group: 'social_links' },
    { section_key: 'social.instagram', content_ar: 'https://www.instagram.com/ManabeaAlkhair', content_en: 'https://www.instagram.com/ManabeaAlkhair', content_type: 'url', section_group: 'social_links' },
    { section_key: 'social.linkedin', content_ar: 'https://www.linkedin.com/company/manabeaalkhairassociation', content_en: 'https://www.linkedin.com/company/manabeaalkhairassociation', content_type: 'url', section_group: 'social_links' },
    // Privacy
    { section_key: 'privacy.title', content_ar: 'سياسة الخصوصية', content_en: 'Privacy Policy', content_type: 'text', section_group: 'privacy' },
    { section_key: 'privacy.subtitle', content_ar: 'نلتزم بحماية خصوصيتكم وضمان الشفافية الكاملة في كيفية استخدام بياناتكم وإدارة مواردنا', content_en: 'We are committed to protecting your privacy and ensuring full transparency in how your data is used and our resources are managed', content_type: 'text', section_group: 'privacy' },
    { section_key: 'privacy.section1Title', content_ar: 'سياسة الخصوصية', content_en: 'Privacy Policy', content_type: 'text', section_group: 'privacy' },
    { section_key: 'privacy.section2Title', content_ar: 'شروط الاستخدام', content_en: 'Terms of Use', content_type: 'text', section_group: 'privacy' },
    { section_key: 'privacy.section3Title', content_ar: 'الشفافية والتقارير', content_en: 'Transparency & Reporting', content_type: 'text', section_group: 'privacy' },
  ];

  const now = new Date().toISOString();
  const seeded = rows.map((r) => ({ ...r, id: uuid(), updated_at: now, updated_by: null }));
  setTable('site_content', seeded);
  localStorage.setItem('localdb_seeded', '1');
}

seedSiteContent();

// ── Query builder ─────────────────────────────────────────────────────────────

class SelectQuery implements PromiseLike<{ data: DbRow[]; error: null }> {
  private _orderField: string | null = null;
  private _orderAsc = true;
  private _filters: Array<{ field: string; value: unknown }> = [];

  constructor(private tableName: string) {}

  order(field: string, opts?: { ascending?: boolean }) {
    this._orderField = field;
    this._orderAsc = opts?.ascending ?? true;
    return this;
  }

  eq(field: string, value: unknown) {
    this._filters.push({ field, value });
    return this;
  }

  then<T>(
    resolve: (v: { data: DbRow[]; error: null }) => T,
    _reject?: (reason: unknown) => T
  ): Promise<T> {
    let rows = getTable(this.tableName);
    for (const f of this._filters) {
      rows = rows.filter((r) => r[f.field] === f.value);
    }
    if (this._orderField) {
      const field = this._orderField;
      const asc = this._orderAsc;
      rows = [...rows].sort((a, b) => {
        const av = String(a[field] ?? '');
        const bv = String(b[field] ?? '');
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return Promise.resolve({ data: rows, error: null }).then(resolve);
  }
}

class TableRef {
  constructor(private name: string) {}

  select(_fields = '*') {
    return new SelectQuery(this.name);
  }

  insert(rows: DbRow[]) {
    const table = getTable(this.name);
    const now = new Date().toISOString();
    const newRows = rows.map((row) => ({
      status: 'pending',
      ...row,
      id: (row.id as string) || uuid(),
      created_at: (row.created_at as string) || now,
      updated_at: now,
    }));
    setTable(this.name, [...table, ...newRows]);
    return Promise.resolve({ data: newRows, error: null });
  }

  update(updates: DbRow) {
    const name = this.name;
    return {
      eq(field: string, value: unknown) {
        const table = getTable(name);
        const now = new Date().toISOString();
        setTable(
          name,
          table.map((row) =>
            row[field] === value ? { ...row, ...updates, updated_at: now } : row
          )
        );
        return Promise.resolve({ data: null, error: null });
      },
    };
  }

  delete() {
    const name = this.name;
    return {
      eq(field: string, value: unknown) {
        setTable(name, getTable(name).filter((row) => row[field] !== value));
        return Promise.resolve({ data: null, error: null });
      },
    };
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = 'admin@manabeaalkhair.org';
const ADMIN_PASSWORD = 'Admin@2024';
const SESSION_KEY = 'localdb_session';

type LocalUser = { id: string; email: string };
type AuthChangeCallback = (event: string, session: { user: LocalUser } | null) => void;

const authListeners: AuthChangeCallback[] = [];

function getSession(): { user: LocalUser } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSession(session: { user: LocalUser } | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  authListeners.forEach((cb) => cb(session ? 'SIGNED_IN' : 'SIGNED_OUT', session));
}

const localAuth = {
  getSession(): Promise<{ data: { session: { user: LocalUser } | null } }> {
    return Promise.resolve({ data: { session: getSession() } });
  },

  signInWithPassword({ email, password }: { email: string; password: string }): Promise<{ error: Error | null }> {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setSession({ user: { id: 'admin-local', email: ADMIN_EMAIL } });
      return Promise.resolve({ error: null });
    }
    return Promise.resolve({ error: new Error('Invalid credentials') });
  },

  signOut(): Promise<void> {
    setSession(null);
    return Promise.resolve();
  },

  onAuthStateChange(callback: AuthChangeCallback): { data: { subscription: { unsubscribe: () => void } } } {
    authListeners.push(callback);
    return {
      data: {
        subscription: {
          unsubscribe() {
            const idx = authListeners.indexOf(callback);
            if (idx !== -1) authListeners.splice(idx, 1);
          },
        },
      },
    };
  },
};

// ── Public client ─────────────────────────────────────────────────────────────

export const supabase = {
  from(table: string) {
    return new TableRef(table);
  },
  auth: localAuth,
};
