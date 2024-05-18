export const linkBlank = (href: string) => {
  if (!href) return;
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.click();
  return a.remove();
};
