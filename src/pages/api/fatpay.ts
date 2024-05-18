import { env } from '@/env/server.mjs';
import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { stringify } from 'querystring';

function sorter(paramsJson: Record<string, string>) {
  const sortedJson = {} as Record<string, string>;
  const sortedKeys = Object.keys(paramsJson).sort();
  for (let i = 0; i < sortedKeys.length; i++) {
    sortedJson[sortedKeys[i]!] = paramsJson[sortedKeys[i]!] as string;
  }
  return sortedJson;
}

const hanlder = (req: NextApiRequest, res: NextApiResponse) => {
  if (!env.FATPAY_SECRET_KEY) {
    return res.status(403).send({ err: 'Can Not Find FATPAY_SECRET_KEY' });
  }
  const sortedQuery = sorter(req.query as Record<string, string>);
  const stringifyQuery = stringify(sortedQuery);
  const signature = crypto
    .createHmac('sha256', env.FATPAY_SECRET_KEY!)
    .update(stringifyQuery)
    .digest('base64');
  res.json({ signature });
};

export default hanlder;
