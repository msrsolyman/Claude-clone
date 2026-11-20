import { Artifact, ArtifactType } from '@/types/chat';

export interface ParsedStream {
  cleanContent: string;
  thinking: string;
  artifacts: Artifact[];
}

export function parseMessageContent(rawText: string, messageId: string = 'temp'): ParsedStream {
  let cleanContent = rawText;
  let thinking = '';
  const artifacts: Artifact[] = [];

  // Extract <thinking>...</thinking>
  const thinkingMatch = cleanContent.match(/<thinking>([\s\S]*?)<\/thinking>/);
  if (thinkingMatch) {
    thinking = thinkingMatch[1].trim();
    cleanContent = cleanContent.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim();
  }

  // Extract <antArtifact identifier="..." type="..." title="...">...</antArtifact>
  const artifactRegex = /<antArtifact\s+identifier="([^"]+)"(?:\s+type="([^"]+)")?(?:\s+title="([^"]+)")?(?:\s+language="([^"]+)")?>([\s\S]*?)<\/antArtifact>/g;
  let match;
  let index = 0;

  while ((match = artifactRegex.exec(cleanContent)) !== null) {
    const [fullTag, identifier, rawType, title, rawLang, code] = match;
    index++;
    
    let type: ArtifactType = 'code';
    let language = rawLang || 'typescript';

    if (rawType?.includes('react') || rawType?.includes('tsx') || rawType?.includes('jsx')) {
      type = 'react';
      language = 'tsx';
    } else if (rawType?.includes('svg') || identifier.endsWith('.svg')) {
      type = 'svg';
      language = 'svg';
    } else if (rawType?.includes('html') || identifier.endsWith('.html')) {
      type = 'html';
      language = 'html';
    } else if (rawType?.includes('markdown')) {
      type = 'markdown';
      language = 'markdown';
    }

    artifacts.push({
      id: `${messageId}-art-${index}`,
      identifier: identifier || `artifact-${index}`,
      title: title || identifier || `Artifact ${index}`,
      type,
      language,
      content: code.trim(),
      version: 1,
      createdAt: new Date().toISOString(),
    });
  }

  // Also replace artifact tags with an inline artifact reference badge
  cleanContent = cleanContent.replace(
    artifactRegex,
    (_match, id, _type, title) => `\n\n> 📦 **Artifact Created:** [${title || id}](#artifact-${id})\n\n`
  ).trim();

  return {
    cleanContent,
    thinking,
    artifacts,
  };
}
