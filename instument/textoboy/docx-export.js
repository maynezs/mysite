/* HTML (WYSIWYG / Markdown) → OOXML .docx. Требуется JSZip. */
window.DocxExport = (function () {
  const MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
    'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" ' +
    'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
    'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  const PAGE = { A4: [11906, 16838], A5: [8391, 11906], Letter: [12240, 15840], Legal: [12240, 20160] };
  const cm = v => Math.round((+v || 0) * 566.93);
  const tw = px => Math.max(0, Math.round((parseFloat(px) || 0) * 15));
  const hp = px => Math.max(2, Math.round((parseFloat(px) || 0) * 1.5));
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const font1 = f => (f || '').split(',')[0].replace(/["']/g, '').trim();
  function hex(c) {
    const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return null;
    const p = m[1].split(',').map(parseFloat); if (p.length > 3 && p[3] === 0) return null;
    return p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  const BLOCKS = new Set(['P','DIV','H1','H2','H3','H4','H5','H6','UL','OL','LI','TABLE','BLOCKQUOTE','PRE','HR','SECTION','ARTICLE','FIGURE','HEADER','FOOTER','MAIN','ASIDE','DL','DT','DD','ADDRESS']);

  function runStyle(el, ctx) {
    if (ctx.o.plain || !el || el.nodeType !== 1) return {};
    const cs = getComputedStyle(el), r = {};
    if (parseInt(cs.fontWeight) >= 600) r.b = 1;
    if (cs.fontStyle === 'italic') r.i = 1;
    const td = cs.textDecorationLine || cs.textDecoration || '';
    if (td.includes('underline')) r.u = 1;
    if (td.includes('line-through')) r.strike = 1;
    const f = font1(cs.fontFamily);
    if (f && f.toLowerCase() !== ctx.defFont.toLowerCase()) r.font = f;
    const sz = hp(cs.fontSize); if (sz !== ctx.defSize) r.sz = sz;
    const col = hex(cs.color); if (col && col !== ctx.defColor) r.color = col;
    const bg = hex(cs.backgroundColor); if (bg && bg !== ctx.defBg) r.bg = bg;
    if (cs.verticalAlign === 'super') r.sup = 1;
    if (cs.verticalAlign === 'sub') r.sub = 1;
    return r;
  }
  function rPrXml(r, link) {
    let s = '';
    if (link) s += '<w:rStyle w:val="Hyperlink"/>';
    if (r.font) s += `<w:rFonts w:ascii="${esc(r.font)}" w:hAnsi="${esc(r.font)}" w:cs="${esc(r.font)}"/>`;
    if (r.b) s += '<w:b/>'; if (r.i) s += '<w:i/>';
    if (r.u) s += '<w:u w:val="single"/>'; if (r.strike) s += '<w:strike/>';
    if (r.color) s += `<w:color w:val="${r.color}"/>`;
    if (r.sz) s += `<w:sz w:val="${r.sz}"/><w:szCs w:val="${r.sz}"/>`;
    if (r.bg) s += `<w:shd w:val="clear" w:color="auto" w:fill="${r.bg}"/>`;
    if (r.sup) s += '<w:vertAlign w:val="superscript"/>';
    if (r.sub) s += '<w:vertAlign w:val="subscript"/>';
    return s ? `<w:rPr>${s}</w:rPr>` : '';
  }
  const runXml = (text, r, link) => `<w:r>${rPrXml(r, link)}<w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;

  function inline(node, ctx, out, link) {
    node.childNodes.forEach(n => {
      if (n.nodeType === 3) {
        const t = n.nodeValue.replace(/[\t\r\n]+/g, ' ');
        if (t) out.push({ t: 'text', text: t, r: runStyle(n.parentElement, ctx), link });
      } else if (n.nodeType === 1) {
        const tag = n.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'META') return;
        if (tag === 'BR') { out.push({ t: n.className === 'page-break' ? 'pagebreak' : 'br' }); return; }
        if (tag === 'IMG') { if (ctx.o.images) out.push({ t: 'img', el: n, link }); return; }
        if (tag === 'INPUT') { out.push({ t: 'text', text: n.checked ? '☑ ' : '☐ ', r: {} }); return; }
        if (tag === 'HR') { out.push({ t: 'pagebreak' }); return; }
        if (tag === 'A') { inline(n, ctx, out, n.getAttribute('href') || link); return; }
        inline(n, ctx, out, link);
      }
    });
    return out;
  }
  const inlineOf = (el, ctx) => inline(el, ctx, []);

  async function prefetch(root, ctx) {
    const list = [...root.querySelectorAll('img')].filter(i => /^https?:/i.test(i.src));
    await Promise.all(list.map(async img => {
      try {
        const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 5000);
        const b = await (await fetch(img.src, { signal: ctl.signal })).blob(); clearTimeout(to);
        ctx.media.set(img.src, await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); }));
      } catch (e) { /* offline / CORS */ }
    }));
  }
  function imgXml(el, ctx) {
    const src = ctx.media.get(el.src) || (el.src.startsWith('data:') ? el.src : null);
    if (!src) return el.alt ? runXml('[' + el.alt + ']', {}) : '';
    const m = /^data:image\/([a-z+]+);base64,(.+)$/i.exec(src); if (!m) return '';
    let ext = m[1].toLowerCase(); if (ext === 'svg+xml') ext = 'png';
    const name = `image${++ctx.imgN}.${ext}`;
    ctx.images.push({ name, data: m[2] });
    const rid = 'rIdImg' + ctx.imgN;
    ctx.rels.push(`<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`);
    const maxEmu = ctx.contentEmu;
    let w = (el.naturalWidth || el.width || 400) * 9525, h = (el.naturalHeight || el.height || 300) * 9525;
    if (w > maxEmu) { h = Math.round(h * maxEmu / w); w = maxEmu; }
    const id = ctx.imgN;
    return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">` +
      `<wp:extent cx="${w}" cy="${h}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>` +
      `<wp:docPr id="${id}" name="Picture ${id}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>` +
      `<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic>` +
      `<pic:nvPicPr><pic:cNvPr id="${id}" name="${name}"/><pic:cNvPicPr/></pic:nvPicPr>` +
      `<pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
      `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${w}" cy="${h}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>` +
      `</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  }

  function pPr(el, ctx, opt = {}) {
    let s = '';
    if (opt.style) s += `<w:pStyle w:val="${opt.style}"/>`;
    if (opt.num) s += opt.num;
    if (el && el.nodeType === 1 && !ctx.o.plain) {
      const cs = getComputedStyle(el);
      const al = { center: 'center', right: 'right', justify: 'both', end: 'right' }[cs.textAlign];
      if (al) s += `<w:jc w:val="${al}"/>`;
      const bef = tw(cs.marginTop), aft = tw(cs.marginBottom);
      const lh = cs.lineHeight === 'normal' ? ctx.o.line : parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);
      const line = Math.round(240 * (lh || ctx.o.line));
      if (bef || aft || line !== Math.round(240 * ctx.o.line))
        s += `<w:spacing w:before="${bef}" w:after="${aft}" w:line="${line}" w:lineRule="auto"/>`;
      if (!opt.num) {
        const ind = tw(cs.marginLeft) + tw(cs.paddingLeft);
        if (ind > 40) s += `<w:ind w:left="${ind}"/>`;
      }
    }
    return s ? `<w:pPr>${s}</w:pPr>` : '';
  }
  function paraXml(items, props, ctx) {
    let xml = '', i = 0;
    while (i < items.length) {
      const it = items[i];
      if (it.t === 'br') { xml += '<w:r><w:br/></w:r>'; i++; continue; }
      if (it.t === 'pagebreak') { xml += '<w:r><w:br w:type="page"/></w:r>'; i++; continue; }
      if (it.t === 'img') { xml += imgXml(it.el, ctx); i++; continue; }
      const link = it.link, grp = [];
      while (i < items.length && items[i].t === 'text' && items[i].link === link) grp.push(items[i++]);
      const runs = grp.map(g => runXml(g.text, g.r, !!link)).join('');
      if (link) {
        let rid = ctx.links.get(link);
        if (!rid) {
          rid = 'rIdLnk' + (ctx.links.size + 1); ctx.links.set(link, rid);
          ctx.rels.push(`<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${esc(link)}" TargetMode="External"/>`);
        }
        xml += `<w:hyperlink r:id="${rid}">${runs}</w:hyperlink>`;
      } else xml += runs;
    }
    return `<w:p>${props || ''}${xml}</w:p>`;
  }

  function listXml(list, ctx, level) {
    const ordered = list.tagName === 'OL'; let xml = '';
    [...list.children].forEach(li => {
      if (li.tagName !== 'LI') return;
      const items = [];
      li.childNodes.forEach(c => {
        if (c.nodeType === 1 && (c.tagName === 'UL' || c.tagName === 'OL')) return;
        inline({ childNodes: [c] }, ctx, items);
      });
      const num = `<w:numPr><w:ilvl w:val="${Math.min(level, 8)}"/><w:numId w:val="${ordered ? 2 : 1}"/></w:numPr>`;
      xml += paraXml(items.length ? items : [{ t: 'text', text: '', r: {} }], pPr(li, ctx, { style: 'ListParagraph', num }), ctx);
      [...li.children].filter(c => c.tagName === 'UL' || c.tagName === 'OL')
        .forEach(sub => xml += listXml(sub, ctx, level + 1));
    });
    return xml;
  }
  function tableXml(tbl, ctx) {
    const rows = [...tbl.rows]; if (!rows.length) return '';
    const cols = Math.max(...rows.map(r => r.cells.length), 1);
    const total = ctx.contentTw, cw = Math.floor(total / cols);
    const bd = ['top','left','bottom','right','insideH','insideV']
      .map(k => `<w:${k} w:val="single" w:sz="4" w:space="0" w:color="auto"/>`).join('');
    let xml = `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="${total}" w:type="dxa"/><w:tblBorders>${bd}</w:tblBorders></w:tblPr>` +
      `<w:tblGrid>${Array(cols).fill(`<w:gridCol w:w="${cw}"/>`).join('')}</w:tblGrid>`;
    rows.forEach(tr => {
      xml += '<w:tr>';
      [...tr.cells].forEach(td => {
        const span = td.colSpan || 1, head = td.tagName === 'TH';
        const inner = blocks(td, ctx, {}) || '<w:p/>';
        xml += `<w:tc><w:tcPr><w:tcW w:w="${cw * span}" w:type="dxa"/>` +
          (span > 1 ? `<w:gridSpan w:val="${span}"/>` : '') +
          (head ? '<w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/>' : '') +
          `<w:vAlign w:val="top"/></w:tcPr>${inner}</w:tc>`;
      });
      xml += '</w:tr>';
    });
    return xml + '</w:tbl><w:p/>';
  }
  const hasBlock = el => [...el.children].some(c => BLOCKS.has(c.tagName));

  function blocks(root, ctx, opt) {
    let xml = '';
    root.childNodes.forEach(n => {
      if (n.nodeType === 3) {
        const t = n.nodeValue.replace(/\s+/g, ' ');
        if (t.trim()) xml += paraXml([{ t: 'text', text: t, r: runStyle(root, ctx) }], pPr(root, ctx, opt), ctx);
        return;
      }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;
      if (['SCRIPT','STYLE','META','LINK','TITLE'].includes(tag)) return;
      if (/^H[1-6]$/.test(tag)) xml += paraXml(inlineOf(n, ctx), pPr(n, ctx, { style: 'Heading' + tag[1] }), ctx);
      else if (tag === 'UL' || tag === 'OL') xml += listXml(n, ctx, opt.level || 0);
      else if (tag === 'TABLE') xml += tableXml(n, ctx);
      else if (tag === 'BLOCKQUOTE') xml += blocks(n, ctx, { ...opt, style: 'Quote' }) || paraXml(inlineOf(n, ctx), pPr(n, ctx, { style: 'Quote' }), ctx);
      else if (tag === 'PRE') {
        const r = { ...runStyle(n, ctx), font: font1(getComputedStyle(n).fontFamily) || 'Consolas' };
        n.textContent.replace(/\n$/, '').split('\n').forEach(l =>
          xml += `<w:p><w:pPr><w:pStyle w:val="Code"/></w:pPr>${runXml(l.replace(/\t/g, '    '), r)}</w:p>`);
      }
      else if (tag === 'HR') xml += `<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="auto"/></w:pBdr></w:pPr></w:p>`;
      else if (tag === 'IMG') xml += paraXml([{ t: 'img', el: n }], pPr(n, ctx, opt), ctx);
      else if (tag === 'BR') xml += n.className === 'page-break' ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' : '<w:p/>';
      else if (BLOCKS.has(tag) && tag !== 'P' && tag !== 'LI' && hasBlock(n)) xml += blocks(n, ctx, opt);
      else if (BLOCKS.has(tag) || ['SPAN','A','B','I','FONT','CODE','STRONG','EM','U','S'].includes(tag))
        xml += paraXml(inlineOf(n, ctx), pPr(n, ctx, opt), ctx);
      else xml += blocks(n, ctx, opt);
    });
    return xml;
  }

  function stylesXml(o) {
    const f = esc(o.font), sz = Math.round(o.size * 2), line = Math.round(240 * o.line);
    const H = (id, name, s, col, lvl) =>
      `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/>` +
      `<w:pPr><w:keepNext/><w:spacing w:before="${240 - lvl * 20}" w:after="120"/><w:outlineLvl w:val="${lvl}"/></w:pPr>` +
      `<w:rPr><w:b/><w:color w:val="${col}"/><w:sz w:val="${s}"/><w:szCs w:val="${s}"/></w:rPr></w:style>`;
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles ${NS}>` +
      `<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${f}" w:hAnsi="${f}" w:cs="${f}"/><w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:lang w:val="ru-RU"/></w:rPr></w:rPrDefault>` +
      `<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="${line}" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>` +
      `<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>` +
      H('Heading1','heading 1',Math.round(sz*1.9),'1F3864',0) + H('Heading2','heading 2',Math.round(sz*1.55),'2E5496',1) +
      H('Heading3','heading 3',Math.round(sz*1.3),'2E5496',2) + H('Heading4','heading 4',Math.round(sz*1.12),'44546A',3) +
      H('Heading5','heading 5',sz,'44546A',4) + H('Heading6','heading 6',sz,'44546A',5) +
      `<w:style w:type="paragraph" w:styleId="Quote"><w:name w:val="Quote"/><w:basedOn w:val="Normal"/>` +
      `<w:pPr><w:ind w:left="567"/><w:pBdr><w:left w:val="single" w:sz="12" w:space="8" w:color="4F8CFF"/></w:pBdr></w:pPr><w:rPr><w:i/><w:color w:val="44546A"/></w:rPr></w:style>` +
      `<w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:basedOn w:val="Normal"/>` +
      `<w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:shd w:val="clear" w:color="auto" w:fill="F5F5F5"/></w:pPr>` +
      `<w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="${Math.round(sz*0.92)}"/></w:rPr></w:style>` +
      `<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/>` +
      `<w:pPr><w:contextualSpacing/></w:pPr></w:style>` +
      `<w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:rPr><w:color w:val="0563C1"/><w:u w:val="single"/></w:rPr></w:style>` +
      `<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:tblPr><w:tblBorders>` +
      ['top','left','bottom','right','insideH','insideV'].map(k=>`<w:${k} w:val="single" w:sz="4" w:space="0" w:color="auto"/>`).join('') +
      `</w:tblBorders></w:tblPr></w:style></w:styles>`;
  }
  function numberingXml() {
    const lvl = (i, ch, fmt) => `<w:lvl w:ilvl="${i}"><w:start w:val="1"/><w:numFmt w:val="${fmt}"/>` +
      `<w:lvlText w:val="${ch}"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="${720*(i+1)}" w:hanging="360"/></w:pPr></w:lvl>`;
    const b = Array.from({length:9},(_,i)=>lvl(i,['•','◦','▪'][i%3],'bullet')).join('');
    const d = Array.from({length:9},(_,i)=>lvl(i,'%'+(i+1)+'.','decimal')).join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ${NS}>` +
      `<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/>${b}</w:abstractNum>` +
      `<w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="hybridMultilevel"/>${d}</w:abstractNum>` +
      `<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num><w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num></w:numbering>`;
  }

  async function fromElement(el, options) {
    if (!window.JSZip) throw new Error('JSZip не загружен');
    const o = Object.assign({ page:'A4', landscape:false, margins:{t:2,r:1.5,b:2,l:3},
      font:'Calibri', size:11, line:1.15, images:true, plain:false, title:'Документ', author:'DocEditor' }, options);
    const ctx = { o, images:[], rels:[], links:new Map(), media:new Map(), imgN:0 };
    const [pw, ph] = PAGE[o.page] || PAGE.A4;
    const [W, H] = o.landscape ? [ph, pw] : [pw, ph];
    ctx.contentTw = W - cm(o.margins.l) - cm(o.margins.r);
    ctx.contentEmu = Math.round(ctx.contentTw * 635);
    if (o.images) await prefetch(el, ctx);

    const prev = el.getAttribute('style') || '';
    el.style.cssText += `;font-family:${o.font};font-size:${o.size}pt;line-height:${o.line};color:#000;background:#fff`;
    let body;
    try {
      const cs = getComputedStyle(el);
      ctx.defFont = font1(cs.fontFamily); ctx.defSize = hp(cs.fontSize);
      ctx.defColor = hex(cs.color) || '000000'; ctx.defBg = null;
      body = blocks(el, ctx, {}) || '<w:p/>';
    } finally { el.setAttribute('style', prev); }

    const sect = `<w:sectPr><w:pgSz w:w="${W}" w:h="${H}"${o.landscape?' w:orient="landscape"':''}/>` +
      `<w:pgMar w:top="${cm(o.margins.t)}" w:right="${cm(o.margins.r)}" w:bottom="${cm(o.margins.b)}" w:left="${cm(o.margins.l)}" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>`;
    const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body}${sect}</w:body></w:document>`;

    const exts = [...new Set(ctx.images.map(i => i.name.split('.').pop()))];
    const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
      `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>` +
      exts.map(e => `<Default Extension="${e}" ContentType="image/${e}"/>`).join('') +
      `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
      `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>` +
      `<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>` +
      `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>` +
      `<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;
    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>` +
      `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>` +
      `<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;
    const drels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      `<Relationship Id="rIdS" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
      `<Relationship Id="rIdN" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>` +
      ctx.rels.join('') + '</Relationships>';
    const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">` +
      `<dc:title>${esc(o.title)}</dc:title><dc:creator>${esc(o.author)}</dc:creator><cp:lastModifiedBy>${esc(o.author)}</cp:lastModifiedBy>` +
      `<dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`;
    const app = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>DocEditor</Application></Properties>`;

    const zip = new JSZip();
    zip.file('[Content_Types].xml', ct);
    zip.folder('_rels').file('.rels', rels);
    zip.folder('docProps').file('core.xml', core);
    zip.folder('docProps').file('app.xml', app);
    const w = zip.folder('word');
    w.file('document.xml', doc); w.file('styles.xml', stylesXml(o)); w.file('numbering.xml', numberingXml());
    w.folder('_rels').file('document.xml.rels', drels);
    ctx.images.forEach(i => w.folder('media').file(i.name, i.data, { base64: true }));
    return zip.generateAsync({ type: 'blob', mimeType: MIME, compression: 'DEFLATE' });
  }

  async function fromHtml(html, options) {
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-99999px;top:0;width:800px';
    host.innerHTML = `<div class="doc">${html}</div>`;
    document.body.appendChild(host);
    try { return await fromElement(host.firstChild, options); }
    finally { host.remove(); }
  }
  return { fromElement, fromHtml, MIME };
})();