import React, { useState } from 'react';
import axios from 'axios';

export const queryLlama3 = async (inputSentence) => {
  const systemPrompt = "You are a chatbot suggesting only energy (float type), valence (float type), and tempo (int) for a Spotify song based on the sentence below. Energy is in range [0,1], valence is in range [0, 1], tempo is integer" + inputSentence + "Answer in this format strictly: \"{energy: , valence: , tempo: }\".";

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


