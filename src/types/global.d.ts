// Declaring this interface provides type safety for message keys
type Messages = typeof import('../i18n/locales/zh.json');
declare interface IntlMessages extends Messages {}
