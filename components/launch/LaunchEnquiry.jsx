'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { businessIdentity } from '../../lib/businessIdentity';

export const launchServices = [
  { id: 'landing', label: '48H Landing Page — AED 899' },
  { id: 'campaign', label: 'Mini Product Campaign — AED 599' },
  { id: 'kit', label: 'Complete Launch Kit — AED 1,299' },
];

const LaunchEnquiry = forwardRef(function LaunchEnquiry(_, ref) {
  const dialog = useRef(null);
  const form = useRef(null);
  const [service, setService] = useState('landing');
  const [errors, setErrors] = useState({});
  const [handoff, setHandoff] = useState(null);
  const [busy, setBusy] = useState(false);
  const previousOverflow = useRef('');
  useEffect(() => {
    const element = dialog.current;
    return () => { if (element?.open) document.body.style.overflow = previousOverflow.current; };
  }, []);

  useImperativeHandle(ref, () => ({ open(selected) {
    if (selected) setService(selected);
    setErrors({});
    setHandoff(null);
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    form.current.elements.namedItem('name').focus();
  } }), []);

  function close() {
    dialog.current.close();
    document.body.style.overflow = previousOverflow.current;
  }

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button:not(:disabled), input, select, textarea, a[href]')].filter(element => element.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = {};
    for (const name of ['name', 'brand', 'contact']) if (!data.get(name)?.trim()) next[name] = 'Please complete this field.';
    const contact = data.get('contact').trim();
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const phone = /^\+?[\d\s().-]{7,25}$/.test(contact) && contact.replace(/\D/g, '').length >= 7;
    if (contact && !email && !phone) next.contact = 'Enter a valid email address or WhatsApp number, including country code.';
    const selected = launchServices.find(item => item.id === service);
    if (!selected) next.service = 'Choose a service.';
    setErrors(next);
    if (Object.keys(next).length) {
      form.current.elements.namedItem(Object.keys(next)[0])?.focus();
      return;
    }
    setBusy(true);
    const message = ['Hello Mugran Creative, I would like to enquire about your launch services.',
      `Service: ${selected.label}`, `Name: ${data.get('name').trim()}`, `Business / Brand: ${data.get('brand').trim()}`,
      `Contact: ${contact}`, `Website / Instagram: ${data.get('website').trim() || 'Not supplied'}`,
      `Project: ${data.get('description').trim() || 'To discuss'}`].join('\n');
    const url = `${businessIdentity.whatsapp.url}?text=${encodeURIComponent(message)}`;
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    setHandoff({ url, blocked: !opened, email: `mailto:${businessIdentity.email}?subject=${encodeURIComponent(`Launch enquiry: ${selected.label}`)}&body=${encodeURIComponent(message)}` });
    setBusy(false);
  }

  return <dialog ref={dialog} className="lf-enquiry" aria-labelledby="launch-enquiry-title" onKeyDown={trapFocus} onCancel={event => { event.preventDefault(); close(); }} onClose={() => { document.body.style.overflow = previousOverflow.current; }} onClick={event => { if (event.target === dialog.current) { const box = dialog.current.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close(); } }}>
    <div className="lf-enquiry-content"><button type="button" className="lf-dialog-close" onClick={close} aria-label="Close project enquiry">×</button>
      <h2 id="launch-enquiry-title">Start a Project</h2>
      <p>This form prepares your enquiry in WhatsApp. Review the message and press Send there to submit it. No payment is collected here.</p>
      <form ref={form} onSubmit={submit} onChange={() => setHandoff(null)} noValidate>
        {[['name', 'Full Name', 'name'], ['brand', 'Business / Brand Name', 'organization'], ['contact', 'WhatsApp Number or Email', 'off']].map(([name, label, autoComplete]) => <label key={name} htmlFor={`launch-${name}`}>{label} *<input name={name} id={`launch-${name}`} required autoComplete={autoComplete} maxLength={160} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `launch-${name}-error` : undefined} />{errors[name] && <span id={`launch-${name}-error`} className="lf-error">{errors[name]}</span>}</label>)}
        <label htmlFor="launch-service">Selected Service *<select id="launch-service" name="service" required value={service} onChange={event => setService(event.target.value)}>{launchServices.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label htmlFor="launch-website">Website or Instagram URL (optional)<input id="launch-website" name="website" autoComplete="url" maxLength={300} /></label>
        <label htmlFor="launch-description">Short project description (optional)<textarea id="launch-description" name="description" rows={3} maxLength={2000} /></label>
        <button type="submit" className="lf-form-submit" disabled={busy}>{busy ? 'Preparing your enquiry…' : 'Continue in WhatsApp'}</button>
        {Object.keys(errors).length > 0 && <p role="alert" className="lf-error">Please check the highlighted fields.</p>}
        {handoff && <div className="lf-handoff" role="status"><p>{handoff.blocked ? 'Your browser may have blocked WhatsApp. Open your prepared message below.' : 'WhatsApp was requested in a new tab. Your enquiry has not been sent yet: press Send in WhatsApp to finish.'}</p><a href={handoff.url} target="_blank" rel="noopener noreferrer">Open prepared WhatsApp message</a><a href={handoff.email}>Or prepare the same enquiry by email</a></div>}
      </form>
      <a className="lf-enquiry-direct" href={businessIdentity.whatsapp.url} target="_blank" rel="noopener noreferrer">Contact Mugran directly on WhatsApp</a>
    </div>
  </dialog>;
});

export default LaunchEnquiry;
