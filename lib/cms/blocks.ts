export type ContentBlockType =
  | 'hero'
  | 'section'
  | 'heading'
  | 'paragraph'
  | 'rich_text'
  | 'image'
  | 'link'
  | 'cta'
  | 'feature'
  | 'features'
  | 'how_to_use'
  | 'how_to'
  | 'related_tools'
  | 'benefits_trust'
  | 'intro'
  | 'faq'
  | 'tool_ref'
  | 'cards'
  | 'privacy_note'
  | 'use_cases'
  | 'spacer';

export interface UniversalContentBlock {
  id: string;
  type: ContentBlockType;
  enabled: boolean;
  order: number;
  content: Record<string, any>;
  settings?: Record<string, any>;
  // Additive root keys for backward compatibility with legacy rendering engines
  [key: string]: any;
}

export interface ContentBlockClipboard {
  version: number;
  block: UniversalContentBlock;
}

/**
 * Safely normalizes any legacy or arbitrary block shape into the stable UniversalContentBlock structure.
 * Standardizes content under block.content while copying content keys to the root for complete backward compatibility.
 */
export function normalizeBlock(block: any, defaultOrder = 0): UniversalContentBlock {
  if (!block || typeof block !== 'object') {
    return {
      id: `blk-${Math.random().toString(36).substring(2, 9)}`,
      type: 'paragraph',
      enabled: false,
      order: defaultOrder,
      content: { text: '' },
      settings: {},
      text: '',
    };
  }

  const id = block.id || `blk-${Math.random().toString(36).substring(2, 9)}`;
  
  let type: ContentBlockType = 'paragraph';
  const rawType = String(block.type || 'paragraph').toLowerCase();

  const validTypes: ContentBlockType[] = [
    'hero',
    'section',
    'heading',
    'paragraph',
    'rich_text',
    'image',
    'link',
    'cta',
    'feature',
    'features',
    'how_to_use',
    'how_to',
    'related_tools',
    'benefits_trust',
    'intro',
    'faq',
    'tool_ref',
    'cards',
    'privacy_note',
    'use_cases',
    'spacer',
  ];

  if (validTypes.includes(rawType as any)) {
    type = rawType as ContentBlockType;
  } else if (rawType === 'button') {
    type = 'cta';
  } else {
    // Graceful handling of unknown types
    type = 'paragraph';
  }

  const enabled = typeof block.enabled === 'boolean' ? block.enabled : true;
  const order = typeof block.order === 'number' ? block.order : defaultOrder;
  const settings = block.settings && typeof block.settings === 'object' ? { ...block.settings } : {};

  // Build the content payload
  let content: Record<string, any> = {};
  if (block.content && typeof block.content === 'object' && !Array.isArray(block.content)) {
    content = { ...block.content };
  } else {
    // Extract legacy fields from the root or data field
    const rootOrData = block.data && typeof block.data === 'object' ? { ...block.data, ...block } : { ...block };
    
    if (type === 'heading') {
      content.level = typeof rootOrData.level === 'number' ? rootOrData.level : 2;
      content.text = String(rootOrData.text || '').trim();
    } else if (type === 'paragraph' && rawType === 'paragraph') {
      content.text = String(rootOrData.text || '').trim();
    } else if (type === 'rich_text') {
      content.html = String(rootOrData.html || '').trim();
    } else if (type === 'cta') {
      content.label = String(rootOrData.label || rootOrData.text || '').trim();
      content.href = String(rootOrData.href || '').trim() || '#';
      content.variant = String(rootOrData.variant || 'primary').trim();
    } else if (type === 'link') {
      content.text = String(rootOrData.text || '').trim();
      content.href = String(rootOrData.href || '').trim() || '#';
      content.isExternal = Boolean(rootOrData.isExternal);
    } else if (type === 'feature') {
      content.title = String(rootOrData.title || '').trim();
      content.description = String(rootOrData.description || '').trim();
      content.icon = rootOrData.icon ? String(rootOrData.icon).trim() : undefined;
    } else if (type === 'faq') {
      content.question = String(rootOrData.question || '').trim();
      content.answer = String(rootOrData.answer || '').trim();
    } else if (type === 'image') {
      content.src = String(rootOrData.src || '').trim();
      content.alt = String(rootOrData.alt || '').trim();
      content.caption = rootOrData.caption ? String(rootOrData.caption).trim() : undefined;
    } else if (type === 'section') {
      content.title = String(rootOrData.title || '').trim();
      content.description = rootOrData.description ? String(rootOrData.description).trim() : undefined;
    } else if (type === 'intro') {
      content.heading = String(rootOrData.heading || '').trim();
      content.text = String(rootOrData.text || '').trim();
      if (rootOrData.html) content.html = String(rootOrData.html).trim();
    } else if (type === 'privacy_note') {
      content.title = String(rootOrData.title || '').trim();
      content.description = String(rootOrData.description || '').trim();
      content.bullets = Array.isArray(rootOrData.bullets) ? rootOrData.bullets : [];
    } else if (type === 'use_cases') {
      content.heading = String(rootOrData.heading || '').trim();
      content.description = rootOrData.description ? String(rootOrData.description).trim() : undefined;
      content.items = Array.isArray(rootOrData.items) ? rootOrData.items : [];
    } else {
      // General fallback copy of root fields
      const ignoreKeys = ['id', 'type', 'enabled', 'order', 'settings', 'content', 'data'];
      for (const [key, value] of Object.entries(rootOrData)) {
        if (!ignoreKeys.includes(key)) {
          content[key] = value;
        }
      }
    }
  }

  // Create the base normalized structure
  const normalized: UniversalContentBlock = {
    id,
    type,
    enabled,
    order,
    content,
    settings,
  };

  // Additive compatibility mapping: populate root fields from content
  for (const [key, value] of Object.entries(content)) {
    normalized[key] = value;
  }

  return normalized;
}

/**
 * Normalizes an array of arbitrary blocks, filters out invalid ones, and enforces deterministic ordering.
 */
export function normalizeBlocksList(blocks: any[] | null | undefined): UniversalContentBlock[] {
  if (!Array.isArray(blocks)) return [];
  
  return blocks
    .map((b, idx) => normalizeBlock(b, idx))
    .sort((a, b) => a.order - b.order);
}

/**
 * Enables or disables a block.
 */
export function toggleBlockEnabled(block: UniversalContentBlock, enabled?: boolean): UniversalContentBlock {
  const nextEnabled = typeof enabled === 'boolean' ? enabled : !block.enabled;
  return {
    ...block,
    enabled: nextEnabled,
  };
}

/**
 * Deletes a block from a block list.
 */
export function deleteBlock(blocks: UniversalContentBlock[], blockId: string): UniversalContentBlock[] {
  return blocks.filter((b) => b.id !== blockId);
}

/**
 * Reorders blocks deterministically based on active/over drop targets.
 */
export function reorderBlocks(blocks: UniversalContentBlock[], activeId: string, overId: string): UniversalContentBlock[] {
  const oldIndex = blocks.findIndex((b) => b.id === activeId);
  const newIndex = blocks.findIndex((b) => b.id === overId);
  if (oldIndex === -1 || newIndex === -1) return blocks;

  const result = [...blocks];
  const [removed] = result.splice(oldIndex, 1);
  result.splice(newIndex, 0, removed);

  return result.map((b, idx) => ({
    ...b,
    order: idx,
  }));
}

/**
 * Duplicates a block. Creates a NEW block with a fresh ID and deep-cloned independent content/settings.
 */
export function duplicateBlock(block: UniversalContentBlock): UniversalContentBlock {
  const newId = `blk-${Math.random().toString(36).substring(2, 9)}`;
  const contentCopy = JSON.parse(JSON.stringify(block.content));
  const settingsCopy = JSON.parse(JSON.stringify(block.settings || {}));

  const duplicated: UniversalContentBlock = {
    ...block,
    id: newId,
    content: contentCopy,
    settings: settingsCopy,
  };

  // Additive compatibility mapping: populate root fields from duplicated content
  for (const [key, value] of Object.entries(contentCopy)) {
    duplicated[key] = value;
  }

  return duplicated;
}

/**
 * Serializes a block into a clipboard transfer string.
 */
export function serializeBlockForClipboard(block: UniversalContentBlock): string {
  const clipboard: ContentBlockClipboard = {
    version: 1,
    block: {
      ...block,
    },
  };
  return JSON.stringify(clipboard);
}

/**
 * Deserializes a block from a clipboard transfer string, returning a completely independent block with a fresh ID.
 */
export function deserializeAndPasteBlock(clipboardStr: string, currentBlocksCount = 0): UniversalContentBlock | null {
  try {
    const clipboard: ContentBlockClipboard = JSON.parse(clipboardStr);
    if (!clipboard || clipboard.version !== 1 || !clipboard.block) {
      return null;
    }
    
    const sourceBlock = clipboard.block;
    const newId = `blk-${Math.random().toString(36).substring(2, 9)}`;
    const contentCopy = JSON.parse(JSON.stringify(sourceBlock.content));
    const settingsCopy = JSON.parse(JSON.stringify(sourceBlock.settings || {}));

    const pasted: UniversalContentBlock = {
      ...sourceBlock,
      id: newId,
      order: currentBlocksCount,
      content: contentCopy,
      settings: settingsCopy,
    };

    // Additive compatibility mapping: populate root fields from pasted content
    for (const [key, value] of Object.entries(contentCopy)) {
      pasted[key] = value;
    }

    return pasted;
  } catch {
    return null;
  }
}
