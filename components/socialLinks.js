export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/mugranagency', ariaLabel: 'Mugran on Instagram' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@mugranagency', ariaLabel: 'Mugran on TikTok' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/mugranagency/', ariaLabel: 'Mugran on LinkedIn' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61594199871461', ariaLabel: 'Mugran on Facebook' },
  { name: 'WhatsApp', href: 'https://wa.me/971502675375', ariaLabel: 'Mugran on WhatsApp' },
];

export const followSocialLinks = socialLinks.filter(({ name }) => name !== 'WhatsApp');
export const mobileSocialLinks = socialLinks.map(({ name, href, ariaLabel }) => [name, href, ariaLabel]);
export const contactSocialLinks = followSocialLinks.map(({ name, href }) => [name, href]);
