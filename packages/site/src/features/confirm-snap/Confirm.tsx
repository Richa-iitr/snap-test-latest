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
        <Form.Group>
          <Form.Label>Swap From</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. WETH"
            value={title}
            onChange={handleChange(setTitle)}
            id="msgTitle"
            className="mb-2"
          />

          <Form.Label>Swap To</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. USDC"
            value={title}
            onChange={handleChange(setTitle)}
            id="msgTitle"
            className="mb-2"
          />
          <Form.Label>Enter Amount</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. 1.0"
            value={title}
            onChange={handleChange(setTitle)}
            id="msgTitle"
            className="mb-2"
          />

          <Form.Label>DEX Order</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Uniswap"
            value={description}
            onChange={handleChange(setDescription)}
            id="msgDescription"
            className="mb-2"
          />
        </Form.Group>

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
