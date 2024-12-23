import React, { useState } from 'react';
import axios from 'axios';

export const generatePrompt = async (inputSentence) => {
  const systemPrompt = "You are a chatbot giving me a question about myself. Don't ask about personal information, ask question focus more on personal experience. The length is not too long, and not too short, not too sensitive, and not too predictable.";

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: inputSentence },
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer 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`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('LLaMA 3 response:', response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error querying LLaMA 3:', error.response ? error.response.data : error.message);
    throw error; 
  }
};