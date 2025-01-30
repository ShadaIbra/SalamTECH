import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: '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', // Replace with your actual OpenAI API key
  dangerouslyAllowBrowser: true // Only for demo purposes
}); 