import {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from 'react';
import { Button, Form } from 'react-bootstrap';
import { ethers } from 'ethers';
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

  // const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  // await provider.send('eth_requestAccounts', []);
  // const owner: ethers.providers.JsonRpcSigner = provider.getSigner();

  // const handleChange =
  //   (fn: Dispatch<SetStateAction<string>>) =>
  //   (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //     fn(event.target.value);
  //   };

  const handleSubmit = () => {
    invokeSnap({
      snapId: getSnapId(CONFIRM_SNAP_ID, CONFIRM_SNAP_PORT),
      method: 'swap',
    });
  };

  const handleSafeCreate = () => {
    invokeSnap({
      snapId: getSnapId(CONFIRM_SNAP_ID, CONFIRM_SNAP_PORT),
      method: 'createSafe',
    });
  };

  const handleCreate = () => {
    invokeSnap({
      snapId: getSnapId(CONFIRM_SNAP_ID, CONFIRM_SNAP_PORT),
      method: 'create',
    });
  };

  const handleInitiate = () => {
    invokeSnap({
      snapId: getSnapId(CONFIRM_SNAP_ID, CONFIRM_SNAP_PORT),
      method: 'initiateTx',
      // params: [owner as ethers.providers.JsonRpcSigner],
    });
  };

  return (
    <Snap
      name="Confirm Snap"
      snapId={CONFIRM_SNAP_ID}
      port={CONFIRM_SNAP_PORT}
      testId="ConfirmSnap"
    >
      {/* <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleChange(setTitle)}
            id="msgTitle"
            className="mb-2"
          />

          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Description"
            value={description}
            onChange={handleChange(setDescription)}
            id="msgDescription"
            className="mb-2"
          />

          <Form.Label>Textarea Content</Form.Label>
          <Form.Control
            type="text"
            placeholder="Textarea Content"
            value={textAreaContent}
            onChange={handleChange(setTextAreaContent)}
            id="msgTextarea"
            className="mb-3"
          />
        </Form.Group> */}
      <Button
        type="submit"
        id="sendConfirmButton"
        disabled={isLoading}
        onClick={handleCreate}
      >
        Create
      </Button>
      <Button
        type="submit"
        id="sendConfirmButton"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        Submit
      </Button>

      <Button
        type="submit"
        id="sendConfirmButton"
        disabled={isLoading}
        onClick={handleSafeCreate}
      >
        Create safe
      </Button>

      <Button
        type="submit"
        id="sendConfirmButton"
        disabled={isLoading}
        onClick={handleInitiate}
      >
        Initiate Tx
      </Button>

      <Result>
        <span id="confirmResult">{JSON.stringify(data, null, 2)}</span>
      </Result>
    </Snap>
  );
};
