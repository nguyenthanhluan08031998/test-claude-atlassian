/**
 * Atlassian Document Format (ADF) Utilities
 * - Convert ADF to plain text
 * - Convert markdown to ADF
 * - Create ADF tables
 */

// Parse ADF to plain text
export function adfToPlainText(adf) {
  if (!adf || typeof adf !== 'object') {
    return typeof adf === 'string' ? adf : '';
  }

  function processNode(node, depth = 0) {
    if (!node) return '';

    let result = '';
    const indent = '  '.repeat(depth);

    switch (node.type) {
      case 'doc':
        if (node.content) {
          node.content.forEach(child => {
            result += processNode(child, depth);
          });
        }
        break;

      case 'heading':
        const level = node.attrs?.level || 1;
        const headingMark = '#'.repeat(level);
        if (node.content) {
          result += '\n' + headingMark + ' ';
          node.content.forEach(child => {
            result += processNode(child, depth);
          });
          result += '\n\n';
        }
        break;

      case 'paragraph':
        if (node.content) {
          result += indent;
          node.content.forEach(child => {
            result += processNode(child, depth);
          });
          result += '\n';
        } else {
          result += '\n';
        }
        break;

      case 'text':
        let textContent = node.text || '';
        if (node.marks) {
          node.marks.forEach(mark => {
            if (mark.type === 'strong') {
              textContent = `**${textContent}**`;
            } else if (mark.type === 'em') {
              textContent = `*${textContent}*`;
            } else if (mark.type === 'code') {
              textContent = `\`${textContent}\``;
            }
          });
        }
        result += textContent;
        break;

      case 'bulletList':
      case 'orderedList':
        if (node.content) {
          node.content.forEach((child, index) => {
            result += processNode(child, depth, index + 1);
          });
        }
        break;

      case 'listItem':
        const bullet = arguments[2] ? `${arguments[2]}.` : '-';
        if (node.content && node.content[0]) {
          const firstChild = node.content[0];
          if (firstChild.type === 'paragraph' && firstChild.content) {
            result += indent + bullet + ' ';
            firstChild.content.forEach(child => {
              result += processNode(child, depth);
            });
            result += '\n';
            node.content.slice(1).forEach(child => {
              result += processNode(child, depth + 1);
            });
          }
        }
        break;

      case 'codeBlock':
        const language = node.attrs?.language || '';
        result += '\n```' + language + '\n';
        if (node.content) {
          node.content.forEach(child => {
            result += processNode(child, depth);
          });
        }
        result += '```\n\n';
        break;

      case 'rule':
        result += '\n---\n\n';
        break;

      case 'hardBreak':
        result += '\n';
        break;

      default:
        if (node.content) {
          node.content.forEach(child => {
            result += processNode(child, depth);
          });
        }
    }

    return result;
  }

  const text = processNode(adf);
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

// Convert markdown text to ADF
export function markdownToADF(text) {
  const lines = text.split('\n');
  const content = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    // Headers
    if (line.startsWith('### ')) {
      content.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: line.replace('### ', '').replace(/\*\*/g, '') }]
      });
    } else if (line.startsWith('## ')) {
      content.push({
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: line.replace('## ', '').replace(/\*\*/g, '') }]
      });
    } else if (line.startsWith('# ')) {
      content.push({
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: line.replace('# ', '').replace(/\*\*/g, '') }]
      });
    }
    // Bullet list
    else if (line.match(/^[\-\*✅❌] /)) {
      const text = line.replace(/^[\-\*✅❌] /, '').replace(/\*\*/g, '');
      content.push({
        type: 'bulletList',
        content: [{
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text }]
          }]
        }]
      });
    }
    // Horizontal rule
    else if (line.trim() === '---') {
      content.push({ type: 'rule' });
    }
    // Paragraph with bold support
    else if (line.trim()) {
      const textContent = [];
      const parts = line.split(/(\*\*[^*]+\*\*)/g);

      parts.forEach(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          textContent.push({
            type: 'text',
            text: part.replace(/\*\*/g, ''),
            marks: [{ type: 'strong' }]
          });
        } else if (part) {
          textContent.push({ type: 'text', text: part });
        }
      });

      if (textContent.length > 0) {
        content.push({
          type: 'paragraph',
          content: textContent
        });
      }
    }
  }

  return {
    type: 'doc',
    version: 1,
    content
  };
}

// Create ADF table for Acceptance Criteria
export function createACTable(acArray, figmaLink = '') {
  const rows = [
    // Header row
    {
      type: 'tableRow',
      content: [
        {
          type: 'tableHeader',
          attrs: { colwidth: [347], background: '#f0f1f2' },
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: 'Scenario', marks: [{ type: 'strong' }] }]
          }]
        },
        {
          type: 'tableHeader',
          attrs: { colwidth: [347], background: '#f0f1f2' },
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: 'GIVEN', marks: [{ type: 'strong' }] }]
          }]
        },
        {
          type: 'tableHeader',
          attrs: { colwidth: [347], background: '#f0f1f2' },
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: 'WHEN', marks: [{ type: 'strong' }] }]
          }]
        },
        {
          type: 'tableHeader',
          attrs: { colwidth: [508], background: '#f0f1f2' },
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: 'THEN', marks: [{ type: 'strong' }] }]
          }]
        },
        {
          type: 'tableHeader',
          attrs: { colwidth: [186], background: '#f0f1f2' },
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: 'Figma', marks: [{ type: 'strong' }] }]
          }]
        }
      ]
    }
  ];

  // Data rows
  acArray.forEach(ac => {
    const figmaContent = ac.figma || figmaLink || '';

    rows.push({
      type: 'tableRow',
      content: [
        {
          type: 'tableCell',
          attrs: { colwidth: [347], background: '#ffffff' },
          content: [{
            type: 'paragraph',
            content: ac.scenario ? [{ type: 'text', text: ac.scenario }] : []
          }]
        },
        {
          type: 'tableCell',
          attrs: { colwidth: [347], background: '#ffffff' },
          content: [{
            type: 'paragraph',
            content: ac.given ? [{ type: 'text', text: ac.given }] : []
          }]
        },
        {
          type: 'tableCell',
          attrs: { colwidth: [347], background: '#ffffff' },
          content: [{
            type: 'paragraph',
            content: ac.when ? [{ type: 'text', text: ac.when }] : []
          }]
        },
        {
          type: 'tableCell',
          attrs: { colwidth: [508], background: '#ffffff' },
          content: [{
            type: 'paragraph',
            content: ac.then ? [{ type: 'text', text: ac.then }] : []
          }]
        },
        {
          type: 'tableCell',
          attrs: { colwidth: [186], background: '#ffffff' },
          content: [{
            type: 'paragraph',
            content: figmaContent ? [{ type: 'text', text: figmaContent }] : []
          }]
        }
      ]
    });
  });

  return {
    type: 'doc',
    version: 1,
    content: [{
      type: 'table',
      attrs: {
        isNumberColumnEnabled: true,
        layout: 'align-start'
      },
      content: rows
    }]
  };
}
