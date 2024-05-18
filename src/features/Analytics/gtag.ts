export const GA_TRACKING_ID = 'GTM-P5PTJTB';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  try {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  } catch (error) {
    // Dismiss gtag event error
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: Record<string, string>) => {
  try {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } catch (error) {
    // Dismiss gtag event error
  }
};
