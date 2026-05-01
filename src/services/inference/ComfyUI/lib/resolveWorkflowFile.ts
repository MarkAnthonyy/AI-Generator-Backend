type WorkflowType = 'txt2img' | 'img2img' | 'multi';

export function resolveWorkflowFile(type: WorkflowType): string {
  const map = {
    txt2img: 'base_txt2img.json',
    img2img: 'base_img2img.json',
    multi: 'base_multi.json',
  };

  return map[type];
}
