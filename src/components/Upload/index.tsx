import React, { useRef } from 'react';
import { usePropsValue } from '@/hooks/usePropsValue';
import { getUploadUrl, uploadFile } from '@/services/global';
import { useSetState } from 'ahooks';
import { merge } from 'lodash';
import Multiple from './Multiple';
import { Center, ChakraProps, Input, useToast } from '@chakra-ui/react';

export type UploadProps = {
  value?: string;
  onChange?: (val: string) => void;
  defaultValue?: string;
  beforeUpload?: (file: File) => Promise<unknown>;
  onSuccess?: (val: string, file: File) => void;
  onRemove?: (val: string, file?: File) => void;
  disabled?: boolean;
  children: (
    state: {
      value: string;
      loading: boolean;
    },
    actions: {
      remove: () => void;
      chooseFile: () => void;
    },
  ) => React.ReactNode;
  wrapperProps?: ChakraProps;
};

const upload = (url: string, formdata: FormData) => {
  return fetch(url, {
    method: 'POST',
    body: formdata,
  }).then<{
    success: boolean;
    result: {
      filename: string;
      id: string;
      uploaded: string;
      variants: string[];
    };
  }>((r) => r.json());
};

function Upload(p: UploadProps) {
  const props = merge({ defaultValue: '' }, p);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = usePropsValue(props);
  const [state, updateState] = useSetState<{ loading: boolean; file?: File }>({
    loading: false,
    file: undefined,
  });
  const toast = useToast();

  const uploadApi = async (formdata: FormData) => {
    const { data, msg, code } = await getUploadUrl();
    if (!data.url || code !== 200) {
      toast({ status: 'error', title: msg, variant: 'subtle' });
      return;
    }
    const { result, success } = await upload(data.url, formdata);
    if (!success) {
      toast({ status: 'error', title: 'upload failed', variant: 'subtle' });
      return;
    }
    updateState({ loading: false });
    const publicSource =
      result.variants.find((el) => el.endsWith('/public')) ||
      result.variants[0];
    setValue(publicSource!);
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    try {
      const files = Array.from(e.target.files!);
      if (!files.length) throw Error('Please choose file!');
      const file = files[0];
      if (!file) throw Error('File error');
      const formdata = new FormData();
      formdata.append('file', file);
      updateState({ loading: true, file });
      if (props.beforeUpload) {
        const res = await props.beforeUpload(file);
        if (!res) {
          updateState({ loading: false, file });
        } else {
          uploadApi(formdata);
        }
      } else {
        uploadApi(formdata);
      }
    } catch (error) {
      updateState({ loading: false });
    }
  };
  const remove = () => {
    if (props.disabled) return;
    props.onRemove?.(value, state.file);
    setValue('');
    updateState({ file: undefined });
  };
  const chooseFile = () => {
    if (props.disabled) return;
    inputRef.current?.click();
  };

  const actions = {
    remove,
    chooseFile,
  };

  return (
    <Center w="full" h="full" {...props.wrapperProps} pos="relative">
      <Input
        ref={inputRef}
        cursor={!props.disabled ? 'pointer !important' : 'default !important'}
        zIndex={1}
        opacity={'0 !important'}
        pos="absolute"
        w="full"
        h="full"
        top="0"
        right="0"
        left="0"
        bottom="0"
        type="file"
        p="0"
        m="0"
        value={''}
        onChange={onUpload}
        required={false}
        disabled={props.disabled}
      />
      {props.children({ value, loading: state.loading }, actions)}
    </Center>
  );
}

export default Object.assign(Upload, {
  Multiple,
});
