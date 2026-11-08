'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap, ScrollTrigger } from './motionRuntime';
import LaunchIcon from './LaunchIcon';

const questions = [
  ['How much does a landing page cost in Dubai?', 'Mugran Creative offers custom landing page design and development for AED 899. The package includes one mobile-responsive page with up to six sections, a WhatsApp or basic enquiry form integration, essential on-page SEO, and one revision round. Domain, hosting, and additional services are priced separately.'],
  ['Can you build a landing page in 48 hours?', 'Yes. Our 48-hour landing page service is available for projects that fit the package scope. The timeline begins once your brief, content, brand assets, required access, and 50% deposit are received and the project is confirmed.'],
  ['What is included in the AED 599 Mini Product Campaign?', 'Our Mini Product Campaign includes five premium static product visuals created around one cohesive creative direction. You receive social-media-ready images and one consolidated revision round. Video production and physical photoshoots are not included.'],
  ['Do I need professional product photos to get started?', "You can start by sharing your existing product images, logo, and brand guidelines. We'll review the materials to confirm they're suitable for creating your campaign. Additional photography or extensive product retouching may require a separate quote."],
  ['Will my landing page be mobile-friendly and SEO-ready?', 'Yes. Every landing page is designed to work across desktop and mobile devices. We also include basic on-page SEO, such as page titles, meta descriptions, and a clear heading structure. Search engine rankings and traffic results are not guaranteed.'],
  ['Are domain registration and website hosting included?', "No. Domain registration, hosting, premium software, and other third-party subscriptions are separate from the AED 899 landing page package. We can help you understand what's needed before launch."],
  ['Do I have to pay the full amount upfront?', "No. A 50% deposit is required to begin your project. The remaining balance is due before final delivery. We'll confirm the project scope and payment terms before starting."],
  ['Can I order a landing page and product campaign together?', "Absolutely. Our Complete Launch Kit combines one custom landing page with five premium product campaign visuals for AED 1,299. That's AED 199 less than purchasing the two services separately."],
];

function FAQRow({ question, answer, index }) {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const animation = useRef(null);
  useEffect(() => () => animation.current?.kill(), []);

  function toggle(event) {
    event.preventDefault();
    const details = event.currentTarget.parentElement;
    const element = panel.current;
    animation.current?.kill();
    const expanding = !open;
    setOpen(expanding);
    if (expanding) details.open = true;
    element.inert = !expanding;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      details.open = expanding;
      gsap.set(element, { clearProps: 'height,opacity,overflow' });
      ScrollTrigger.refresh();
      return;
    }
    const fromHeight = expanding && !element.style.height ? 0 : element.getBoundingClientRect().height;
    animation.current = gsap.fromTo(element,
      { height: fromHeight, opacity: expanding ? 0 : 1, overflow: 'hidden' },
      { height: expanding ? element.scrollHeight : 0, opacity: expanding ? 1 : 0, duration: .35, ease: 'power2.out', onComplete: () => {
        details.open = expanding;
        gsap.set(element, { clearProps: 'height,opacity,overflow' });
        ScrollTrigger.refresh();
      } },
    );
  }

  return <details className="lf-faq-row">
    <summary id={`launch-question-${index}`} aria-controls={`launch-answer-${index}`} aria-expanded={open} onClick={toggle}><h3>{question}</h3><LaunchIcon name="elements7" /></summary>
    <div ref={panel} id={`launch-answer-${index}`} className="lf-faq-answer" role="region" aria-labelledby={`launch-question-${index}`}><p>{answer}</p></div>
  </details>;
}

export default function LaunchFAQ() {
  return <section className="lf-faq" data-motion="faq" data-node-id="810:2339" aria-labelledby="faq-title"><div className="lf-faq-layout"><h2 id="faq-title" className="lf-heading">A few things<br />worth knowing.</h2><div className="lf-faq-list">{questions.map(([question, answer], index) => <FAQRow key={question} question={question} answer={answer} index={index} />)}</div></div></section>;
}
