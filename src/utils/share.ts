type ShareUtilParams = Partial<Record<string, string>>;

export const shareUtil = {
  getFacebookShareUrl: ({ url }: ShareUtilParams) =>
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  getTwitterShareUrl: ({ url, text }: ShareUtilParams) =>
    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
  getGooglePlusShareUrl: ({ url, text }: ShareUtilParams) =>
    `https://plus.google.com/share?url=${url}&text=${text}`,
  /** FIXME 暂未提供 */
  getDiscordShareUrl: ({ url, text }: ShareUtilParams) =>
    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
};
