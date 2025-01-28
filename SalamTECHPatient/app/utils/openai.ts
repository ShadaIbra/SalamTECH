import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: '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', // Replace with your actual OpenAI API key
  dangerouslyAllowBrowser: true // Only for demo purposes
}); 