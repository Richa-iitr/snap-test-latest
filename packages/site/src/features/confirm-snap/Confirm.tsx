import {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from 'react';
import { Button, Form } from 'react-bootstrap';
import { Result, Snap } from '../../components';
import { useInvokeMutation } from '../../api';
import { getSnapId } from '../../utils/id';
import React from 'react';

const CONFIRM_SNAP_ID = 'npm:@metamask/test-snap-confirm';
const CONFIRM_SNAP_PORT = 8001;

export const Confirm: FunctionComponent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [textAreaContent, setTextAreaContent] = useState('');
  const [invokeSnap, { isLoading, data }] = useInvokeMutation();

  const handleChange =
    (fn: Dispatch<SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      fn(event.target.value);
    };

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    invokeSnap({
      snapId: getSnapId(CONFIRM_SNAP_ID, CONFIRM_SNAP_PORT),
      method: 'confirm',
      params: [title, description, textAreaContent],
    });
  };

  return (
    <Snap
      name="Safe Swap Snap"
      snapId={CONFIRM_SNAP_ID}
      port={CONFIRM_SNAP_PORT}
      testId="SwapSnap"
    >
      <Form onSubmit={handleSubmit} className="mb-3">
        <Button type="submit" id="sendConfirmButton" disabled={isLoading}>
          Safe Swap
        </Button>
      </Form>
{/* 
      <Result>
        <span id="confirmResult">{JSON.stringify(data, null, 2)}</span>
      </Result> */}
    </Snap>
  );
};
