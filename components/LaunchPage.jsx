'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { businessIdentity } from '../lib/businessIdentity';
import LaunchEnquiry from './launch/LaunchEnquiry';
import LaunchFAQ from './launch/LaunchFAQ';
import useLaunchMotion from './launch/useLaunchMotion';
import LaunchIcon from './launch/LaunchIcon';
import CampaignGallery from './launch/CampaignGallery';
import BeforeAfterSlider from './launch/BeforeAfterSlider';
import './LaunchPage.css';

const asset = (name) => `/images/launch/${name}`;

function Artwork({ name, alt = '', className = '', node, eager = false, children }) {
  return <div className={`lf-art ${className}`} data-node-id={node}>
    <img src={asset(`${name}.png`)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    {children}
  </div>;
}

function CTA({ children, onClick, hero = false, node }) {
  const classes = `lf-button ${hero ? 'lf-button-hero' : ''}`;
  return hero
    ? <a className={classes} href="#launch-offers" data-node-id={node}><span>{children}</span><LaunchIcon /></a>
    : <button className={classes} onClick={onClick} type="button" data-node-id={node}><span>{children}</span><LaunchIcon /></button>;
}

const landingDeliverables = [
  'Custom design and development',
  'Mobile-ready layout · up to six sections',
  'SEO optimization for better search rankings',
  'WhatsApp integration or one basic enquiry form',
  'One consolidated revision round',
];
const campaignDeliverables = [
  'Five premium static product images',
  'One agreed creative direction',
  'Consistent social-ready image formats',
  'One consolidated revision round',
];

function Pricing({ campaign = false, onChoose }) {
  return <section className={`lf-pricing ${campaign ? 'lf-campaign-pricing' : ''}`} data-motion={campaign ? 'campaign-pricing' : 'landing-pricing'} aria-label={campaign ? 'Mini Product Campaign pricing' : 'Landing Page pricing'}>
    <div className="lf-pricing-scene" data-node-id={campaign ? '791:2069' : '791:2031'}>
      <Artwork name={campaign ? 'campaign-pricing-plate' : 'landing-pricing-plate'} className="lf-pricing-background" />
      <div className="lf-price-panel" data-node-id={campaign ? '791:2071' : '791:2032'}>
        <p className="lf-price-note">{campaign ? 'Five visuals. One cohesive creative direction.' : 'Designed and built in 48 hours after project kickoff. '}</p>
        <p className="lf-price"><strong>{campaign ? '599' : '899'}</strong><span>AED</span></p>
        <ul className="lf-deliverables">{(campaign ? campaignDeliverables : landingDeliverables).map(text => <li key={text}><LaunchIcon name={campaign ? 'elements6' : 'elements5'} /><span>{text}</span></li>)}</ul>
        <CTA onClick={onChoose}>{campaign ? 'Start My Mini Campaign' : 'Start My Landing Page'}</CTA>
      </div>
    </div>
  </section>;
}

export default function LaunchPage() {
  const root = useRef(null);
  const enquiry = useRef(null);
  const { setLanguage } = useLanguage();
  useEffect(() => {
    setLanguage('en');
    const openEnquiry = () => enquiry.current?.open();
    window.addEventListener('mugran:launch-enquiry', openEnquiry);
    return () => window.removeEventListener('mugran:launch-enquiry', openEnquiry);
  }, [setLanguage]);
  useLaunchMotion(root);
  const choose = (service) => enquiry.current?.open(service);

  return <div className="launch-page" dir="ltr" ref={root} data-figma-frame="792:2130">
    <section className="lf-hero" data-motion="hero" data-node-id="787:1095" aria-labelledby="launch-title">
      <div className="lf-hero-content">
        <div className="lf-hero-top">
          <h1 id="launch-title" className="lf-heading lf-hero-heading" data-node-id="787:1099">Your next big move<br />Starts here.</h1>
          <div className="lf-hero-description">
            <p data-node-id="787:1101">Get a premium landing page or a product campaign built around your business. Clear deliverables. Straightforward pricing. No unnecessary agency process.</p>
            <div className="lf-hero-actions">
              <CTA hero node="787:1119">Explore the Offers</CTA>
              <nav className="lf-socials" aria-label="Mugran social profiles">
                {['LinkedIn', 'Facebook', 'TikTok', 'Instagram'].map((name, i) => <a key={name} href={businessIdentity.socialProfiles.find(profile => profile.name === name).url} target="_blank" rel="noopener noreferrer" aria-label={`Mugran on ${name}`}><LaunchIcon name={`elements${i + 1}`} className={`lf-social-${name.toLowerCase()}`} /></a>)}
              </nav>
            </div>
          </div>
        </div>
        <Artwork name="ghostly-hand-behind-blue-glass1" alt="A silhouette and hand behind frosted blue glass" className="lf-hero-image" node="787:1096" eager><div className="lf-hero-tint" /></Artwork>
      </div>
    </section>

    <section className="lf-statement" data-motion="statement" data-node-id="787:1373" aria-labelledby="statement-title">
      <Artwork name="six-frame-blue-glow-animation1" className="lf-statement-background" />
      <Artwork name="4" className="lf-statement-product lf-statement-product-one" />
      <Artwork name="7" className="lf-statement-product lf-statement-product-two" />
      <Artwork name="6" className="lf-statement-product lf-statement-product-three" />
      <h2 className="lf-heading" id="statement-title" data-node-id="787:1376">A great product deserves a better first impression.</h2>
      <div className="lf-statement-copy" data-node-id="788:1413"><p>You’ve put time into your business. But a weak landing page or inconsistent campaign visuals can make even a great offer easy to overlook.</p><p>You don’t always need a bigger marketing budget. Sometimes, you need a better place to send your customers — or better creative to bring them there.</p></div>
    </section>

    <div id="launch-offers" className="lf-service" data-node-id="789:1421">
      <section className="lf-landing-showcase" data-motion="landing-showcase" aria-labelledby="landing-title">
        <header className="lf-service-header" data-node-id="789:1921"><h2 id="landing-title" className="lf-heading"><span className="lf-text-line">A landing page</span><br /><span className="lf-text-line">worth landing on.</span></h2><p>One focused page that presents your business clearly, builds confidence, and makes it easy for visitors to take action.</p></header>
        <div className="lf-laptop-panel" data-node-id="789:1922" />
        <div className="lf-laptop-position" data-node-id="789:1458"><div className="lf-laptop-angle"><div className="lf-laptop-depth"><Artwork name="free-mac-book-pro-proled-xdr-display-mockup" alt="Laptop displaying the fragrance landing page, A scent that stays with you" className="lf-laptop-crop" /></div></div></div>
      </section>
      <Pricing onChoose={() => choose('landing')} />
    </div>

    <div className="lf-service" data-node-id="791:2068">
      <section className="lf-campaign-showcase" data-motion="campaign-showcase" aria-labelledby="campaign-title">
        <header className="lf-service-header" data-node-id="791:2095"><h2 id="campaign-title" className="lf-heading">Mini Product<br />Campaign</h2><p>Five carefully art-directed campaign visuals that give your product a more compelling presence across your digital channels.</p></header>
        <CampaignGallery />
      </section>
      <section className="lf-comparison" aria-labelledby="comparison-title">
        <header className="lf-comparison-header">
          <p className="lf-comparison-eyebrow">THE DIFFERENCE</p>
          <h2 id="comparison-title" className="lf-heading">Same product. Different perception.</h2>
          <p>See how considered art direction can transform the way a product is presented.</p>
        </header>
        <BeforeAfterSlider before={asset('b.png')} after={asset('af.png')} />
      </section>
      <Pricing campaign onChoose={() => choose('campaign')} />
    </div>

    <section id="launch-work" className="lf-work" data-motion="work" data-node-id="792:2131" aria-labelledby="work-title">
      <header className="lf-work-header"><h2 id="work-title" className="lf-heading">The details<br />make the difference.</h2><p>Every composition, color, and detail is considered. Because how your brand looks shapes how people see it.</p></header>
      <div className="lf-work-grid" data-node-id="805:2189">
        <Artwork name="rectangle1" alt="Sauvage fragrance bottle on wet stone in blue light" className="lf-work-fragrance" node="802:2178" />
        <div className="lf-work-right"><Artwork name="rectangle4" alt="Cinematic blue campaign image of a woman on a subway platform" className="lf-work-cinema" node="802:2179" /><div className="lf-work-bottom"><Artwork name="rectangle9" alt="Red-lit product campaign for whey protein" className="lf-work-protein" node="802:2180" /><Artwork name="rectangle10" alt="Purple-lit rugged smartwatch campaign" className="lf-work-watch" node="802:2181" /></div></div>
      </div>
    </section>

    <section className="lf-kit" data-motion="kit" data-node-id="810:2220" aria-labelledby="kit-title">
      <div className="lf-kit-copy" data-node-id="810:2249"><h2 id="kit-title" className="lf-heading">Complete<br />Launch Kit</h2><p>One custom landing page + five premium product campaign visuals.</p><div className="lf-kit-commercial"><p className="lf-kit-price"><strong>1299</strong><span>AED</span></p><p className="lf-kit-saving">Save 199 AED</p></div><CTA onClick={() => choose('kit')} node="810:2334">Get the Complete Kit</CTA></div>
      <div className="lf-kit-art" data-node-id="810:2270"><div className="lf-kit-depth"><div className="lf-kit-panel" />
        <Artwork name="rectangle5" className="lf-kit-campaign lf-kit-campaign-one" />
        <Artwork name="rectangle1" className="lf-kit-campaign lf-kit-campaign-two" />
        <Artwork name="rectangle2" className="lf-kit-campaign lf-kit-campaign-three" />
        <Artwork name="rectangle6" className="lf-kit-campaign lf-kit-campaign-four" />
        <Artwork name="rectangle7" className="lf-kit-campaign lf-kit-campaign-five" />
        <Artwork name="pixel-book-go" alt="Complete launch kit combining the fragrance landing page with the five campaign images" className="lf-kit-laptop" node="810:2271" />
      </div>
      </div>
    </section>

    <LaunchFAQ />

    <section className="lf-final" data-motion="final" data-node-id="805:2190" aria-labelledby="final-title">
      <Artwork name="8" className="lf-final-background" />
      <div className="lf-final-content"><h2 id="final-title" className="lf-heading">Let’s make something<br />worth clicking.</h2><p>Tell us what you’re launching. We’ll help you find the right starting point.</p><CTA onClick={() => choose()} node="810:2204">Start a Project</CTA></div>
    </section>
    <LaunchEnquiry ref={enquiry} />
  </div>;
}
