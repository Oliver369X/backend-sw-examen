export interface ExpertConfig {
  name: string;
  systemPrompt: string;
  process: (input: any) => Promise<any>;
}

export const createExpert = (config: ExpertConfig) => config; 