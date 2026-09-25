'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './ProjectModal.css';

const content = {
  en: {
    eyebrow: 'START A CONVERSATION',
    title: 'WHAT NEEDS\nTO CHANGE?',
    intro: "You don't need a perfect brief. Start with the problem.",
    context: 'WHAT NEEDS TO CHANGE?',
    contextHint: "You don't need a perfect brief. Start with the problem.",
    placeholder: "Tell us what's not working, what you're planning, or what you want to improve...",
    help: 'HOW CAN WE HELP?', contact: 'CONTACT DETAILS', budget: 'APPROXIMATE BUDGET', timing: 'WHEN WOULD YOU LIKE TO START?',
    name: 'NAME *', company: 'COMPANY', email: 'EMAIL *', phone: 'PHONE / WHATSAPP (OPTIONAL)',
    submit: 'START A CONVERSATION', reassurance: 'We usually reply within one business day.',
    successTitle: 'YOUR MESSAGE IS READY.', successCopy: 'A ready-to-send email to info@mugranagency.com has opened for you.', close: 'CLOSE',
    errors: { change: 'Tell us a little about what needs to change.', name: 'Please enter your name.', email: 'Please enter a valid email address.' },
    serviceOptions: [['brand', 'Brand'], ['web', 'Web & Digital'], ['creative', 'Creative'], ['ongoing', 'Ongoing Creative Support'], ['unsure', 'Not sure yet']],
    budgetOptions: [['5-10', 'AED 5–10K'], ['10-20', 'AED 10–20K'], ['20-40', 'AED 20–40K'], ['40+', 'AED 40K+'], ['unsure', 'Not sure yet']],
    timingOptions: [['asap', 'As soon as possible'], ['month', 'Within a month'], ['months', '1–3 months'], ['exploring', 'Just exploring']],
  },
  ar: {
    eyebrow: 'ابدأ محادثة',
    title: 'ما الذي يحتاج\nإلى أن يتغيــــــــر؟',
    intro: 'لا تحتاج إلى brief مكتمل. ابدأ بالمشكلة.',
    context: 'ما الذي يحتاج إلى أن يتغيــــــــر؟',
    contextHint: 'لا تحتاج إلى brief مكتمل. ابدأ بالمشكلة.',
    placeholder: 'أخبرنا بما لا يعمل، أو ما الذي تخطط له، أو ما تريد تطويره...',
    help: 'كيف يمكن أن نساعد؟', contact: 'بيانات التواصل', budget: 'الميزانية التقريبية', timing: 'متى ترغب في البدء؟',
    name: 'الاسم *', company: 'الشركة', email: 'البريد الإلكتروني *', phone: 'الهاتف / واتساب (اختياري)',
    submit: 'ابدأ محادثة', reassurance: 'عادةً نرد خلال يوم عمل واحد.',
    successTitle: 'رسالتك جاهزة للإرسال.', successCopy: 'فُتحت رسالة جاهزة إلى info@mugranagency.com في بريدك.', close: 'إغلاق',
    errors: { change: 'أخبرنا قليلاً عمّا يحتاج إلى التغيّر.', name: 'يرجى إدخال الاسم.', email: 'يرجى إدخال بريد إلكتروني صحيح.' },
    serviceOptions: [['brand', 'العلامة'], ['web', 'الويب والتجارب الرقمية'], ['creative', 'الإبداع'], ['ongoing', 'دعم إبداعي مستمر'], ['unsure', 'لست متأكداً بعد']],
    budgetOptions: [['5-10', '5–10 آلاف درهم'], ['10-20', '10–20 ألف درهم'], ['20-40', '20–40 ألف درهم'], ['40+', '40 ألف درهم فأكثر'], ['unsure', 'لست متأكداً بعد']],
    timingOptions: [['asap', 'في أقرب وقت'], ['month', 'خلال شهر'], ['months', 'خلال 1–3 أشهر'], ['exploring', 'أستكشف حالياً']],
  },
};

export default function ProjectModal() {
  const { lang, isRTL, isModalOpen, closeProjectModal, activeChallenge } = useLanguage();
  const locale = lang === 'ar' ? 'ar' : 'en';
  const t = content[locale];
  const [services, setServices] = useState([]);
  const [budget, setBudget] = useState('');
  const [timing, setTiming] = useState('');
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isModalOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event) => event.key === 'Escape' && closeProjectModal();
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isModalOpen, closeProjectModal]);

  useEffect(() => {
    if (!activeChallenge) return;
    const selected = { brand: 'brand', web: 'web', creative: 'creative' }[activeChallenge];
    if (selected) setServices([selected]);
  }, [activeChallenge]);

  if (!isModalOpen) return null;

  const labelFor = (options, value) => options.find(([id]) => id === value)?.[1] || (locale === 'ar' ? 'غير محدد' : 'Not specified');
  const toggleService = (value) => {
    setServices((current) => {
      if (value === 'unsure') return current.includes(value) ? [] : ['unsure'];
      const withoutUnsure = current.filter((item) => item !== 'unsure');
      return withoutUnsure.includes(value) ? withoutUnsure.filter((item) => item !== value) : [...withoutUnsure, value];
    });
  };
  const validate = (data) => {
    const next = {};
    if (!data.get('change')?.trim()) next.change = t.errors.change;
    if (!data.get('name')?.trim()) next.name = t.errors.name;
    if (!/^\S+@\S+\.\S+$/.test(data.get('email')?.trim() || '')) next.email = t.errors.email;
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!validate(data)) return;
    const selectedServices = services.map((value) => labelFor(t.serviceOptions, value)).join(locale === 'ar' ? '، ' : ', ') || (locale === 'ar' ? 'غير محدد' : 'Not specified');
    const message = locale === 'ar'
      ? `الاسم: ${data.get('name')}\nالشركة: ${data.get('company') || 'غير مذكور'}\nالبريد الإلكتروني: ${data.get('email')}\nالهاتف / واتساب: ${data.get('phone') || 'غير مذكور'}\n\nما الذي يحتاج إلى أن يتغيّر؟\n${data.get('change')}\n\nكيف يمكن أن نساعد؟ ${selectedServices}\nالميزانية التقريبية: ${budget ? labelFor(t.budgetOptions, budget) : 'غير محددة'}\nالتوقيت: ${timing ? labelFor(t.timingOptions, timing) : 'غير محدد'}`
      : `Name: ${data.get('name')}\nCompany: ${data.get('company') || 'Not provided'}\nEmail: ${data.get('email')}\nPhone / WhatsApp: ${data.get('phone') || 'Not provided'}\n\nWhat needs to change?\n${data.get('change')}\n\nHow can we help? ${selectedServices}\nApproximate budget: ${budget ? labelFor(t.budgetOptions, budget) : 'Not specified'}\nTiming: ${timing ? labelFor(t.timingOptions, timing) : 'Not specified'}`;
    window.location.href = `mailto:info@mugranagency.com?subject=${encodeURIComponent(locale === 'ar' ? 'محادثة جديدة عبر مُقرن' : 'New conversation via Mugran')}&body=${encodeURIComponent(message)}`;
    setSent(true);
  };

  const ChoiceGroup = ({ options, value, onChange, multiple = false }) => (
    <div className="project-chips">
      {options.map(([id, label]) => {
        const selected = multiple ? value.includes(id) : value === id;
        return <button type="button" className={selected ? 'is-selected' : ''} key={id} onClick={() => onChange(id)} aria-pressed={selected}>{label}</button>;
      })}
    </div>
  );

  return (
    <div className="project-modal" dir={isRTL ? 'rtl' : 'ltr'} role="dialog" aria-modal="true" aria-labelledby="project-title">
      <button className="project-backdrop" aria-label={t.close} onClick={closeProjectModal} />
      <section className="project-panel">
        <header className="project-header">
          <div><p>{t.eyebrow}</p><h2 id="project-title">{t.title}</h2><span>{t.intro}</span></div>
          <button ref={closeRef} className="project-close" onClick={closeProjectModal} aria-label={t.close}>×</button>
        </header>
        {sent ? (
          <div className="project-success"><h3>{t.successTitle}</h3><p>{t.successCopy}</p><button onClick={closeProjectModal}>{t.close}</button></div>
        ) : (
          <form onSubmit={submit} className="project-form" noValidate>
            <section className="project-context">
              <h3>{t.context}</h3><p>{t.contextHint}</p>
              <textarea name="change" rows="5" placeholder={t.placeholder} aria-invalid={Boolean(errors.change)} onChange={() => errors.change && setErrors((current) => ({ ...current, change: undefined }))} />
              {errors.change && <small className="field-error">{errors.change}</small>}
            </section>
            <fieldset><legend>{t.help}</legend><ChoiceGroup options={t.serviceOptions} value={services} onChange={toggleService} multiple /></fieldset>
            <fieldset className="project-contact"><legend>{t.contact}</legend><div className="project-contact-grid">
              <label>{t.name}<input name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} onChange={() => errors.name && setErrors((current) => ({ ...current, name: undefined }))} />{errors.name && <small className="field-error">{errors.name}</small>}</label>
              <label>{t.company}<input name="company" autoComplete="organization" /></label>
              <label>{t.email}<input name="email" type="email" dir="ltr" autoComplete="email" aria-invalid={Boolean(errors.email)} onChange={() => errors.email && setErrors((current) => ({ ...current, email: undefined }))} />{errors.email && <small className="field-error">{errors.email}</small>}</label>
              <label>{t.phone}<input name="phone" type="tel" dir="ltr" autoComplete="tel" /></label>
            </div></fieldset>
            <fieldset><legend>{t.budget} <small>{locale === 'ar' ? '(اختياري)' : '(OPTIONAL)'}</small></legend><ChoiceGroup options={t.budgetOptions} value={budget} onChange={setBudget} /></fieldset>
            <fieldset><legend>{t.timing} <small>{locale === 'ar' ? '(اختياري)' : '(OPTIONAL)'}</small></legend><ChoiceGroup options={t.timingOptions} value={timing} onChange={setTiming} /></fieldset>
            <footer className="project-submit"><button type="submit">{t.submit} <span aria-hidden="true">↗</span></button><small>{t.reassurance}</small></footer>
          </form>
        )}
      </section>
    </div>
  );
}
