/* eslint-disable @typescript-eslint/no-explicit-any */
type ComfyNode = {
  id: number;
  type: string;
  widgets_values?: any[];
  [key: string]: any;
};

type ComfyWorkflow = {
  id: string;
  nodes: ComfyNode[];
  links: any[];
  [key: string]: any;
};

type Prompt = {
  prompt: string;
};

type Image = {
  image?: string;
};

export function injectWorkflow(
  workflow: any,
  prompt: Prompt,
  image?: Image,
): ComfyWorkflow {
  const wf = structuredClone(workflow);

  for (const key in wf) {
    const node = wf[key];

    if (!node?.class_type) continue;

    // TEXT PROMPT
    if (node.class_type === 'CLIPTextEncode') {
      const title = node._meta?.title?.toLowerCase() || '';

      if (title.includes('prompt') && !title.includes('negative')) {
        node.inputs.text = prompt.prompt;
      }
    }

    // IMAGE INPUT
    if (node.class_type === 'LoadImage' && image?.image) {
      node.inputs.image = image.image;
    }
  }

  return wf;
}
