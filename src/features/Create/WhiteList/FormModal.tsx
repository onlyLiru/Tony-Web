import { useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  NumberInput,
  NumberInputField,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Switch,
  Button,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useUserDataValue } from '@/store';
import { addressReg } from '@/utils';

export interface SpecificBuyerType {
  wallet_address: string;
  num: number;
  price: number;
  free_mint: boolean;
}

interface WhiteListFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (p: SpecificBuyerType[]) => void;
  whiteList: SpecificBuyerType[];
}

const itemInitialValues = {
  wallet_address: '',
  num: 1,
  price: 0,
  free_mint: true,
};

export const WhiteListFormModal = ({
  isOpen,
  onClose,
  onAdd,
  whiteList,
}: WhiteListFormModalProps) => {
  const userData = useUserDataValue();
  const whiteListForm = useFormik<{ white_list: SpecificBuyerType[] }>({
    initialValues: { white_list: [itemInitialValues] },
    validate: async (values) => {
      const errors: any = {};
      if (values.white_list.length) {
        const addressArr = values.white_list.map((v) => v.wallet_address);
        errors.white_list = values.white_list.reduce(
          (obj: any, v, i, addressArr) => {
            // 地址错误
            if (!addressReg.test(v.wallet_address)) {
              obj[i] = 'Royalties Address is not invalid';
            }
            return obj;
          },
          {},
        );
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log(values.white_list, 'whiteListForm');
      onAdd(values.white_list.filter((v) => v.wallet_address));
      onClose();
      whiteListForm.resetForm();
    },
  });

  useEffect(() => {
    if (isOpen && whiteList.length) {
      whiteListForm.setValues({
        white_list: whiteList,
      });
    }
  }, [isOpen]);

  const handleAdd = () => {
    whiteListForm.setFieldValue('white_list', [
      ...whiteListForm.values.white_list,
      itemInitialValues,
    ]);
  };

  const handleDelete = (index: number) => {
    const arr = whiteListForm.values.white_list.filter((v, i) => i !== index);
    whiteListForm.setFieldValue('white_list', arr);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add specific buyer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={whiteListForm.handleSubmit}>
            {whiteListForm.values.white_list.map((v, i) => (
              <Stack key={i}>
                <FormControl
                  isInvalid={
                    !!(
                      v.wallet_address &&
                      whiteListForm.errors.white_list &&
                      whiteListForm.errors.white_list[i]
                    )
                  }
                >
                  <FormLabel>Address</FormLabel>
                  <Input
                    {...whiteListForm.getFieldProps(
                      `white_list.${i}.wallet_address`,
                    )}
                  />
                  {v.wallet_address &&
                    whiteListForm.errors.white_list &&
                    whiteListForm.errors.white_list[i] && (
                      <FormErrorMessage>
                        {`${whiteListForm.errors.white_list[i]}`}
                      </FormErrorMessage>
                    )}
                </FormControl>
                <FormControl>
                  <FormLabel>Number</FormLabel>
                  <NumberInput min={1}>
                    <NumberInputField
                      {...whiteListForm.getFieldProps(`white_list.${i}.num`)}
                    />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input
                    {...whiteListForm.getFieldProps(`white_list.${i}.price`)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Free Mint</FormLabel>
                  <Switch
                    {...whiteListForm.getFieldProps(
                      `white_list.${i}.free_mint`,
                    )}
                  />
                </FormControl>
              </Stack>
            ))}
            <Button colorScheme="teal" onClick={handleAdd}>
              add
            </Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost" onClick={() => whiteListForm.handleSubmit()}>
            onAdd
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
