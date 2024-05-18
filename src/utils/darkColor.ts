export const darkText = {
  bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
  textShadow:
    '0px 0px 6px rgba(255, 230, 0, 0.7), 0px 0px 20px rgba(255, 230, 0, 0.5);',
  filter: 'blur(0.3px)',
  backgroundClip: 'text',
  textFillColor: 'transparent',
};

export const darkBg = 'rgba(10, 10, 37)';

export const darkLine = {
  bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
  boxShadow:
    '0px 0px 6px rgba(255, 230, 0, 0.7), 0px 0px 20px rgba(255, 230, 0, 0.5), inset 0px 0px 4px rgba(255, 230, 0, 0.5)',
  borderRadius: '5px',
};

export const darkLabelColor = '#fff';
export const darkHover = {
  boxShadow: 'inset 0px 0px 4px rgba(255, 230, 0, 0.5)',
  filter:
    'blur(0.3px) drop-shadow(0px 0px 6px rgba(255, 230, 0, 0.7)) drop-shadow(0px 0px 20px rgba(255, 230, 0, 0.5));',
};

export const darkButton = {
  normal: {
    bg: {
      active: '#E49F5C',
      notActive: 'transparent',
    },
    color: {
      active: '#000',
      notActive: 'rgba(255, 255, 255, 0.80)',
    },
    textShadow: {
      active: '',
      notActive: '',
    },
    borderColor: {
      active: '#E49F5C',
      notActive: 'rgba(255, 255, 255, 0.10)',
    },
    backgroundClip: {
      active: '',
      notActive: '',
    },
    textFillColor: {
      active: '',
      notActive: '',
    },
    hover: {
      bg: '#E49F5C',
      color: '#000',
    },
  },
  dark: {
    bg: {
      active:
        'linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
      notActive: '',
    },
    color: {
      active: 'white',
      notActive: 'white',
    },
    textShadow: {
      active:
        '0px 0px 6px rgba(255, 230, 0, 0.7), 0px 0px 20px rgba(255, 230, 0, 0.5);',
      notActive: '',
    },
    borderColor: {
      active: '',
      notActive: '',
    },
    backgroundClip: {
      active: 'text',
      notActive: '',
    },
    textFillColor: {
      active: ' transparent',
      notActive: '',
    },
    hover: {
      bg: '',
      color: '',
      ...darkHover,
    },
  },
};

export const darkBuy = {
  textShadow:
    '0px 0px 6px rgba(255, 230, 0, 0.7), 0px 0px 20px rgba(255, 230, 0, 0.5)',
  filter: 'blur(0.3px)',
};
