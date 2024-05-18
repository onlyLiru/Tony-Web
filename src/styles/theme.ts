import { extendTheme } from '@chakra-ui/react';
import type { ComponentStyleConfig } from '@chakra-ui/react';

const Link: ComponentStyleConfig = {
  // style object for base or default style
  defaultProps: {
    textDecoration: 'none',
  },
};

const Heading: ComponentStyleConfig = {
  baseStyle: {
    fontFamily: 'Inter',
  },
  defaultProps: {
    color: 'primary.main',
  },
};

const Button: ComponentStyleConfig = {
  baseStyle: {
    fontFamily: 'Urbanist',
  },
  variants: {
    primary: {
      bg: 'primary.main',
      color: 'white',
      _hover: {
        bg: '#444',
      },
      _disabled: {
        _hover: {
          bg: '#444 !important',
        },
      },
    },
    outline: {
      color: 'primary.main',
      borderColor: 'primary.main',
      bg: 'white',
      _hover: {
        bg: 'white',
        opacity: 0.8,
      },
    },
    outline2border: {
      color: 'primary.main',
      borderColor: 'primary.gray',
      bg: 'white',
      borderWidth: '2px',
      _hover: {
        bg: 'white',
        borderColor: 'primary.main',
        opacity: 0.8,
      },
    },
  },
  sizes: {
    xl: {
      h: '60px',
      fontSize: 'md',
      minWidth: '160px',
    },
    lg: {
      fontSize: 'md',
    },
  },
};

const Input: ComponentStyleConfig = {
  baseStyle: {
    field: {
      border: '2px solid',
      borderWidth: '2px',
      borderColor: 'primary.gray',
      color: 'primary.main',
      fontWeight: 400,
      lineHeight: '19px',
      _placeholder: {
        color: 'primary.deepGray',
      },
      _hover: {
        borderColor: 'gray.300',
      },
      _focusVisible: {
        borderColor: 'primary.main',
      },
      _invalid: {
        borderColor: 'red.500',
      },
    },
  },
  variants: {
    setting: {
      field: {
        height: '56px',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        color: 'primary.main',
        fontWeight: 400,
        fontSize: '20px',
        lineHeight: '30px',
        _placeholder: {
          color: 'primary.deepGray',
        },
        _hover: {
          borderColor: 'gray.300',
        },
        _focusVisible: {
          borderColor: 'primary.main',
        },
        _invalid: {
          borderColor: 'red.500',
        },
      },
    },
  },
  defaultProps: {
    variant: null,
  },
};

const Select: ComponentStyleConfig = {
  baseStyle: {
    field: {
      border: '2px solid',
      borderWidth: '2px',
      borderColor: 'primary.gray',
      color: 'primary.main',
      fontSize: 'md',
      _hover: {
        borderColor: 'gray.300',
      },
      _focusVisible: {
        borderColor: 'primary.main',
      },
      _invalid: {
        borderColor: 'red.500',
      },
    },
  },
  defaultProps: {
    variant: null,
  },
};

const NumberInput: ComponentStyleConfig = {
  baseStyle: {
    field: {
      border: '2px solid',
      borderWidth: '2px',
      borderColor: 'primary.gray',
      color: 'primary.main',
      _hover: {
        borderColor: 'gray.300',
      },
      _focusVisible: {
        borderColor: 'primary.main',
      },
      _invalid: {
        borderColor: 'red.500',
      },
    },
  },
  variants: {
    mint: {
      field: {
        border: '1px solid',
        borderWidth: '1px',
        borderColor: 'rgba(235, 235, 235, 0.2)',
        color: '#B6B6B6',
        bg: 'transparent',
        rounded: '4px',
      },
    },
  },
  defaultProps: {
    variant: null,
  },
};

const Textarea: ComponentStyleConfig = {
  baseStyle: {
    border: '2px solid',
    borderWidth: '2px',
    borderColor: 'primary.gray',
    color: 'primary.main',
    _hover: {
      borderColor: 'gray.300',
    },
    _focusVisible: {
      borderColor: 'primary.main',
    },
    _invalid: {
      borderColor: 'red.500',
    },
  },
  defaultProps: {
    variant: null,
  },
};

const Switch: ComponentStyleConfig = {
  baseStyle: {
    track: {
      _checked: {
        bg: 'primary.main',
      },
    },
  },
};

const Checkbox: ComponentStyleConfig = {
  baseStyle: {
    control: {
      bg: 'transparent',
      border: '1px solid #000',
      borderRadius: '4px',
      _checked: {
        bg: '#000 !important',
        borderColor: '#000',
      },
      _hover: {
        bg: 'transparent',
      },
      _focusVisible: {
        boxShadow: 'none',
      },
    },
  },
  variants: {
    row: {
      container: {
        display: 'flex',
        w: 'full',
      },
      label: {
        display: 'flex',
        flexGrow: 1,
      },
    },
  },
  sizes: {
    md: {
      w: '20px',
      h: '20px',
    },
  },
};

const Form: ComponentStyleConfig = {
  baseStyle: {
    container: {
      // fontFamily: 'Urbanist',
      fontFamily: 'Inter',
      fontSize: 'md',
      lineHeight: '19px',
      fontStyle: 'normal',
    },
    helperText: {
      fontWeight: 400,
      color: 'primary.lightGray',
      fontSize: 'md',
    },
  },
};

const FormLabel: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 600,
    color: 'primary.main',
    fontSize: 'md',
  },
  variants: {
    setting: {
      fontFamily: 'PingFang HK',
      fontSize: '24px',
      lineHeight: '30px',
      mb: '12px',
    },
    settingMobile: {
      fontFamily: 'PingFang HK',
      fontSize: '16px',
      lineHeight: '17px',
      mb: '16px',
    },
  },
};

const Alert: ComponentStyleConfig = {
  baseStyle: {
    container: {
      bottom: '20px',
    },
  },
  variants: {},
  defaultProps: {
    variant: null,
  },
};

const Progress: ComponentStyleConfig = {
  variants: {
    orange2: {
      color: '#FE7A04',
      bg: '#FE7A04',
    },
  },
};

const Modal: ComponentStyleConfig = {
  variants: {
    right: {
      dialogContainer: {
        pr: '6px',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
    },
  },
};

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      },
      a: {
        _active: {
          textDecoration: 'none !important',
        },
        _hover: {
          textDecoration: 'none !important',
        },
      },
    },
  },
  components: {
    Link,
    Button,
    Input,
    NumberInput,
    Select,
    Textarea,
    Heading,
    Form,
    FormLabel,
    Switch,
    Alert,
    Progress,
    Checkbox,
    Modal,
  },
  colors: {
    /**
     * Custom color palette
     * @see https://www.figma.com/file/DFF5bdGi32SlPXLeBEa9nA/UNE-design?node-id=2342%3A1117
     */
    primary: {
      main: '#14141f',
      blue: '#1f2148',
      black: '#161c21',
      gray: '#e5e8eb',
      deepGray: '#b5b5b5',
      lightGray: '#8C8C8C',
      sec: '#8C8C8C', // secondary
    },
    secondary: {
      indego: '#7360fa',
      green: '#29c6b8',
      lightGreen: '#00feb8',
      blue: '#4285F4',
    },
    typo: {
      white: '#fff',
      sec: '#777e90',
      gray: '#2c2f62',
      black: '#14141f',
    },
    accent: {
      blue: '#4284f4',
      yellow: '#ffab09',
      green: '#00da8b',
      red: '#f178b6',
      indigo: '#5b46df',
    },
  },
  sizes: {
    draft: '1280px',
  },
});
