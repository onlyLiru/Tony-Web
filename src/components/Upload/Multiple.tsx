import React, { useRef, useState } from 'react';
import { usePropsValue } from '@/hooks/usePropsValue';
import { getUploadUrl } from '@/services/global';
import { merge } from 'lodash';
import { Input, useToast } from '@chakra-ui/react';

export type UploadProps = {
  value?: string[];
  onChange?: (val: string[]) => void;
  defaultValue?: string[];
  beforeUpload?: (file: File) => Promise<File>;
  onSuccess?: (val: string, file: File) => void;
  onRemove?: (val: string, file?: File) => void;
  disabled?: boolean;
  children: (
    state: {
      value: string[];
      loading: boolean;
    },
    actions: {
      remove: (source: string) => void;
      chooseFile: () => void;
    },
  ) => React.ReactNode;
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

export default function Multiple(p: UploadProps) {
  const props = merge({ defaultValue: [] }, p);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = usePropsValue(props);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    try {
      const choosefiles = Array.from(e.target.files!);
      if (!choosefiles.length) throw Error('Please choose file!');
      const file = choosefiles[0];
      if (!file) throw Error('File error');
      const formdata = new FormData();
      formdata.append('file', file);
      setLoading(true);
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
      setLoading(false);
      const publicSource =
        result.variants.find((el) => el.endsWith('/public')) ||
        result.variants[0];
      setValue((prev) => [...prev, publicSource!]);
    } catch (error) {
      setLoading(false);
    }
  };
  const remove = (source: string) => {
    if (props.disabled) return;
    props.onRemove?.(source);
    setValue((prev) => prev.filter((f) => f !== source));
  };
  const chooseFile = () => {
    if (props.disabled || loading) return;
    inputRef.current?.click();
  };

  const actions = {
    remove,
    chooseFile,
  };

  return (
    <>
      {props.children({ value, loading }, actions)}
      <Input
        ref={inputRef}
        cursor={!props.disabled ? 'pointer !important' : 'default !important'}
        zIndex={1}
        display="none"
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
    </>
  );
}
