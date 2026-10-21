import { businessIdentity } from '../lib/businessIdentity';

export const socialLinks = [
  ...businessIdentity.socialProfiles.map(({ name, url }) => ({ name, href: url, ariaLabel: `Mugran on ${name}` })),
  { name: 'WhatsApp', href: businessIdentity.whatsapp.url, ariaLabel: 'Mugran on WhatsApp' },
];

export const followSocialLinks = socialLinks.filter(({ name }) => name !== 'WhatsApp');
export const mobileSocialLinks = socialLinks.map(({ name, href, ariaLabel }) => [name, href, ariaLabel]);
export const contactSocialLinks = followSocialLinks.map(({ name, href }) => [name, href]);
