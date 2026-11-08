'use client';

import { useRef } from 'react';
import useCampaignMotion from './useCampaignMotion';

const images = [
  ['rectangle5', 'Fragrance campaign: a bottle held against a tailored shirt', 'one', '792:2115'],
  ['rectangle1', 'Fragrance campaign: bottle on dark stone in blue light', 'two', '791:2094'],
  ['rectangle2', 'Fragrance campaign: bottle and luminous blue ribbons', 'three', '792:2113'],
  ['rectangle6', 'Fragrance campaign: bottle in a dark architectural setting', 'four', '792:2114'],
  ['rectangle7', 'Fragrance campaign: bottle on a blue studio surface', 'five', '792:2118'],
];

function CampaignImage({ image, index, duplicate = false }) {
  const [name, alt, position, node] = image;
  return <div className={`lf-campaign-slot ${duplicate ? 'lf-campaign-copy' : `lf-campaign-visual lf-campaign-visual-${position}`}`}
    data-campaign-index={index} data-node-id={duplicate ? undefined : node} aria-hidden={duplicate ? 'true' : undefined} hidden={duplicate}>
    <div className="lf-campaign-loop"><div className="lf-campaign-intro"><div className="lf-art lf-campaign-mask">
      <img src={`/images/launch/${name}.png`} alt={duplicate ? '' : alt} loading="lazy" decoding="async" />
    </div></div></div>
  </div>;
}

export default function CampaignGallery() {
  const gallery = useRef(null);
  useCampaignMotion(gallery);
  return <div ref={gallery} className="lf-campaign-gallery" data-node-id="792:2120" data-campaign-state="static">
    <div className="lf-art lf-campaign-source" data-node-id="792:2121"><img src="/images/launch/7.png" alt="Original fragrance product on a light background" loading="lazy" decoding="async" /></div>
    <div className="lf-campaign-window" role="group" tabIndex={0} aria-label="Five campaign visuals. Focus pauses motion. Press Space to keep it paused or resume.">
      {images.map((image, index) => <CampaignImage image={image} index={index} key={image[0]} />)}
      {images.map((image, index) => <CampaignImage image={image} index={index} key={`${image[0]}-copy`} duplicate />)}
    </div>
  </div>;
}
