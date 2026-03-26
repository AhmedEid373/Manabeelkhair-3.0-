'use strict';

// Run once to create tables and insert the default admin user.
// Usage: DATABASE_URL=postgresql://... node server/seed.js

const { Client } = require('pg');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function seed(externalPool) {
  // When called from index.js, use the shared pool; when run as CLI, create a dedicated connection.
  let conn;
  if (externalPool) {
    conn = externalPool;
  } else {
    conn = new Client({ connectionString: process.env.DATABASE_URL });
    await conn.connect();
  }
  const ownConnection = !externalPool;

  // ── Admin users ───────────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id         UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      email      VARCHAR(255) NOT NULL UNIQUE,
      password   VARCHAR(255) NOT NULL,
      created_at TIMESTAMP    NOT NULL DEFAULT NOW()
    )
  `);

  // ── Contacts ──────────────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id         UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) NOT NULL,
      phone      VARCHAR(50)  NOT NULL,
      type       VARCHAR(50)  NOT NULL CHECK (type IN ('donation','volunteer','inquiry','partnership','helper','needer')),
      message    TEXT,
      location   VARCHAR(255),
      status     VARCHAR(50)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
      notes      TEXT,
      created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
    )
  `);

  // ── Donation requests ─────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS donation_requests (
      id              UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      full_name       VARCHAR(255) NOT NULL,
      email           VARCHAR(255) NOT NULL,
      phone           VARCHAR(50)  NOT NULL,
      amount          VARCHAR(50)  NOT NULL,
      donation_method VARCHAR(100) NOT NULL,
      allocation      VARCHAR(255),
      privacy_agreed  BOOLEAN      NOT NULL DEFAULT FALSE,
      status          VARCHAR(50)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
      admin_notes     TEXT,
      created_at      TIMESTAMP    NOT NULL DEFAULT NOW()
    )
  `);

  // ── Volunteer requests ────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS volunteer_requests (
      id             UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      full_name      VARCHAR(255) NOT NULL,
      age            VARCHAR(10)  NOT NULL,
      email          VARCHAR(255) NOT NULL,
      phone          VARCHAR(50)  NOT NULL,
      region         VARCHAR(255) NOT NULL,
      skills         TEXT         NOT NULL,
      availability   VARCHAR(255) NOT NULL,
      volunteer_type VARCHAR(100) NOT NULL,
      notes          TEXT,
      terms_agreed   BOOLEAN      NOT NULL DEFAULT FALSE,
      status         VARCHAR(50)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
      admin_notes    TEXT,
      created_at     TIMESTAMP    NOT NULL DEFAULT NOW()
    )
  `);

  // ── Site content ──────────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      id            UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      section_key   VARCHAR(255) NOT NULL UNIQUE,
      content_ar    TEXT         NOT NULL,
      content_en    TEXT         NOT NULL,
      content_type  VARCHAR(50)  NOT NULL DEFAULT 'text',
      section_group VARCHAR(100) NOT NULL DEFAULT 'general',
      updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
      updated_by    VARCHAR(255)
    )
  `);

  // ── auto-update updated_at on contacts and site_content ──────────────────
  await conn.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$ LANGUAGE plpgsql
  `);
  await conn.query(`
    CREATE OR REPLACE TRIGGER trg_contacts_updated_at
      BEFORE UPDATE ON contacts
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
  `);
  await conn.query(`
    CREATE OR REPLACE TRIGGER trg_site_content_updated_at
      BEFORE UPDATE ON site_content
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
  `);

  // ── Default admin user (only if no admin exists yet) ─────────────────────
  const { rows: adminRows } = await conn.query('SELECT COUNT(*) FROM admin_users');
  if (parseInt(adminRows[0].count) === 0) {
    await conn.query(
      `INSERT INTO admin_users (email, password) VALUES ($1, $2)`,
      ['admin@manabeaalkhair.org', hashPassword('Admin@2024')]
    );
    console.log('Default admin user created: admin@manabeaalkhair.org / Admin@2024');
  } else {
    console.log('Admin user already exists — skipping seed.');
  }

  // ── Default site content ────────────────────────────────────────────────
  const siteRows = [
    ['nav.logo_url', '/logo-new-disgin.png', '/logo-new-disgin.png', 'image', 'header'],
    ['brand.name', 'جمعية منابع الخير', 'Manabea Al-Khair Association', 'text', 'header'],
    ['brand.tagline', 'نصنع الخير ونجعل العطاء أسلوب حياة', 'Spreading Goodness, Making Giving a Way of Life', 'text', 'header'],
    ['brand.description', 'دعم كبار السن والذين لا يستطيعون تحمل تكاليف الأدوية من خلال التعاطف المجتمعي والجهود التطوعية', 'Supporting the elderly and those who cannot afford medication through community compassion and volunteer efforts', 'text', 'header'],
    ['home.title', 'جمعية منابع الخير', 'Manabea Al-Khair Association', 'text', 'home_hero'],
    ['home.titleHighlight', '', '', 'text', 'home_hero'],
    ['home.subtitle', 'نصنع الخير ونجعل العطاء أسلوب حياة', 'Spreading Goodness, Making Giving a Way of Life', 'text', 'home_hero'],
    ['home.registrationInfo', 'جمعية خيرية مشهرة برقم ٨٤٨٢ لسنة ٢٠١٠ بالقاهرة تعمل على تقديم خدمات اجتماعية وتنموية متكاملة لدعم الأسر الأكثر احتياجًا وتعزيز التكافل الاجتماعي وتحقيق أثر مستدام.', 'A charitable association registered under No. 8482 of 2010 in Cairo, providing integrated social and developmental services to support the most needy families, enhance social solidarity, and achieve sustainable impact.', 'text', 'home_hero'],
    ['home.needHelp', 'أحتاج مساعدة', 'I Need Help', 'text', 'home_hero'],
    ['home.mission', 'مهمتنا', 'Our Mission', 'text', 'home_mission'],
    ['home.missionDesc', 'بناء جسور بين من يريدون المساعدة ومن يحتاجون الدعم', 'Building bridges between those who want to help and those who need support', 'text', 'home_mission'],
    ['home.vision', 'رؤيتنا', 'Our Vision', 'text', 'home_mission'],
    ['home.visionDesc', 'أن تكون جمعية منابع الخير رائدة في العمل الخيري والتنموي محليًا، مسهمةً في بناء مجتمع متماسك ومستدام يقوم على التكافل والرحمة.', 'For Manabea Al-Khair Association to be a leader in charitable and developmental work locally, contributing to building a cohesive and sustainable society based on solidarity and compassion.', 'text', 'home_mission'],
    ['home.goal', 'هدفنا', 'Our Goal', 'text', 'home_mission'],
    ['home.goalDesc', 'تسعى جمعية منابع الخير إلى دعم الأسر الأكثر احتياجًا وتمكين المجتمعات المحلية عبر برامج مساندة اجتماعية وصحية وتنموية تعليمية، مع إدارة رشيدة للموارد وشراكات فعالة لتحقيق أثر مستدام.', 'Manabea Al-Khair strives to support the most needy families and empower local communities through social, health, educational and developmental assistance programs, with sound resource management and effective partnerships to achieve sustainable impact.', 'text', 'home_mission'],
    ['home.values', 'قيمنا', 'Our Values', 'text', 'home_mission'],
    ['home.valuesDesc', 'الشفافية · المسؤولية المجتمعية · التكافل · الاحترافية · الاستدامة · احترام الكرامة الإنسانية', 'Transparency · Social Responsibility · Solidarity · Professionalism · Sustainability · Respect for Human Dignity', 'text', 'home_mission'],
    ['home.howItWorks', 'كيف يعمل', 'How It Works', 'text', 'home_how_it_works'],
    ['home.howItWorksDesc', 'خطوات بسيطة لإحداث فرق', 'Simple steps to make a difference', 'text', 'home_how_it_works'],
    ['home.step1Title', 'شارك حاجتك', 'Share Your Need', 'text', 'home_how_it_works'],
    ['home.step1Desc', 'املأ نموذج الاتصال البسيط الخاص بنا لإخبارنا كيف يمكننا المساعدة أو كيف ترغب في التطوع.', 'Fill out our simple contact form to let us know how we can help or how you would like to volunteer.', 'text', 'home_how_it_works'],
    ['home.step2Title', 'نحن نربط', 'We Connect', 'text', 'home_how_it_works'],
    ['home.step2Desc', 'يقوم متطوعونا بمراجعة الطلبات ومطابقة المساعدين مع المحتاجين بناءً على الموقع والمتطلبات.', 'Our volunteers review requests and match helpers with those in need based on location and requirements.', 'text', 'home_how_it_works'],
    ['home.step3Title', 'تقديم المساعدة', 'Support Delivered', 'text', 'home_how_it_works'],
    ['home.step3Desc', 'يتم تقديم الدعم بسرعة، سواء كان دواءً أو مساعدة أو مجرد محادثة رعاية.', 'Support is delivered quickly, whether it is medicine, assistance, or just a caring conversation.', 'text', 'home_how_it_works'],
    ['home.ctaTitle', 'هل أنت مستعد لإحداث فرق؟', 'Ready to Make a Difference?', 'text', 'home_cta'],
    ['home.ctaDesc', 'سواء كنت بحاجة إلى مساعدة أو تريد التطوع، نحن هنا للمساعدة في ربط مجتمعنا.', 'Whether you need help or want to volunteer, we are here to help connect our community.', 'text', 'home_cta'],
    ['home.getStarted', 'ابدأ اليوم', 'Get Started Today', 'text', 'home_cta'],
    ['about.title', 'عن منابع الخير', 'About Manabea Al-Khair', 'text', 'about_hero'],
    ['about.subtitle', 'تأسست على مبدأ أن كل شخص يستحق الوصول إلى الرعاية الأساسية، نحن نسد الفجوة بين من يحتاجون المساعدة ومن يمكنهم تقديمها.', 'Founded on the principle that every person deserves access to basic care, we bridge the gap between those who need help and those who can provide it.', 'text', 'about_hero'],
    ['about.ourStory', 'قصتنا', 'Our Story', 'text', 'about_story'],
    ['about.ourStoryDesc', 'جمعية منابع الخير مشهرة برقم ٨٤٨٢ لسنة ٢٠١٠ بالقاهرة. هي جمعية خيرية غير هادفة للربح تهدف إلى خدمة المجتمع من خلال برامج ومبادرات تنموية وإنسانية متكاملة.', 'Manabea Al-Khair Association is registered under No. 8482 of 2010 in Cairo. It is a non-profit charitable association that aims to serve the community through integrated developmental and humanitarian programs and initiatives.', 'text', 'about_story'],
    ['about.peopleHelped', 'شخص تمت مساعدته', 'People Helped', 'text', 'about_story'],
    ['about.activeVolunteers', 'متطوع نشط', 'Active Volunteers', 'text', 'about_story'],
    ['about.citiesReached', 'مدينة تم الوصول إليها', 'Cities Reached', 'text', 'about_story'],
    ['about.satisfactionRate', 'معدل الرضا', 'Satisfaction Rate', 'text', 'about_story'],
    ['about.whatWeDo', 'ما نفعله', 'What We Do', 'text', 'about_services'],
    ['about.whatWeDoDesc', 'خدماتنا ومبادراتنا الأساسية', 'Our core services and initiatives', 'text', 'about_services'],
    ['about.medicineAssistance', 'المساعدة في الأدوية', 'Medicine Assistance', 'text', 'about_services'],
    ['about.medicineAssistanceDesc', 'نربط الأفراد الذين لا يستطيعون تحمل تكاليف أدويتهم بالمتبرعين والصيدليات الراغبة في المساعدة، لضمان عدم حرمان أي شخص من العلاجات الأساسية.', 'We connect individuals who cannot afford their medications with donors and pharmacies willing to help, ensuring no one is denied essential treatments.', 'text', 'about_services'],
    ['about.elderlySupport', 'دعم كبار السن', 'Elderly Support', 'text', 'about_services'],
    ['about.elderlySupportDesc', 'يقدم متطوعونا الصحبة والمساعدة في المهام اليومية والمساعدة في التعامل مع أنظمة الرعاية الصحية لكبار السن من أفراد المجتمع.', 'Our volunteers provide companionship, assistance with daily tasks, and help navigating healthcare systems for elderly community members.', 'text', 'about_services'],
    ['about.communityNetwork', 'شبكة المجتمع', 'Community Network', 'text', 'about_services'],
    ['about.communityNetworkDesc', 'نبني شبكات دعم محلية مستدامة، نربط الجيران لمساعدة بعضهم البعض وتعزيز روابط المجتمع الدائمة.', 'We build sustainable local support networks, connecting neighbors to help each other and strengthen lasting community bonds.', 'text', 'about_services'],
    ['about.ourValues', 'قيمنا', 'Our Values', 'text', 'about_values'],
    ['about.ourValuesDesc', 'المبادئ التي توجه كل ما نقوم به', 'The principles that guide everything we do', 'text', 'about_values'],
    ['about.compassion', 'التعاطف', 'Compassion', 'text', 'about_values'],
    ['about.compassionDesc', 'نتعامل مع كل تفاعل بتعاطف وفهم، معترفين بالكرامة في كل شخص.', 'We approach every interaction with empathy and understanding, recognizing the dignity in every person.', 'text', 'about_values'],
    ['about.integrity', 'النزاهة', 'Integrity', 'text', 'about_values'],
    ['about.integrityDesc', 'نحافظ على الشفافية في جميع عملياتنا ونضمن وصول كل مورد إلى من يحتاجه أكثر من غيره.', 'We maintain transparency in all our operations and ensure every resource reaches those who need it most.', 'text', 'about_values'],
    ['about.community', 'المجتمع', 'Community', 'text', 'about_values'],
    ['about.communityDesc', 'نؤمن بقوة العمل الجماعي ونعزز الروابط التي تقوي مجتمعاتنا.', 'We believe in the power of collective action and foster bonds that strengthen our communities.', 'text', 'about_values'],
    ['about.excellence', 'التميز', 'Excellence', 'text', 'about_values'],
    ['about.excellenceDesc', 'نسعى لأعلى المعايير في تقديم خدماتنا، ونحرص على التحسين المستمر في طريقة خدمة مجتمعنا.', 'We strive for the highest standards in delivering our services, continually improving how we serve our community.', 'text', 'about_values'],
    ['about.impactGrows', 'تأثيرنا يستمر في النمو', 'Our Impact Continues to Grow', 'text', 'about_impact'],
    ['about.impactGrowsDesc', 'كل يوم، يكتشف المزيد من الناس قوة الدعم المجتمعي. انضم إلينا في خلق عالم لا يواجه فيه أحد تحدياته بمفرده.', 'Every day, more people discover the power of community support. Join us in creating a world where no one faces their challenges alone.', 'text', 'about_impact'],
    ['activities.title', 'الأنشطة', 'Activities', 'text', 'activities'],
    ['activities.subtitle', 'تعرّف على البرامج والمبادرات التي نقدمها لخدمة مجتمعنا', 'Discover the programs and initiatives we offer to serve our community', 'text', 'activities'],
    ['activities.activity1Title', 'المساعدات الاجتماعية (النشاط الرئيسي)', 'Social Assistance (Main Activity)', 'text', 'activities'],
    ['activities.activity1Desc', 'تقديم مساعدات مالية وعينية طارئة ومخططة للأسر الأولى بالرعاية لتلبية الاحتياجات الأساسية وتحسين مستوى المعيشة.', 'Providing emergency and planned financial and in-kind assistance to priority families to meet basic needs and improve living standards.', 'text', 'activities'],
    ['activities.activity2Title', 'الخدمات الثقافية والعلمية والدينية', 'Cultural, Scientific & Religious Services', 'text', 'activities'],
    ['activities.activity2Desc', 'تنظيم برامج توعوية، ورش عمل، دورات تدريبية، ومحاضرات دينية وثقافية تهدف إلى نشر المعرفة والقيم الإيجابية.', 'Organizing awareness programs, workshops, training courses, and religious and cultural lectures aimed at spreading knowledge and positive values.', 'text', 'activities'],
    ['activities.activity3Title', 'رعاية المسجونين وأسرهم', 'Care for Prisoners & Their Families', 'text', 'activities'],
    ['activities.activity3Desc', 'تقديم دعم اجتماعي وإنساني لأسر المسجونين، والمساهمة في برامج التأهيل الاجتماعي للمفرج عنهم لتمكين عودتهم للمجتمع.', "Providing social and humanitarian support to prisoners' families, and contributing to social rehabilitation programs for released individuals to enable their reintegration into society.", 'text', 'activities'],
    ['activities.activity4Title', 'الدفاع الاجتماعي', 'Social Defense', 'text', 'activities'],
    ['activities.activity4Desc', 'تنفيذ حملات توعوية وبرامج وقائية للحماية من المخاطر الاجتماعية والعمل على تأهيل الفئات المعرضة للانحراف.', 'Implementing awareness campaigns and preventive programs to protect against social risks and rehabilitate groups at risk of delinquency.', 'text', 'activities'],
    ['activities.activity5Title', 'حماية البيئة والمحافظة عليها', 'Environmental Protection & Conservation', 'text', 'activities'],
    ['activities.activity5Desc', 'تنظيم حملات تشجير وتنظيف، والتوعية بأهمية الحفاظ على الموارد الطبيعية وسبل العيش المستدامة.', 'Organizing tree-planting and cleanup campaigns, and raising awareness about the importance of preserving natural resources and sustainable livelihoods.', 'text', 'activities'],
    ['activities.activity6Title', 'التنمية الاقتصادية لزيادة دخل الأسرة', 'Economic Development to Increase Family Income', 'text', 'activities'],
    ['activities.activity6Desc', 'إطلاق برامج لتمويل ودعم المشروعات الصغيرة ومتناهية الصغر وتقديم تدريبات لرفع مهارات التشغيل وريادة الأعمال.', 'Launching programs to finance and support small and micro enterprises, and providing training to enhance employment skills and entrepreneurship.', 'text', 'activities'],
    ['activities.activity7Title', 'التنظيم والإدارة', 'Organization & Management', 'text', 'activities'],
    ['activities.activity7Desc', 'تبني سياسات وإجراءات إدارية ومالية تضمن الكفاءة والشفافية في إدارة الموارد والمشروعات وتحقيق الأهداف.', 'Adopting administrative and financial policies and procedures that ensure efficiency and transparency in resource management, project implementation, and goal achievement.', 'text', 'activities'],
    ['activities.activity8Title', 'رعاية الفئات الخاصة وذوي الإعاقة', 'Care for Special Groups & People with Disabilities', 'text', 'activities'],
    ['activities.activity8Desc', 'تقديم برامج دعم تعليمي وصحي واجتماعي لذوي الاحتياجات الخاصة وتهيئة فرص دمج فعّالة.', 'Providing educational, health and social support programs for people with special needs and creating effective inclusion opportunities.', 'text', 'activities'],
    ['activities.activity9Title', 'الرعاية الصحية', 'Healthcare', 'text', 'activities'],
    ['activities.activity9Desc', 'تنفيذ قوافل طبية، عيادات متنقلة، وحملات طبية وقائية مع توفير الأدوية والدعم الصحي اللازم للمحتاجين.', 'Implementing medical convoys, mobile clinics, and preventive medical campaigns while providing medicines and necessary health support to those in need.', 'text', 'activities'],
    ['activities.activity10Title', 'رعاية الشيخوخة', 'Elder Care', 'text', 'activities'],
    ['activities.activity10Desc', 'تقديم خدمات صحية ونفسية واجتماعية لكبار السن، وتنظيم برامج ترفيهية ورعاية يومية تضمن كرامتهم وجودة حياتهم.', 'Providing health, psychological, and social services for the elderly, and organizing recreational programs and daily care that ensure their dignity and quality of life.', 'text', 'activities'],
    ['contact.title', 'تواصل معنا', 'Contact Us', 'text', 'contact_info'],
    ['contact.subtitle', 'سواء كنت بحاجة إلى مساعدة أو تريد التطوع، نحن هنا لربطك بمجتمعنا.', 'Whether you need help or want to volunteer, we are here to connect you with our community.', 'text', 'contact_info'],
    ['contact.headOfficeAddress', '١١، ١٦٢ (ب)، شارع ١٠٥\nالطابق الأرضي – المعادي، القاهرة', '11, 162 (B), Street 105\nGround Floor – Maadi, Cairo', 'text', 'contact_info'],
    ['contact.phone', '+20 122 214 2359', '+20 122 214 2359', 'text', 'contact_info'],
    ['contact.email', 'manabeaalkhair@gmail.com', 'manabeaalkhair@gmail.com', 'text', 'contact_info'],
    ['contact.workingHoursValue', 'السبت – الخميس: ٩:٠٠ ص – ٥:٠٠ م', 'Saturday – Thursday: 9:00 AM – 5:00 PM', 'text', 'contact_info'],
    ['contact.service1Title', 'خدمة طلب مندوب للتحصيل', 'Field Representative Collection Service', 'text', 'contact_services'],
    ['contact.service1Desc', 'يمكنكم طلب مندوب رسمي لاستلام التبرعات من منازلكم أو مقار أعمالكم مع إيصال رسمي مختوم.', 'You can request an official representative to collect donations from your home or workplace with an official stamped receipt.', 'text', 'contact_services'],
    ['contact.service2Title', 'خدمة التطوع', 'Volunteering Service', 'text', 'contact_services'],
    ['contact.service2Desc', 'إذا كنت ترغب في الانضمام إلى فريقنا كمتطوع، اختر "تطوع" من سبب التواصل، وسيتواصل معك فريق الموارد البشرية.', 'If you wish to join our team as a volunteer, select "Volunteer" from the contact reason, and our HR team will contact you.', 'text', 'contact_services'],
    ['contact.service3Title', 'خدمة الشراكات المؤسسية', 'Institutional Partnership Service', 'text', 'contact_services'],
    ['contact.service3Desc', 'الجمعيات والشركات الراغبة في التعاون أو رعاية المبادرات يمكنها التواصل عبر اختيار "شراكة" من النموذج.', 'Organizations and companies wishing to cooperate or sponsor initiatives can contact us by selecting "Partnership" from the form.', 'text', 'contact_services'],
    ['contact.service4Title', 'خدمة الاستفسارات السريعة', 'Quick Inquiries Service', 'text', 'contact_services'],
    ['contact.service4Desc', 'لأي أسئلة عامة، تواصلوا معنا مباشرة عبر الهاتف أو البريد الإلكتروني، وسيتم الرد خلال ٢٤ ساعة عمل.', 'For any general questions, contact us directly by phone or email, and we will respond within 24 working hours.', 'text', 'contact_services'],
    ['contact.closingMessage', 'في جمعية منابع الخير نؤمن أن التواصل الفعّال هو جسر أساسي لتعزيز الثقة والتعاون مع المجتمع.', 'At Manabea Al-Khair Association, we believe that effective communication is a fundamental bridge for building trust and cooperation with the community.', 'text', 'contact_services'],
    ['donate.title', 'تبرع الآن, ساهم في رسم بصمة أمل', 'Donate Now, Help Shape a Story of Hope', 'text', 'donate_channels'],
    ['donate.subtitle', 'تبرعك يصنع فرقًا حقيقي. من مصادر طعام إلى رعاية صحية كل مساهمة تُسهم في تحسين حياة أسر وأفراد محتاجين.', 'Your donation makes a real difference. From food to healthcare, every contribution helps improve the lives of needy families and individuals.', 'text', 'donate_channels'],
    ['donate.bankAccountNumber', '0229006740290013', '0229006740290013', 'text', 'donate_channels'],
    ['donate.bankName', 'البنك الأهلي المصري', 'National Bank of Egypt', 'text', 'donate_channels'],
    ['donate.beneficiaryNameValue', 'جمعية منابع الخير', 'Manabea Al-Khair Association', 'text', 'donate_channels'],
    ['volunteer.title', 'تطوع معنا · كن جزءًا من العمل الإنساني', 'Volunteer With Us · Be Part of Humanitarian Work', 'text', 'volunteer_areas'],
    ['volunteer.desc', 'نرحب بالمتطوعين الراغبين في الانضمام لفرقنا في التوزيع، التدريب، التنظيم، والدعم اللوجيستي.', 'We welcome volunteers wishing to join our teams in distribution, training, organization, and logistical support.', 'text', 'volunteer_areas'],
    ['volunteer.area1Title', 'ميداني', 'Field', 'text', 'volunteer_areas'],
    ['volunteer.area1Desc', 'المشاركة في التوزيع والقوافل الإنسانية والأعمال الميدانية المباشرة.', 'Participating in distribution, humanitarian convoys, and direct field operations.', 'text', 'volunteer_areas'],
    ['volunteer.area2Title', 'إداري', 'Administrative', 'text', 'volunteer_areas'],
    ['volunteer.area2Desc', 'دعم العمليات التنظيمية، التوثيق، وإدارة الملفات والبيانات.', 'Supporting organizational operations, documentation, and file and data management.', 'text', 'volunteer_areas'],
    ['volunteer.area3Title', 'إعلامي', 'Media', 'text', 'volunteer_areas'],
    ['volunteer.area3Desc', 'التصوير، التصميم، إنتاج المحتوى، وإدارة وسائل التواصل الاجتماعي.', 'Photography, design, content production, and social media management.', 'text', 'volunteer_areas'],
    ['volunteer.area4Title', 'تدريبي', 'Training', 'text', 'volunteer_areas'],
    ['volunteer.area4Desc', 'تقديم ورش عمل، دورات تدريبية، ودعم بناء القدرات للمتطوعين والمستفيدين.', 'Conducting workshops, training courses, and capacity building support for volunteers and beneficiaries.', 'text', 'volunteer_areas'],
    ['footer.description', 'ربط القلوب، تغيير الحياة من خلال التعاطف والدعم المجتمعي.', 'Connecting hearts, changing lives through compassion and community support.', 'text', 'footer'],
    ['footer.address', '١١، ١٦٢ (ب)، شارع ١٠٥ – المعادي، القاهرة', '11, 162 (B), Street 105 – Maadi, Cairo', 'text', 'footer'],
    ['footer.email', 'manabeaalkhair@gmail.com', 'manabeaalkhair@gmail.com', 'text', 'footer'],
    ['footer.phone', '+20 122 214 2359', '+20 122 214 2359', 'text', 'footer'],
    ['social.facebook', 'https://www.facebook.com/ManabeaAlkhair/', 'https://www.facebook.com/ManabeaAlkhair/', 'url', 'social_links'],
    ['social.instagram', 'https://www.instagram.com/ManabeaAlkhair', 'https://www.instagram.com/ManabeaAlkhair', 'url', 'social_links'],
    ['social.linkedin', 'https://www.linkedin.com/company/manabeaalkhairassociation', 'https://www.linkedin.com/company/manabeaalkhairassociation', 'url', 'social_links'],
    ['privacy.title', 'سياسة الخصوصية', 'Privacy Policy', 'text', 'privacy'],
    ['privacy.subtitle', 'نلتزم بحماية خصوصيتكم وضمان الشفافية الكاملة في كيفية استخدام بياناتكم وإدارة مواردنا', 'We are committed to protecting your privacy and ensuring full transparency in how your data is used and our resources are managed', 'text', 'privacy'],
    ['privacy.section1Title', 'سياسة الخصوصية', 'Privacy Policy', 'text', 'privacy'],
    ['privacy.section2Title', 'شروط الاستخدام', 'Terms of Use', 'text', 'privacy'],
    ['privacy.section3Title', 'الشفافية والتقارير', 'Transparency & Reporting', 'text', 'privacy'],
  ];

  // ON CONFLICT DO NOTHING so re-running seed won't duplicate rows (section_key is UNIQUE)
  for (const [section_key, content_ar, content_en, content_type, section_group] of siteRows) {
    await conn.query(
      `INSERT INTO site_content (section_key, content_ar, content_en, content_type, section_group)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (section_key) DO NOTHING`,
      [section_key, content_ar, content_en, content_type, section_group]
    );
  }
  console.log('Site content seeded (' + siteRows.length + ' rows).');

  if (ownConnection) await conn.end();
  console.log('Seed complete.');
}

module.exports = { seed };

// Allow running directly: node server/seed.js
if (require.main === module) {
  seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
