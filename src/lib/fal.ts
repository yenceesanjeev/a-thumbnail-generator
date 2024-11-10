import * as fal from '@fal-ai/serverless-client';

const FAL_KEY = import.meta.env.VITE_FAL_KEY || '';
const FAL_SECRET = import.meta.env.VITE_FAL_SECRET || '';

fal.config({
  credentials: {
    key: FAL_KEY,
    secret: FAL_SECRET,
  },
});

export async function trainModel(imageData: string) {
  try {
    const result = await fal.subscribe('fal-ai/flux-lora-fast-training', {
      input: {
        image_url: imageData,
        num_steps: 100,
        seed: 42,
      },
    });

    return result;
  } catch (error) {
    console.error('Error training model:', error);
    throw error;
  }
}

export async function generateThumbnail(modelId: string) {
  try {
    const result = await fal.subscribe('fal-ai/flux-lora-fast-training', {
      input: {
        model_id: modelId,
        prompt: "Generate a thumbnail version of the trained image",
        num_inference_steps: 30,
        seed: 42,
      },
    });

    return result;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
}