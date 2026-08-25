import { NextResponse } from 'next/server';

/** Convert inline markdown tokens to HTML within a single line of text */
function inlineMarkdown(text: string): string {
  let s = text;
  // bold: **text** or __text__
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // italic: *text* or _text_ (but not inside words with underscores)
  s = s.replace(/(?<!\w)\*([^*]+?)\*(?!\w)/g, '<em>$1</em>');
  s = s.replace(/(?<!\w)_([^_]+?)_(?!\w)/g, '<em>$1</em>');
  // inline code: `text`
  s = s.replace(/`([^`]+?)`/g, '<code>$1</code>');
  // markdown links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s;
}

/** Convert a full markdown/plain-text essay string into clean, well-formatted HTML */
function formatEssayToHtml(essayText: string): string {
  if (!essayText) return '';

  // If the content already looks like rich HTML, return it as-is
  if (
    essayText.includes('<p>') ||
    essayText.includes('<div>') ||
    essayText.includes('<h1>') ||
    essayText.includes('<h2>') ||
    essayText.includes('<h3>')
  ) {
    return essayText;
  }

  // Split by double-newlines first to identify paragraph-level blocks
  const blocks = essayText.split(/\n\s*\n/);
  const htmlParts: string[] = [];

  for (const block of blocks) {
    const lines = block.split(/\n/).map(l => l.trimEnd());
    if (lines.length === 0) continue;

    // Check if this block is entirely list items
    const isListBlock = lines.every(l => /^\s*[-*]\s/.test(l.trim()) || l.trim() === '');
    if (isListBlock) {
      const items = lines
        .map(l => l.trim())
        .filter(l => l)
        .map(l => `<li>${inlineMarkdown(l.replace(/^[-*]\s+/, ''))}</li>`);
      if (items.length > 0) {
        htmlParts.push(`<ul>${items.join('')}</ul>`);
      }
      continue;
    }

    // Check if this block is a numbered list
    const isNumberedList = lines.every(l => /^\s*\d+[\.\)]\s/.test(l.trim()) || l.trim() === '');
    if (isNumberedList) {
      const items = lines
        .map(l => l.trim())
        .filter(l => l)
        .map(l => `<li>${inlineMarkdown(l.replace(/^\d+[\.\)]\s+/, ''))}</li>`);
      if (items.length > 0) {
        htmlParts.push(`<ol>${items.join('')}</ol>`);
      }
      continue;
    }

    // Process each line in the block
    const blockParts: string[] = [];
    const pendingParagraphLines: string[] = [];

    const flushParagraph = () => {
      if (pendingParagraphLines.length > 0) {
        const text = pendingParagraphLines.join(' ').trim();
        if (text) {
          blockParts.push(`<p>${inlineMarkdown(text)}</p>`);
        }
        pendingParagraphLines.length = 0;
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        flushParagraph();
        continue;
      }

      // Headings
      if (line.startsWith('### ')) {
        flushParagraph();
        blockParts.push(`<h4>${inlineMarkdown(line.slice(4))}</h4>`);
      } else if (line.startsWith('## ')) {
        flushParagraph();
        blockParts.push(`<h3>${inlineMarkdown(line.slice(3))}</h3>`);
      } else if (line.startsWith('# ')) {
        flushParagraph();
        blockParts.push(`<h2>${inlineMarkdown(line.slice(2))}</h2>`);
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        flushParagraph();
        blockParts.push(`<blockquote><p>${inlineMarkdown(line.slice(2))}</p></blockquote>`);
      }
      // Horizontal rule
      else if (/^[-*_]{3,}$/.test(line)) {
        flushParagraph();
        blockParts.push('<hr/>');
      }
      // List items appearing mid-block
      else if (/^[-*]\s/.test(line)) {
        flushParagraph();
        blockParts.push(`<ul><li>${inlineMarkdown(line.replace(/^[-*]\s+/, ''))}</li></ul>`);
      }
      else if (/^\d+[\.\)]\s/.test(line)) {
        flushParagraph();
        blockParts.push(`<ol><li>${inlineMarkdown(line.replace(/^\d+[\.\)]\s+/, ''))}</li></ol>`);
      }
      // Normal text line — accumulate into a paragraph
      else {
        pendingParagraphLines.push(line);
      }
    }

    flushParagraph();
    htmlParts.push(...blockParts);
  }

  return htmlParts.join('\n');
}

function parseSchool(title?: string, program?: string, explicitSchool?: string): string {
  if (explicitSchool && explicitSchool.trim()) return explicitSchool.trim();
  if (!title) return program || 'Top University';

  const knownSchools = [
    'Harvard', 'Stanford', 'MIT', 'Penn', 'University of Pennsylvania',
    'University of Washington', 'UC Berkeley', 'Columbia', 'Yale',
    'Princeton', 'Cornell', 'Johns Hopkins', 'Oxford', 'Cambridge',
    'Carnegie Mellon', 'New York University', 'NYU', 'Duke', 'Northwestern',
    'UCLA', 'USC', 'University of Chicago', 'Chicago', 'Chalmers University of Technology',
    'Chalmers', 'California State University', 'Cal State', 'Georgia Tech',
    'UT Austin', 'University of Texas', 'Imperial College', 'UCL', 'ETH Zurich'
  ];

  for (const s of knownSchools) {
    if (new RegExp(`\\b${s}\\b`, 'i').test(title)) {
      if (s.toLowerCase() === 'harvard') return 'Harvard University';
      if (s.toLowerCase() === 'penn') return 'University of Pennsylvania';
      if (s.toLowerCase() === 'stanford') return 'Stanford University';
      if (s.toLowerCase() === 'columbia') return 'Columbia University';
      if (s.toLowerCase() === 'yale') return 'Yale University';
      if (s.toLowerCase() === 'princeton') return 'Princeton University';
      if (s.toLowerCase() === 'cornell') return 'Cornell University';
      if (s.toLowerCase() === 'johns hopkins') return 'Johns Hopkins University';
      if (s.toLowerCase() === 'oxford') return 'University of Oxford';
      if (s.toLowerCase() === 'cambridge') return 'University of Cambridge';
      if (s.toLowerCase() === 'nyu') return 'New York University';
      return s;
    }
  }

  const parts = title.split('-');
  if (parts.length > 1 && parts[0].trim().length > 3) {
    return parts[0].trim();
  }
  return program || 'Top University';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const essayId = searchParams.get('id');
    const search = searchParams.get('search')?.toLowerCase();

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    if (!wixApiKey || !wixSiteId) {
      return NextResponse.json({
        success: false,
        essays: [],
        count: 0,
        error: 'Wix API credentials not configured in environment.'
      });
    }

    const headers = {
      'Authorization': wixApiKey,
      'wix-site-id': wixSiteId,
      'Content-Type': 'application/json',
    };

    // Primary target collections in Wix CMS (including Import1 where user's collection was imported)
    const targetCollections = [
      'Import1',
      'import1',
      'essays',
      'Essays',
      'exemplar-essays',
      'sop-examples',
      'sops',
      'user-essays'
    ];

    let wixItems: any[] = [];
    let usedCollection = '';

    for (const colId of targetCollections) {
      try {
        const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            dataCollectionId: colId,
            query: {
              paging: { limit: 100 },
              sort: [{ fieldName: '_updatedDate', order: 'DESC' }]
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const items = data.dataItems || data.items || [];
          if (items.length > 0) {
            wixItems = items;
            usedCollection = colId;
            break;
          }
        }
      } catch (e) {
        // Continue to next candidate
      }
    }

    const parsedEssays: any[] = [];
    const seenIds = new Set<string>();

    for (const item of wixItems) {
      const id = item.id || item._id;
      if (id && seenIds.has(id)) continue;
      if (id) seenIds.add(id);

      const d = item.data || item;
      const rawEssay = d.essay || d.content || d.html || d.body || d.text || d.description || '';
      const fullHtml = formatEssayToHtml(rawEssay);

      const plainText = rawEssay
        .replace(/<[^>]+>/g, ' ')       // strip HTML tags
        .replace(/^#{1,6}\s+/gm, '')    // strip heading markers
        .replace(/\*\*(.+?)\*\*/g, '$1') // strip bold markers
        .replace(/__(.+?)__/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')     // strip italic markers
        .replace(/_(.+?)_/g, '$1')
        .replace(/`([^`]+)`/g, '$1')     // strip inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip links, keep text
        .replace(/^[-*]\s+/gm, '')       // strip list markers
        .replace(/^\d+[\.\)]\s+/gm, '')  // strip numbered list markers
        .replace(/^>\s+/gm, '')          // strip blockquote markers
        .replace(/\s+/g, ' ')
        .trim();
      const count = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
      const words = count > 0 ? `${count.toLocaleString()} words` : '500 words';

      const title = d.title || d.prompt || d.program || 'Statement of Purpose';
      const school = parseSchool(d.title, d.program, d.school || d.university || d.institution);
      const tag = d.type || d.categoryLevel || d.tag || 'Admitted SOP';
      const author = d.author || 'Admitted Student';
      const year = d.categoryLevel ? `${d.categoryLevel} Level` : (d.year || 'Verified Admit');
      
      const previewText = plainText ? plainText.slice(0, 200) + '...' : 'Click View Essay to read full Statement of Purpose.';

      parsedEssays.push({
        id: id || `wix-${Math.random().toString(36).substring(2, 9)}`,
        title,
        school,
        program: d.program || '',
        categoryLevel: d.categoryLevel || '',
        tag,
        words,
        previewText,
        content: fullHtml || `<p>${previewText}</p>`,
        author,
        year,
        link: d.link || d.originalLink || '',
        updatedAt: d.updatedAt || item._updatedDate || item._createdDate || new Date().toISOString()
      });
    }

    if (essayId) {
      const found = parsedEssays.find((e) => e.id === essayId);
      if (found) {
        return NextResponse.json({
          success: true,
          essay: found,
          source: usedCollection
        });
      }
    }

    if (search) {
      const filtered = parsedEssays.filter((e) =>
        e.title.toLowerCase().includes(search) ||
        e.school.toLowerCase().includes(search) ||
        e.tag.toLowerCase().includes(search) ||
        (e.previewText && e.previewText.toLowerCase().includes(search)) ||
        (e.content && e.content.toLowerCase().includes(search))
      );
      return NextResponse.json({
        success: true,
        essays: filtered,
        count: filtered.length,
        source: usedCollection
      });
    }

    return NextResponse.json({
      success: true,
      essays: parsedEssays,
      count: parsedEssays.length,
      source: usedCollection
    });
  } catch (error: any) {
    console.error('Error fetching dynamic essays from Wix CMS:', error);
    return NextResponse.json({
      success: false,
      essays: [],
      count: 0,
      error: error.message || 'Failed to query Wix CMS collection'
    });
  }
}
