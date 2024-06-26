import httpProxyMiddleware from 'next-http-proxy-middleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { env } from '@/env/server.mjs';
import { NEXT_LOCALE_KEY } from '@/const/cookie';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

const hanlder = (req: NextApiRequest, res: NextApiResponse) => {
  req.headers[NEXT_LOCALE_KEY] = req.cookies[NEXT_LOCALE_KEY] || 'en';
  return httpProxyMiddleware(req, res, {
    target: 'https://chat.unemeta.com/msgs',
    pathRewrite: [
      {
        patternStr: '^/api/proxy',
        replaceStr: '',
      },
    ],
  });
};

export default hanlder;
