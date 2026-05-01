type WorkflowType = 'txt2img' | 'img2img';

type Inputs = {
  images?: unknown[];
};

export function getWorkflowType(inputs: Inputs): WorkflowType {
  if (!inputs.images || inputs.images.length === 0) {
    return 'txt2img';
  }

  if (inputs.images.length === 1) {
    return 'img2img';
  }

  throw new Error('Multi-image not supported yet');
}
