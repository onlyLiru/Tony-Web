import { ApiAgent } from '@/services/agent';
import { createContext } from 'react';

export const AgentContext = createContext<{
  data: ApiAgent.HomePage;
  refresh: () => void;
}>({
  data: {} as ApiAgent.HomePage,
  refresh: () => null,
});
