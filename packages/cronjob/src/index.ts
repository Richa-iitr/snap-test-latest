import { OnCronjobHandler } from '@metamask/snaps-types';
import { panel, text, heading } from '@metamask/snaps-ui';

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case 'fireCronjob':

      console.log('Cronjob fired');

      const url : string = 'http://localhost:3000/api/fetch';

      const headers = {
        'content-type': 'application/json',
        'X-Access-Key': '',
      };

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      console.log(response.json());

      return snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message: 'wow',
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
