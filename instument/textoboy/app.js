/* ================= DocEditor ================= */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const DOCFONTS = {
  'Calibri': 'Calibri,Carlito,"Segoe UI",sans-serif', 'Times New Roman': '"Times New Roman",Tinos,serif',
  'Arial': 'Arial,Helvetica,sans-serif', 'Georgia': 'Georgia,serif', 'Verdana': 'Verdana,sans-serif',
  'Segoe UI': '"Segoe UI",system-ui,sans-serif', 'Courier New': '"Courier New",monospace', 'Inter': 'Inter,system-ui,sans-serif'
};
const UIFONTS = { system:'system-ui,-apple-system,sans-serif', humanist:'"Segoe UI",Roboto,system-ui,sans-serif', serif:'Georgia,"Times New Roman",serif', mono:'ui-monospace,Menlo,Consolas,monospace' };
const SIZES = [8,9,10,10.5,11,12,13,14,16,17,18,20,22,24,26,28,32,36,48,72];
const PAGEMM = { A4:[210,297], A5:[148,210], Letter:[215.9,279.4], Legal:[215.9,355.6] };
const EXTMODE = { js:'javascript', mjs:'javascript', ts:'typescript', tsx:'typescript', py:'python', html:'html', htm:'html',
  css:'css', scss:'scss', less:'less', json:'json', xml:'xml', svg:'xml', swift:'swift', c:'c_cpp', cpp:'c_cpp', h:'c_cpp',
  java:'java', kt:'kotlin', go:'golang', rb:'ruby', php:'php', sh:'sh', sql:'sql', yaml:'yaml', yml:'yaml', toml:'toml',
  md:'markdown', markdown:'markdown', txt:'text', csv:'text' };
const LANGS = [['text','Текст'],['python','Python'],['javascript','JavaScript'],['typescript','TypeScript'],['html','HTML'],
  ['css','CSS'],['scss','SCSS'],['less','LESS'],['swift','Swift'],['json','JSON'],['xml','XML'],['markdown','Markdown'],
  ['yaml','YAML'],['toml','TOML'],['sql','SQL'],['c_cpp','C/C++'],['java','Java'],['kotlin','Kotlin'],['golang','Go'],
  ['ruby','Ruby'],['php','PHP'],['sh','Shell']];

const DEF = { theme:'dark', accent:'#4f8cff', uiFont:'system', uiSize:14, density:'cozy', statusBar:true,
  docFont:'Calibri', docSize:11, docLine:1.15, wrap:true, hyphens:false, spell:true, darkPaper:false, ruler:true,
  fit:innerWidth<820, codeSize:14, tabSize:2, codeTheme:'auto', autosave:true, page:'A4', landscape:false,
  margins:{t:2,r:1.5,b:2,l:3}, zoom:100 };
let S = loadSettings();
const st = { kind:'none', view:'welcome', name:'Документ.docx', handle:null, dirty:false, original:null,
  docxBuf:null, pdf:null, pdfScale:1.4, exportFmt:'docx', lang:null };
let aceMd, aceCode, mdTimer, autoTimer, htmlTimer, dlgResolve=null, expNameTouched=false, dragDepth=0;

function loadSettings(){ try{ return Object.assign({},DEF,JSON.parse(localStorage.getItem('de.settings')||'{}')); }catch(e){ return {...DEF}; } }
const persist = () => { try{ localStorage.setItem('de.settings',JSON.stringify(S)); }catch(e){} };
const escapeHtml = s => String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const escapeAttr = s => escapeHtml(s).replace(/"/g,'&quot;');
const mdToHtml = src => window.marked ? marked.parse(src,{gfm:true}) : '<pre>'+escapeHtml(src)+'</pre>';

/* ---------- тема / настройки ---------- */
function apply(){
  const dark = S.theme==='dark' || (S.theme==='auto' && matchMedia('(prefers-color-scheme:dark)').matches);
  document.body.dataset.theme = dark?'dark':'light';
  $('meta[name=theme-color]').content = dark?'#0b0f17':'#eef1f7';
  $('#btnTheme').innerHTML = `<svg class="i"><use href="#i-${dark?'sun':'moon'}"/></svg>`;
  $('#hl-dark').disabled = !dark; $('#hl-light').disabled = dark;
  const r = document.documentElement.style, m = S.margins;
  const [pw,ph] = PAGEMM[S.page]||PAGEMM.A4, [w,h] = S.landscape?[ph,pw]:[pw,ph];
  r.setProperty('--accent',S.accent); r.setProperty('--ui-font',UIFONTS[S.uiFont]); r.setProperty('--ui-size',S.uiSize+'px');
  r.setProperty('--doc-font',DOCFONTS[S.docFont]||S.docFont); r.setProperty('--doc-size',S.docSize+'pt'); r.setProperty('--doc-line',S.docLine);
  r.setProperty('--page-w',w+'mm'); r.setProperty('--page-h',h+'mm');
  r.setProperty('--m-t',m.t+'cm'); r.setProperty('--m-r',m.r+'cm'); r.setProperty('--m-b',m.b+'cm'); r.setProperty('--m-l',m.l+'cm');
  r.setProperty('--zoom',S.zoom/100);
  const cls = document.body.classList;
  cls.toggle('dark-paper',S.darkPaper); cls.toggle('hyphens',S.hyphens); cls.toggle('wrap',S.wrap);
  cls.toggle('no-ruler',!S.ruler); cls.toggle('fit',S.fit); cls.toggle('compact',S.density==='compact'); cls.toggle('no-status',!S.statusBar);
  $('#doc').spellcheck = S.spell; $('#zoomVal').textContent = Math.round(S.zoom)+'%';
  $('#print-style').textContent = `@page{size:${S.page} ${S.landscape?'landscape':'portrait'};margin:${m.t}cm ${m.r}cm ${m.b}cm ${m.l}cm}`;
  const codeTheme = S.codeTheme==='auto' ? (dark?'tomorrow_night':'chrome') : S.codeTheme;
  [aceMd,aceCode].forEach(a=>{ if(a){ a.setFontSize(S.codeSize); a.session.setTabSize(S.tabSize); a.session.setUseWrapMode(S.wrap); a.setTheme('ace/theme/'+codeTheme); }});
  $$('[data-set]').forEach(el=>{ const k=el.dataset.set; if(el.type==='checkbox') el.checked=!!S[k]; else el.value=S[k]; });
  $$('[data-seg=theme] button').forEach(b=>b.classList.toggle('on',b.dataset.v===S.theme));
  $$('#accents .sw').forEach(b=>b.classList.toggle('on',b.dataset.c===S.accent));
  if($('#rTab')) $('#rTab').value=S.tabSize;
  if($('#rCodeTheme')) $('#rCodeTheme').value=S.codeTheme;
  syncExportOpts(); persist();
}

/* ---------- лента ---------- */
const B=(icon,cmd,title,label)=>({k:'btn',icon,cmd,title:title||label,label});
const RIBBON = {
  home:[
    {t:'Буфер',items:[B('undo','undo','Отменить (Ctrl+Z)'),B('redo','redo','Вернуть (Ctrl+Y)'),B('eraser','clearFormat','Очистить форматирование')]},
    {t:'Шрифт',items:[
      {k:'sel',id:'rFont',cmd:'fontName',w:140,title:'Шрифт',opts:Object.keys(DOCFONTS).map(f=>[f,f])},
      {k:'sel',id:'rSize',cmd:'fontSize',w:70,title:'Кегль, пт',opts:SIZES.map(s=>[s,s])},
      {k:'btn',cmd:'grow',label:'A+',title:'Увеличить шрифт'},{k:'btn',cmd:'shrink',label:'A−',title:'Уменьшить шрифт'},
      B('bold','bold','Жирный (Ctrl+B)'),B('italic','italic','Курсив (Ctrl+I)'),B('underline','underline','Подчёркнутый (Ctrl+U)'),B('strike','strikeThrough','Зачёркнутый'),
      {k:'btn',cmd:'superscript',label:'x²',title:'Надстрочный'},{k:'btn',cmd:'subscript',label:'x₂',title:'Подстрочный'},
      {k:'clr',icon:'color',cmd:'foreColor',value:'#e11d48',title:'Цвет текста'},
      {k:'clr',icon:'highlight',cmd:'hiliteColor',value:'#fde68a',title:'Цвет выделения'}]},
    {t:'Абзац',items:[B('ul','insertUnorderedList','Маркированный список'),B('ol','insertOrderedList','Нумерованный список'),
      B('outdent','outdent','Уменьшить отступ'),B('indent','indent','Увеличить отступ'),
      B('left','justifyLeft','По левому краю'),B('center','justifyCenter','По центру'),B('right','justifyRight','По правому краю'),B('justify','justifyFull','По ширине'),
      {k:'sel',id:'rLine',cmd:'lineHeight',w:76,title:'Междустрочный интервал',opts:[['1','1,0'],['1.15','1,15'],['1.5','1,5'],['2','2,0'],['2.5','2,5']]}]},
    {t:'Стили',items:[{k:'sel',id:'rBlock',cmd:'formatBlock',w:150,title:'Стиль абзаца',
      opts:[['p','Обычный'],['h1','Заголовок 1'],['h2','Заголовок 2'],['h3','Заголовок 3'],['h4','Заголовок 4'],['blockquote','Цитата'],['pre','Код']]},
      {k:'sel',id:'rCase',cmd:'changeCase',w:130,title:'Регистр',opts:[['','Регистр…'],['upper','ВЕРХНИЙ'],['lower','нижний'],['title','Как В Заголовке'],['sentence','Как в предложении']]}]},
    {t:'Правка',items:[B('search','find','Найти и заменить (Ctrl+F)')]}
  ],
  insert:[
    {t:'Иллюстрации',items:[B('image','image','Изображение','Изображение'),B('table','table','Таблица','Таблица')]},
    {t:'Ссылки',items:[B('link','link','Ссылка','Ссылка'),B('eraser','unlink','Убрать ссылку')]},
    {t:'Страницы',items:[B('pagebreak','pagebreak','Разрыв страницы','Разрыв'),B('hr','hr','Горизонтальная линия','Линия')]},
    {t:'Текст',items:[B('quote','quote','Цитата','Цитата'),B('code','codeblock','Блок кода','Код'),B('clock','date','Дата и время','Дата'),
      {k:'sel',id:'rSym',cmd:'symbol',w:96,title:'Символы',opts:[['','Символы…'],['—','— тире'],['©','©'],['®','®'],['™','™'],['§','§'],['±','±'],['°','°'],['→','→'],['✓','✓'],['№','№']]}]},
    {t:'Таблица',items:[B('row','rowAfter','Строка ниже','+ строка'),B('col','colAfter','Столбец справа','+ столбец'),
      B('trash','delTable','Удалить строку/таблицу','Удалить')]}
  ],
  layout:[
    {t:'Страница',items:[{k:'sel',id:'rPage',cmd:'page',w:96,title:'Размер листа',opts:Object.keys(PAGEMM).map(p=>[p,p])},
      {k:'sel',id:'rOrient',cmd:'orient',w:120,title:'Ориентация',opts:[['portrait','Книжная'],['landscape','Альбомная']]}]},
    {t:'Поля',items:[{k:'sel',id:'rMargins',cmd:'margins',w:160,title:'Поля',
      opts:[['normal','Обычные 2/1,5/2/3'],['narrow','Узкие 1,27'],['moderate','Умеренные 2,54'],['wide','Широкие 2,54/5'],['custom','Свои…']]}]},
    {t:'Абзац',items:[{k:'sel',id:'rDocLine',cmd:'docLine',w:88,title:'Интервал документа',opts:[['1','1,0'],['1.15','1,15'],['1.5','1,5'],['2','2,0']]}]},
    {t:'Печать',items:[B('print','print','Печать / PDF','Печать')]}
  ],
  view:[
    {t:'Представление',items:[{k:'sel',id:'rView',cmd:'view',w:190,title:'Режим просмотра',opts:[]}]},
    {t:'Масштаб',items:[B('minus','zoomOut','Уменьшить'),B('plus','zoomIn','Увеличить'),
      {k:'btn',cmd:'zoom100',label:'100%',title:'Сбросить масштаб'},{k:'btn',cmd:'fit',label:'По ширине',title:'Адаптивный лист'}]},
    {t:'Оформление',items:[B('moon','theme','Тема'),B('wrap','toggleWrap','Перенос строк'),B('settings','settings','Все параметры','Параметры'),B('max','fullscreen','Полный экран')]}
  ],
  code:[
    {t:'Правка',items:[B('undo','cUndo','Отменить'),B('redo','cRedo','Вернуть'),
      B('','cSelectAll','Выделить всё','Выделить всё'),B('','cCopyAll','Копировать всё','Копировать')]},
    {t:'Поиск',items:[B('search','cFind','Найти (Ctrl+F)'),B('','cReplace','Заменить (Ctrl+H)','Заменить'),B('','cGoto','Перейти к строке (Ctrl+G)','К строке…')]},
    {t:'Строки',items:[B('code','cComment','Комментировать строку','// Комментарий'),B('row','cDup','Дублировать строку','Дублировать'),
      B('trash','cDel','Удалить строку','Удалить'),B('','cUp','Строку вверх','↑ строка'),B('','cDown','Строку вниз','↓ строка'),
      B('','cSort','Сортировать строки','Сортировать'),B('','cTrim','Убрать хвостовые пробелы','Trim')]},
    {t:'Отступы',items:[B('indent','cIndent','Увеличить отступ'),B('outdent','cOutdent','Уменьшить отступ'),
      B('','cTabs','Табы → пробелы','Табы→пробелы'),{k:'sel',id:'rTab',cmd:'cTabSize',w:64,title:'Размер табуляции',opts:[[2,'2'],[4,'4'],[8,'8']]}]},
    {t:'Формат',items:[B('','cJson','Форматировать JSON','JSON ⇥'),B('','cJsonMin','Сжать JSON','JSON ⇤'),
      B('','cUpper','ВЕРХНИЙ регистр','ABC'),B('','cLower','нижний регистр','abc')]},
    {t:'Вид',items:[{k:'sel',id:'rLang',cmd:'cLang',w:130,title:'Язык подсветки',opts:LANGS},
      B('wrap','cWrap','Перенос строк'),B('minus','cFontDown','Меньше шрифт'),B('plus','cFontUp','Больше шрифт'),
      {k:'sel',id:'rCodeTheme',cmd:'cTheme',w:104,title:'Тема редактора',opts:[['auto','Авто'],['tomorrow_night','Тёмная'],['chrome','Светлая']]},
      B('','cFold','Свернуть всё','Свернуть'),B('','cUnfold','Развернуть всё','Развернуть')]}
  ]
};
function renderRibbon(){
  Object.entries(RIBBON).forEach(([key,groups])=>{
    const panel = $(`[data-panel=${key}]`); panel.innerHTML='';
    groups.forEach(g=>{
      const gd=document.createElement('div'); gd.className='group';
      const row=document.createElement('div'); row.className='group-row';
      g.items.forEach(it=>{
        let el;
        if(it.k==='sel'){
          el=document.createElement('select'); el.className='sel'; el.title=it.title||''; el.style.width=it.w+'px'; el.id=it.id;
          el.innerHTML=it.opts.map(([v,t])=>`<option value="${v}">${t}</option>`).join('');
          el.onchange=()=>{ CMD[it.cmd](el.value); if(it.cmd==='changeCase'||it.cmd==='symbol') el.value=''; };
        } else if(it.k==='clr'){
          el=document.createElement('label'); el.className='clr'; el.title=it.title;
          el.innerHTML=`<svg class="i"><use href="#i-${it.icon}"/></svg><input type="color" value="${it.value}">`;
          el.querySelector('input').oninput=e=>CMD[it.cmd](e.target.value);
        } else {
          el=document.createElement('button'); el.className='tool'+(it.label?' txt':''); el.title=it.title||''; el.dataset.cmd=it.cmd;
          el.innerHTML=(it.icon?`<svg class="i"><use href="#i-${it.icon}"/></svg>`:'')+(it.label||'');
          el.onclick=()=>CMD[it.cmd]();
        }
        row.appendChild(el);
      });
      const lab=document.createElement('div'); lab.className='group-label'; lab.textContent=g.t;
      gd.append(row,lab); panel.appendChild(gd);
    });
  });
}
function tab(name){
  $$('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===name));
  $$('.panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===name));
  if(name==='export') syncExportOpts();
}
function updateRibbonLock(){
  const page = st.view==='page', codeable = st.view==='code'||st.view==='md';
  $$('.panel').forEach(p=>{
    const k=p.dataset.panel;
    p.classList.toggle('locked', (['home','insert','layout'].includes(k)&&!page) || (k==='code'&&!codeable));
  });
}

/* ---------- команды форматирования ---------- */
const doc = () => $('#doc');
const hasSelection = () => { const s=getSelection(); return s && s.rangeCount && !s.isCollapsed && doc().contains(s.anchorNode); };
function focusDoc(){ if(st.view!=='page') setView('page'); doc().focus(); }
function ex(cmd,val=null,css=false){
  focusDoc();
  try{ document.execCommand('styleWithCSS',false,css); }catch(e){}
  try{ document.execCommand(cmd,false,val); }catch(e){}
  touch(); syncTools();
}
function blocksInSelection(){
  const sel=getSelection(); if(!sel.rangeCount) return [];
  const r=sel.getRangeAt(0), out=[];
  doc().querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,li,blockquote,pre,td,th').forEach(el=>{
    if(!el.textContent.trim() && !el.querySelector('img,br')) return;
    const er=document.createRange(); er.selectNodeContents(el);
    if(r.compareBoundaryPoints(Range.END_TO_START,er)<0 && r.compareBoundaryPoints(Range.START_TO_END,er)>0) out.push(el);
  });
  if(!out.length){ const b=caretBlock(); if(b) out.push(b); }
  return out;
}
function caretBlock(){
  const sel=getSelection(); let n=sel.anchorNode;
  while(n&&n!==doc()){ if(n.nodeType===1&&/^(P|DIV|H[1-6]|LI|BLOCKQUOTE|PRE)$/.test(n.tagName)) return n; n=n.parentNode; }
  return null;
}
function caretPx(){
  const sel=getSelection(); let n=sel.anchorNode; if(n&&n.nodeType===3) n=n.parentElement;
  return n&&doc().contains(n)?parseFloat(getComputedStyle(n).fontSize):S.docSize*96/72;
}
function setSizePt(pt){
  pt=Math.min(96,Math.max(6,pt)); focusDoc();
  if(!hasSelection()){ const b=caretBlock(); if(b){ b.style.fontSize=pt+'pt'; touch(); syncTools(); return; } }
  try{ document.execCommand('styleWithCSS',false,false); }catch(e){}
  document.execCommand('fontSize',false,'7');
  const made=[];
  doc().querySelectorAll('font[size="7"]').forEach(f=>{
    const s=document.createElement('span'); s.style.fontSize=pt+'pt'; s.innerHTML=f.innerHTML; f.replaceWith(s); made.push(s);
  });
  doc().querySelectorAll('span[style*="xxx-large"]').forEach(s=>{ s.style.fontSize=pt+'pt'; made.push(s); });
  if(made.length){ const r=document.createRange(); r.setStartBefore(made[0]); r.setEndAfter(made[made.length-1]);
    const sel=getSelection(); sel.removeAllRanges(); sel.addRange(r); }
  touch(); syncTools();
}
function insertHTML(html){ focusDoc(); document.execCommand('insertHTML',false,html); touch(); }
function ensureSizeOption(pt){
  const sel=$('#rSize'); if(!sel) return;
  if([...sel.options].some(o=>+o.value===pt)) return;
  const before=[...sel.options].find(o=>+o.value>pt);
  sel.add(new Option(pt,pt), before||null);
}
const CMD = {
  undo:()=>ex('undo'), redo:()=>ex('redo'), clearFormat:()=>{ex('removeFormat');ex('unlink');},
  bold:()=>ex('bold'), italic:()=>ex('italic'), underline:()=>ex('underline'), strikeThrough:()=>ex('strikeThrough'),
  superscript:()=>ex('superscript'), subscript:()=>ex('subscript'),
  insertUnorderedList:()=>ex('insertUnorderedList'), insertOrderedList:()=>ex('insertOrderedList'),
  indent:()=>ex('indent'), outdent:()=>ex('outdent'),
  justifyLeft:()=>ex('justifyLeft'), justifyCenter:()=>ex('justifyCenter'), justifyRight:()=>ex('justifyRight'), justifyFull:()=>ex('justifyFull'),
  fontName:v=>{ if(hasSelection()) ex('fontName',DOCFONTS[v]||v,true); else { S.docFont=v; $('#expFont').value=v; apply(); toast('Шрифт документа: '+v); } },
  fontSize:v=>setSizePt(parseFloat(v)),
  grow:()=>setSizePt(Math.round(caretPx()*72/96)+1), shrink:()=>setSizePt(Math.round(caretPx()*72/96)-1),
  foreColor:v=>ex('foreColor',v,true), hiliteColor:v=>ex('hiliteColor',v,true),
  formatBlock:v=>ex('formatBlock','<'+v+'>'),
  lineHeight:v=>{ const b=blocksInSelection(); if(!b.length) return; b.forEach(x=>x.style.lineHeight=v); touch(); },
  changeCase:v=>{ if(!v) return; const s=getSelection().toString(); if(!s) return toast('Выделите текст');
    const out={upper:s.toUpperCase(),lower:s.toLowerCase(),title:s.replace(/\p{L}+/gu,w=>w[0].toUpperCase()+w.slice(1).toLowerCase()),
      sentence:s.toLowerCase().replace(/(^|[.!?]\s+)(\p{L})/gu,(m,a,b)=>a+b.toUpperCase())}[v];
    focusDoc(); document.execCommand('insertText',false,out); touch(); },
  symbol:v=>{ if(v) insertHTML(v); },
  image:()=>pickImage(),
  link:async()=>{
    const sel=getSelection().toString();
    const r=await dialog('Вставить ссылку',[{k:'url',l:'Адрес',v:'https://'},{k:'text',l:'Текст',v:sel}]);
    if(r&&r.url) insertHTML(`<a href="${escapeAttr(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.text||r.url)}</a>`);
  },
  unlink:()=>ex('unlink'),
  table:async()=>{
    const r=await dialog('Вставить таблицу',[{k:'rows',l:'Строк',v:3,t:'number'},{k:'cols',l:'Столбцов',v:3,t:'number'},{k:'head',l:'Строка заголовка',v:true,t:'check'}]);
    if(!r) return; const rows=Math.max(1,Math.min(50,+r.rows||1)), cols=Math.max(1,Math.min(12,+r.cols||1));
    let h='<table><tbody>';
    for(let i=0;i<rows;i++){ h+='<tr>'; for(let j=0;j<cols;j++) h+=(i===0&&r.head)?'<th><br></th>':'<td><br></td>'; h+='</tr>'; }
    insertHTML(h+'</tbody></table><p><br></p>');
  },
  rowAfter:()=>tableOp('row'), colAfter:()=>tableOp('col'), delTable:()=>tableOp('del'),
  hr:()=>insertHTML('<hr><p><br></p>'),
  pagebreak:()=>insertHTML('<hr class="page-break"><p><br></p>'),
  quote:()=>ex('formatBlock','<blockquote>'),
  codeblock:()=>insertHTML('<pre><code>код…</code></pre><p><br></p>'),
  date:()=>insertHTML(escapeHtml(new Date().toLocaleString('ru-RU'))),
  find:()=>openFind(),
  page:v=>{S.page=v;apply();}, orient:v=>{S.landscape=v==='landscape';apply();},
  margins:async v=>{
    const P={normal:{t:2,r:1.5,b:2,l:3},narrow:{t:1.27,r:1.27,b:1.27,l:1.27},moderate:{t:2.54,r:2.54,b:2.54,l:2.54},wide:{t:2.54,r:5,b:2.54,l:5}};
    if(P[v]) S.margins=P[v];
    else { const r=await dialog('Свои поля, см',[{k:'t',l:'Верхнее',v:S.margins.t,t:'number'},{k:'r',l:'Правое',v:S.margins.r,t:'number'},{k:'b',l:'Нижнее',v:S.margins.b,t:'number'},{k:'l',l:'Левое',v:S.margins.l,t:'number'}]);
      if(r) S.margins={t:+r.t||0,r:+r.r||0,b:+r.b||0,l:+r.l||0}; }
    apply();
  },
  docLine:v=>{S.docLine=+v;apply();}, print:()=>printDoc(),
  view:v=>setView(v), zoomIn:()=>zoom(10), zoomOut:()=>zoom(-10), zoom100:()=>{S.zoom=100;S.fit=false;apply();},
  fit:()=>{S.fit=!S.fit;S.zoom=100;apply();toast(S.fit?'Лист по ширине экрана':'Печатный вид листа');},
  theme:()=>{S.theme=document.body.dataset.theme==='dark'?'light':'dark';apply();},
  toggleWrap:()=>{S.wrap=!S.wrap;apply();toast('Перенос строк: '+(S.wrap?'вкл':'выкл'));},
  settings:()=>openSheet(true),
  fullscreen:()=>{ document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.(); },
  /* --- инструменты кода --- */
  cUndo:()=>{const e=codeEd();if(e){e.undo();e.focus();}},
  cRedo:()=>{const e=codeEd();if(e){e.redo();e.focus();}},
  cSelectAll:()=>{const e=codeEd();if(e){e.selectAll();e.focus();}},
  cCopyAll:async()=>{const e=codeEd();if(!e)return;try{await navigator.clipboard.writeText(e.getValue());toast('Код скопирован в буфер');}catch(_){toast('Буфер обмена недоступен');}},
  cFind:()=>codeSearch(false), cReplace:()=>codeSearch(true),
  cGoto:async()=>{const e=codeEd();if(!e)return;const r=await dialog('Перейти к строке',[{k:'line',l:'Номер строки',v:1,t:'number'}]);
    if(r){e.gotoLine(Math.max(1,+r.line||1),0,true);e.focus();}},
  cComment:()=>{const e=codeEd();if(e){e.execCommand('togglecomment');e.focus();}},
  cDup:()=>{const e=codeEd();if(e){e.execCommand('copylinesdown');e.focus();}},
  cDel:()=>{const e=codeEd();if(e){e.execCommand('removeline');e.focus();}},
  cUp:()=>{const e=codeEd();if(e){e.execCommand('movelinesup');e.focus();}},
  cDown:()=>{const e=codeEd();if(e){e.execCommand('movelinesdown');e.focus();}},
  cSort:()=>{const e=codeEd();if(!e)return;const sess=e.session,r=e.getSelectionRange();
    let a=r.start.row,b=r.end.row; if(a===b){a=0;b=sess.getLength()-1;}
    const lines=[];for(let i=a;i<=b;i++)lines.push(sess.getLine(i));
    lines.sort((x,y)=>x.localeCompare(y,'ru'));
    const R=ace.require('ace/range').Range;
    sess.replace(new R(a,0,b,sess.getLine(b).length),lines.join('\n'));e.focus();toast('Строки отсортированы');},
  cTrim:()=>{const e=codeEd();if(!e)return;e.setValue(e.getValue().replace(/[ \t]+$/gm,''),-1);e.focus();toast('Хвостовые пробелы удалены');},
  cIndent:()=>{const e=codeEd();if(e){e.execCommand('blockindent');e.focus();}},
  cOutdent:()=>{const e=codeEd();if(e){e.execCommand('blockoutdent');e.focus();}},
  cTabs:()=>{const e=codeEd();if(!e)return;e.setValue(e.getValue().replace(/\t/g,' '.repeat(S.tabSize)),-1);e.focus();toast('Табы заменены пробелами');},
  cTabSize:v=>{S.tabSize=+v;apply();},
  cJson:()=>{const e=codeEd();if(!e)return;try{e.setValue(JSON.stringify(JSON.parse(e.getValue()),null,2),-1);toast('JSON отформатирован');}catch(_){toast('Некорректный JSON');}},
  cJsonMin:()=>{const e=codeEd();if(!e)return;try{e.setValue(JSON.stringify(JSON.parse(e.getValue())),-1);toast('JSON сжат');}catch(_){toast('Некорректный JSON');}},
  cUpper:()=>{const e=codeEd();if(e){e.execCommand('touppercase');e.focus();}},
  cLower:()=>{const e=codeEd();if(e){e.execCommand('tolowercase');e.focus();}},
  cLang:v=>{const e=codeEd();if(!e)return;e.session.setMode('ace/mode/'+v);st.lang=v;e.focus();},
  cWrap:()=>CMD.toggleWrap(),
  cFontDown:()=>{S.codeSize=Math.max(10,S.codeSize-1);apply();},
  cFontUp:()=>{S.codeSize=Math.min(24,S.codeSize+1);apply();},
  cTheme:v=>{S.codeTheme=v;apply();},
  cFold:()=>{const e=codeEd();if(e){e.execCommand('foldall');e.focus();}},
  cUnfold:()=>{const e=codeEd();if(e){e.execCommand('unfoldall');e.focus();}}
};
function codeEd(){
  const e = st.view==='md' ? aceMd : aceCode;
  if(!window.ace || !e || !e.execCommand){ toast('Инструменты кода недоступны'); return null; }
  return e;
}
function codeSearch(repl){
  const e = st.view==='md' ? aceMd : aceCode;
  try{ ace.require('ace/ext/searchbox').Search(e, repl); }
  catch(_){
    dialog(repl?'Заменить в коде':'Найти в коде',[{k:'q',l:'Текст',v:''}]).then(r=>{
      if(!r||!r.q) return;
      if(repl){ e.replaceAll(r.q,{}); toast('Заменено'); }
      else { e.find(r.q,{wrap:true,caseSensitive:false}); e.findNext(); }
      e.focus();
    });
  }
}
function tableOp(op){
  const sel=getSelection(); let n=sel.anchorNode; while(n&&n.nodeType!==1) n=n.parentNode;
  const td=n&&n.closest?.('td,th'); if(!td) return toast('Поставьте курсор в таблицу');
  const tr=td.parentElement, tb=tr.closest('table'), idx=[...tr.children].indexOf(td);
  if(op==='row'){ const r=document.createElement('tr'); r.innerHTML=tr.innerHTML; tr.after(r); }
  if(op==='col'){ [...tb.rows].forEach(r=>{ const c=document.createElement(r.cells[idx]?.tagName||'TD'); c.innerHTML='<br>'; r.cells[idx]?r.cells[idx].after(c):r.appendChild(c); }); }
  if(op==='del'){ tb.rows.length>1?tr.remove():tb.remove(); }
  touch();
}
function syncTools(){
  if(st.view!=='page') return;
  const map={bold:'bold',italic:'italic',underline:'underline',strikeThrough:'strikeThrough',superscript:'superscript',subscript:'subscript',
    insertUnorderedList:'insertUnorderedList',insertOrderedList:'insertOrderedList',justifyLeft:'justifyLeft',justifyCenter:'justifyCenter',justifyRight:'justifyRight',justifyFull:'justifyFull'};
  $$('.tool[data-cmd]').forEach(b=>{ const c=b.dataset.cmd; if(map[c]){ try{ b.classList.toggle('on',document.queryCommandState(map[c])); }catch(e){} }});
  const sel=getSelection(); let n=sel.anchorNode; if(n&&n.nodeType===3) n=n.parentElement;
  if(n&&doc().contains(n)){
    const cs=getComputedStyle(n);
    const f=Object.keys(DOCFONTS).find(k=>cs.fontFamily.toLowerCase().includes(k.toLowerCase()));
    if(f&&$('#rFont')) $('#rFont').value=f;
    const pt=Math.round(parseFloat(cs.fontSize)*72/96*2)/2;
    ensureSizeOption(pt);
    if($('#rSize')) $('#rSize').value=pt;
    const b=caretBlock();
    if(b&&$('#rBlock')) $('#rBlock').value=b.tagName.toLowerCase().replace('div','p');
  }
}

/* ---------- режимы просмотра ---------- */
const VIEWS={welcome:'v-welcome',page:'v-page',fidelity:'v-fidelity',md:'v-md',code:'v-code',html:'v-html',pdf:'v-pdf'};
const VIEWNAME={welcome:'Обзор',page:'Страница (Word)',fidelity:'Точный вид DOCX',md:'Markdown',code:'Код',html:'Просмотр HTML',pdf:'PDF'};
function availableViews(){
  if(st.kind==='docx') return ['fidelity','page'];
  if(st.kind==='md') return ['md','page','code'];
  if(st.kind==='html') return ['code','html'];
  if(st.kind==='code') return ['code'];
  if(st.kind==='pdf') return ['pdf'];
  if(st.kind==='rich'||st.kind==='txt') return ['page','code'];
  return ['welcome'];
}
function setView(v){
  const list=availableViews(), prev=st.view;
  if(!list.includes(v)) v=list[0];
  if(prev==='page'&&v==='md'&&st.kind==='md'&&doc().dataset.fromMd==='1'&&window.TurndownService){
    const td=new TurndownService({headingStyle:'atx',codeBlockStyle:'fenced',bulletListMarker:'-'});
    if(window.turndownPluginGfm) td.use(turndownPluginGfm.gfm);
    aceMd.setValue(td.turndown(doc().innerHTML),-1);
  }
  st.view=v;
  Object.entries(VIEWS).forEach(([k,id])=>$('#'+id).classList.toggle('active',k===v));
  $('#kindBadge').textContent = st.kind==='none'?'—':st.kind.toUpperCase();
  $('#stView').textContent = VIEWNAME[v]||'—';
  $('#viewChips').innerHTML = v==='welcome' ? '' :
    list.map(k=>`<button class="chip${k===v?' on':''}" data-v="${k}">${VIEWNAME[k]}</button>`).join('');
  $$('#viewChips .chip').forEach(c=>c.onclick=()=>setView(c.dataset.v));
  const vs=$('#rView'); if(vs){ vs.innerHTML=list.map(k=>`<option value="${k}">${VIEWNAME[k]}</option>`).join(''); vs.value=v; }
  $('#zoomIn').disabled=$('#zoomOut').disabled = (v==='welcome'||v==='html');
  $('#btnClose').disabled = (v==='welcome');
  if(v==='page'&&st.kind==='md'&&doc().dataset.fromMd!=='1'){ doc().innerHTML=mdToHtml(aceMd.getValue()); doc().dataset.fromMd='1'; }
  if(v==='md'){ setTimeout(()=>aceMd.resize(),30); renderMd(); }
  if(v==='code'){ setTimeout(()=>aceCode.resize(),30); if($('#rLang')) $('#rLang').value=st.lang||'text'; }
  if(v==='html') renderHtmlPreview();
  if(v==='pdf'&&!$('#pdfPages').childElementCount&&st.pdf) renderPdf().catch(e=>toast('PDF: '+e.message));
  updateRibbonLock();
  const cur=$('.tab.active')?.dataset.tab;
  if((v==='code'||v==='md')&&['home','insert','layout'].includes(cur)) tab('code');
  if(v==='page'&&cur==='code') tab('home');
  if(v==='html'&&['home','insert','layout','code'].includes(cur)) tab('view');
  updateStats();
}
function updateStats(){
  let text='';
  if(st.view==='page'||st.view==='fidelity') text=doc().innerText;
  else if(st.view==='md') text=aceMd.getValue();
  else if(st.view==='code'||st.view==='html') text=aceCode.getValue();
  const words=(text.match(/[\p{L}\p{N}'’-]+/gu)||[]).length;
  $('#stWords').textContent=words+' слов'; $('#stChars').textContent=text.length+' символов';
}
function touch(){ st.dirty=true; document.body.classList.add('is-dirty'); $('#stSaved').textContent='изменено'; updateStats(); scheduleAuto(); }
function clean(){ st.dirty=false; document.body.classList.remove('is-dirty'); $('#stSaved').textContent='сохранено'; }

/* ---------- HTML: изолированный просмотр ---------- */
function renderHtmlPreview(){
  const f=$('#htmlFrame'); if(!f) return;
  const w=$('#htmlWidth').value;
  f.style.width = w==='auto' ? '100%' : w+'px';
  f.srcdoc = aceCode.getValue();
}
function scheduleHtmlPreview(){
  if(st.kind!=='html'||st.view!=='html') return;
  clearTimeout(htmlTimer); htmlTimer=setTimeout(renderHtmlPreview,350);
}
function htmlOpenTab(){
  const blob=new Blob([aceCode.getValue()],{type:'text/html;charset=utf-8'});
  const u=URL.createObjectURL(blob);
  window.open(u,'_blank','noopener');
  setTimeout(()=>URL.revokeObjectURL(u),60000);
}
function htmlPreviewPrint(){
  const f=$('#htmlFrame');
  try{ f.contentWindow.focus(); f.contentWindow.print(); }
  catch(e){ htmlOpenTab(); toast('Открыто в новой вкладке — печать браузера'); }
}
/* HTML → изолированный HTML со скоупленными стилями для экспорта в DOCX */
function htmlExportSource(){
  return new Promise(resolve=>{
    const raw=aceCode.getValue();
    let done=false, timer=null;
    const f=document.createElement('iframe');
    f.setAttribute('sandbox','allow-same-origin');
    f.style.cssText='position:fixed;left:-99999px;top:0;width:900px;height:1200px;border:0;visibility:hidden';
    const finish=v=>{ if(done) return; done=true; clearTimeout(timer); try{f.remove();}catch(e){} resolve(v); };
    timer=setTimeout(()=>finish(sanitize(raw)),4000);
    f.onload=()=>{
      try{
        const d=f.contentDocument;
        const walk=rules=>{
          let out='';
          for(const r of rules){
            if(r.type===1){
              const sel=r.selectorText.split(',').map(s=>{
                s=s.trim().replace(/^(html|body|:root)(?![\w-])/i,'').trim();
                return s ? '#dx-scope '+s : '#dx-scope';
              }).join(',');
              out+=sel+'{'+r.style.cssText+'}';
            } else if(r.type===4) out+='@media '+r.conditionText+'{'+walk(r.cssRules)+'}';
            else if(r.type===12) out+='@supports '+r.conditionText+'{'+walk(r.cssRules)+'}';
            else if(r.cssText) out+=r.cssText;
          }
          return out;
        };
        let css='';
        for(const sh of d.styleSheets){ try{ css+=walk(sh.cssRules); }catch(e){} }
        finish('<style>'+css+'</style><div id="dx-scope">'+d.body.innerHTML+'</div>');
      }catch(e){ finish(sanitize(raw)); }
    };
    f.srcdoc=raw;
    document.body.appendChild(f);
  });
}

/* ---------- файлы ---------- */
const extOf=n=>(n.split('.').pop()||'').toLowerCase();
const baseName=()=>($('#fileName').value||'Документ').replace(/\.[^.]+$/,'');
async function openFile(){
  if(window.showOpenFilePicker){
    try{ const [h]=await window.showOpenFilePicker({multiple:false}); return loadFile(await h.getFile(),h); }
    catch(e){ if(e.name==='AbortError') return; }
  }
  $('#fileInput').click();
}
async function loadFile(file,handle){
  const ext=extOf(file.name);
  if(ext==='doc') return toast('Формат .doc не поддерживается — пересохраните как .docx');
  try{
    st.name=file.name; st.handle=handle||null; st.original=file; st.pdf=null; st.docxBuf=null; st.lang=null;
    doc().dataset.fromMd=''; doc().innerHTML=''; expNameTouched=false;
    $('#fileName').value=file.name; $('#stSize').textContent=(file.size/1024).toFixed(1)+' КБ';
    $('#pdfPages').innerHTML=''; $('#htmlFrame').srcdoc='';
    if(ext==='pdf'){ st.kind='pdf'; await openPdf(file); setView('pdf'); tab('view'); }
    else if(ext==='docx'){ st.kind='docx'; await openDocx(file); tab('home'); }
    else if(ext==='md'||ext==='markdown'){ st.kind='md'; st.lang='markdown'; aceMd.setValue(await file.text(),-1); renderMd(); setView('md'); }
    else if(ext==='html'||ext==='htm'){
      st.kind='html'; st.lang='html';
      aceCode.setValue(await file.text(),-1); aceCode.session.setMode('ace/mode/html');
      setView('code');
    }
    else if(EXTMODE[ext]){
      const t=await file.text(); st.lang=EXTMODE[ext];
      aceCode.setValue(t,-1); aceCode.session.setMode('ace/mode/'+EXTMODE[ext]);
      if(ext==='txt'||ext==='csv'){ st.kind='txt'; doc().innerHTML='<pre>'+escapeHtml(t)+'</pre>'; setView('page'); tab('home'); }
      else { st.kind='code'; setView('code'); }
    }
    else { st.kind='code'; st.lang='text'; aceCode.setValue(await file.text(),-1); setView('code'); }
    clean(); toast('Открыто: '+file.name);
  }catch(e){ console.error(e); toast('Не удалось открыть файл: '+e.message); }
}
function newDoc(){
  st.kind='rich'; st.name='Документ.docx'; st.handle=null; st.original=null; st.docxBuf=null; st.pdf=null; st.lang=null;
  doc().dataset.fromMd=''; expNameTouched=false;
  doc().innerHTML='<h1>Заголовок документа</h1><p><br></p>';
  $('#fileName').value=st.name; $('#stSize').textContent='—'; setView('page'); tab('home'); clean(); focusDoc();
}
function resetWorkspace(){
  st.kind='none'; st.handle=null; st.original=null; st.docxBuf=null; st.pdf=null; st.lang=null; st.name='Документ.docx';
  doc().innerHTML=''; doc().dataset.fromMd='';
  aceMd.setValue('',-1); aceCode.setValue('',-1);
  $('#pdfPages').innerHTML=''; $('#docxView').innerHTML=''; $('#htmlFrame').srcdoc='';
  const s=$('#docxStyles'); if(s) s.innerHTML='';
  $('#fileName').value='Документ.docx'; $('#stSize').textContent='—';
  expNameTouched=false;
  try{ localStorage.removeItem('de.auto'); }catch(e){}
  clean(); setView('welcome'); tab('home');
}
async function closeFile(){
  if(st.view==='welcome') return;
  if(st.dirty){
    const r=await dialog('Закрыть файл',[{k:'msg',l:'Есть несохранённые изменения. Закрыть без сохранения?',t:'note'}]);
    if(!r) return;
  }
  resetWorkspace(); toast('Файл закрыт');
}
async function openDocx(file){
  const buf=await file.arrayBuffer(); st.docxBuf=buf;
  $('#docxView').innerHTML='';
  let sty=$('#docxStyles');
  if(!sty){ sty=document.createElement('div'); sty.id='docxStyles'; document.body.appendChild(sty); }
  sty.innerHTML='';
  try{
    if(!window.docx?.renderAsync) throw new Error('no renderer');
    await docx.renderAsync(buf.slice(0),$('#docxView'),null,{inWrapper:true,breakPages:true,experimental:true,useBase64URL:true});
  }catch(e){ $('#docxView').innerHTML='<p class="note">Точный рендер недоступен — используется упрощённое представление.</p>'; }
  let html='';
  try{
    if(!window.docx?.renderAsync) throw new Error('no renderer');
    const tmp=document.createElement('div');
    await docx.renderAsync(buf.slice(0),tmp,sty,{inWrapper:false,breakPages:false,ignoreHeight:true,ignoreWidth:true,
      renderHeaders:false,renderFooters:false,experimental:true,useBase64URL:true});
    html=tmp.innerHTML;
    if(!html.replace(/<[^>]+>/g,'').trim()) throw new Error('empty');
  }catch(e){
    try{
      const opt={styleMap:["p[style-name='Quote'] => blockquote:fresh","p[style-name='Intense Quote'] => blockquote:fresh","r[style-name='Code'] => code"]};
      let res; try{ res=await mammoth.convertToHtml({arrayBuffer:buf.slice(0)},opt); }
      catch(_){ res=await mammoth.convertToHtml({arrayBuffer:buf.slice(0)}); }
      html=res.value;
    }catch(e2){ html='<p>Не удалось прочитать документ.</p>'; }
  }
  doc().innerHTML=sanitize(html);
  setView('fidelity');
}
async function openPdf(file){
  if(!window.pdfjsLib) throw new Error('PDF-движок не загружен');
  pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  st.pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;
}
async function renderPdf(){
  const host=$('#pdfPages'); host.innerHTML='';
  for(let i=1;i<=st.pdf.numPages;i++){
    const p=await st.pdf.getPage(i), vp=p.getViewport({scale:st.pdfScale});
    const c=document.createElement('canvas'); c.width=vp.width; c.height=vp.height; host.appendChild(c);
    await p.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
  }
}
async function pdfExtract(){
  if(!st.pdf) return;
  let html='';
  for(let i=1;i<=st.pdf.numPages;i++){
    const tc=await (await st.pdf.getPage(i)).getTextContent(); let line='',lines=[];
    tc.items.forEach(it=>{ line+=it.str; if(it.hasEOL){lines.push(line);line='';} });
    if(line) lines.push(line);
    html+=`<h2>Страница ${i}</h2>`+lines.map(l=>`<p>${escapeHtml(l)||'<br>'}</p>`).join('');
  }
  st.kind='rich'; st.name=baseName()+'.docx'; $('#fileName').value=st.name; expNameTouched=false;
  doc().dataset.fromMd=''; doc().innerHTML=html; setView('page'); touch(); toast('Текст извлечён — можно редактировать');
}
function renderMd(){
  $('#mdPreview').innerHTML=mdToHtml(aceMd.getValue());
  if(window.hljs) $('#mdPreview').querySelectorAll('pre code').forEach(b=>{ try{ hljs.highlightElement(b); }catch(e){} });
  updateStats();
}
function sanitize(html){
  const t=document.createElement('template'); t.innerHTML=html;
  t.content.querySelectorAll('script,iframe,object,embed,meta,link').forEach(n=>n.remove());
  t.content.querySelectorAll('*').forEach(n=>[...n.attributes].forEach(a=>{
    if(/^on/i.test(a.name)||/javascript:/i.test(a.value)) n.removeAttribute(a.name);
  }));
  return t.innerHTML;
}
function pickImage(){
  const i=document.createElement('input'); i.type='file'; i.accept='image/*';
  i.onchange=()=>{ const f=i.files[0]; if(!f) return; const fr=new FileReader();
    fr.onload=()=>insertHTML(`<img src="${fr.result}" alt="${escapeAttr(f.name)}">`); fr.readAsDataURL(f); };
  i.click();
}

/* ---------- примеры ---------- */
const SAMPLES = {
  word:{ name:'План запуска.docx', kind:'rich', html:
`<h1>План запуска продукта</h1>
<p><b>DocEditor</b> — универсальный редактор документов. Этот пример показывает стили, списки, таблицы и цитаты, которые переносятся в настоящий <i>.docx</i>.</p>
<h2>Ключевые этапы</h2>
<ul><li>Исследование и прототип — <b>неделя 1–2</b></li><li>Бета-версия и обратная связь — <u>неделя 3–4</u></li><li>Публичный запуск и PWA — неделя 5</li></ul>
<h2>Бюджет</h2>
<table><tbody><tr><th>Статья</th><th>Сумма</th><th>Статус</th></tr>
<tr><td>Дизайн</td><td>120 000 ₽</td><td>Готово</td></tr>
<tr><td>Разработка</td><td>260 000 ₽</td><td>В работе</td></tr>
<tr><td>Маркетинг</td><td>90 000 ₽</td><td>Запланировано</td></tr></tbody></table>
<blockquote>Хороший инструмент не мешает думать — он убирает трение между идеей и документом.</blockquote>
<p>Автор проекта: <a href="https://vk.ru/archigpt" target="_blank" rel="noopener">vk.ru/archigpt</a></p>` },
  md:{ name:'Заметки.md', kind:'md', text:
`# Заметки команды

> Живой предпросмотр Markdown: редактируйте слева — справа результат.

## Задачи на неделю
- [x] Экспорт в .docx
- [x] Подсветка кода
- [ ] Колонтитулы в DOCX

## Метрики
| Показатель | Значение |
|---|---|
| Открытий файлов | 1 248 |
| Экспортов .docx | 312 |
| Установок PWA | 96 |

## Пример кода
\`\`\`js
const greet = name => \`Привет, \${name}!\`;
console.log(greet('DocEditor'));
\`\`\`
` },
  py:{ name:'analysis.py', kind:'code', lang:'python', text:
`"""Анализ продаж: демо-скрипт для DocEditor."""
from dataclasses import dataclass
from statistics import mean


@dataclass
class Sale:
    region: str
    amount: float


SALES = [
    Sale("Москва", 128_400),
    Sale("Казань", 96_200),
    Sale("Новосибирск", 71_900),
]


def total(sales):
    return sum(s.amount for s in sales)


def report(sales):
    avg = mean(s.amount for s in sales)
    for s in sorted(sales, key=lambda x: -x.amount):
        share = s.amount / total(sales) * 100
        print(f"{s.region:<14} {s.amount:>10,.0f} руб.  {share:5.1f}%")
    print(f"{'Среднее':<14} {avg:>10,.0f} руб.")


if __name__ == "__main__":
    report(SALES)
` },
  html:{ name:'landing.html', kind:'html', lang:'html', text:
`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Мини-лендинг</title>
  <style>
    body { font-family: system-ui; margin: 0; background: #0b0f17; color: #e8ecf5; }
    .hero { padding: 64px 24px; text-align: center; }
    .btn { display: inline-block; padding: 12px 22px; border-radius: 10px;
           background: #4f8cff; color: #fff; text-decoration: none; }
  </style>
</head>
<body>
  <section class="hero">
    <h1>DocEditor</h1>
    <p>Документы, Markdown и код — в одном месте.</p>
    <a class="btn" href="https://vk.ru/archigpt">Сообщество автора</a>
  </section>
</body>
</html>
` }
};
function loadSample(key){
  const s=SAMPLES[key]; if(!s) return;
  st.handle=null; st.original=null; st.docxBuf=null; st.pdf=null; st.lang=s.lang||null;
  st.name=s.name; st.kind=s.kind; expNameTouched=false;
  doc().dataset.fromMd=''; doc().innerHTML='';
  $('#fileName').value=s.name; $('#stSize').textContent='пример';
  $('#pdfPages').innerHTML=''; $('#docxView').innerHTML=''; $('#htmlFrame').srcdoc='';
  if(s.kind==='rich'){ doc().innerHTML=s.html; setView('page'); tab('home'); }
  else if(s.kind==='md'){ aceMd.setValue(s.text,-1); renderMd(); setView('md'); }
  else { aceCode.setValue(s.text,-1); aceCode.session.setMode('ace/mode/'+s.lang); setView('code'); }
  clean(); toast('Открыт пример: '+s.name);
}

/* ---------- экспорт ---------- */
function docxOpts(){
  return { page:$('#expPage').value, landscape:$('#expOrient').value==='landscape',
    margins:{t:+$('#mT').value,r:+$('#mR').value,b:+$('#mB').value,l:+$('#mL').value},
    font:$('#expFont').value, size:+$('#expSize').value, line:+$('#expLine').value,
    images:$('#expImages').checked, plain:!$('#expStyles').checked, title:baseName(), author:'DocEditor' };
}
function syncExportOpts(){
  if(!expNameTouched) $('#expName').value=baseName();
  $('#expPage').value=S.page; $('#expOrient').value=S.landscape?'landscape':'portrait';
  $('#expSize').value=S.docSize; $('#expLine').value=String(S.docLine);
  $('#mT').value=S.margins.t; $('#mR').value=S.margins.r; $('#mB').value=S.margins.b; $('#mL').value=S.margins.l;
  const noDoc = st.kind==='none';
  $$('#exportGrid .card').forEach(c=>c.disabled=noDoc);
  $('#expDownload').disabled=noDoc; $('#expSaveAs').disabled=noDoc;
  $('#expHint').textContent = noDoc ? 'Создайте или откройте документ, чтобы экспортировать его.'
    : st.kind==='pdf' ? 'PDF нельзя преобразовать в DOCX напрямую — нажмите «Извлечь текст» на вкладке PDF.'
    : 'Формат: '+st.exportFmt.toUpperCase()+'. Всё собирается локально, файлы не покидают устройство.';
}
function sourceHtml(){
  if(st.kind==='html') return sanitize(aceCode.getValue());
  if(st.view==='page'||st.view==='fidelity'||st.kind==='rich'||st.kind==='docx') return doc().innerHTML;
  if(st.kind==='md') return mdToHtml(aceMd.getValue());
  if(st.view==='code') return '<pre>'+escapeHtml(aceCode.getValue())+'</pre>';
  return doc().innerHTML;
}
function sourceText(){
  if(st.kind==='html') return aceCode.getValue();
  if(st.kind==='md'&&st.view!=='page') return aceMd.getValue();
  if(st.view==='code') return aceCode.getValue();
  return doc().innerText;
}
function toMarkdown(){
  if(st.kind==='md'&&st.view!=='page') return aceMd.getValue();
  if(!window.TurndownService) return sourceText();
  const td=new TurndownService({headingStyle:'atx',codeBlockStyle:'fenced',bulletListMarker:'-'});
  if(window.turndownPluginGfm) td.use(turndownPluginGfm.gfm);
  return td.turndown(sourceHtml());
}
function fullHtml(){
  const m=S.margins;
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(baseName())}</title>
<style>body{margin:0;background:#f2f3f7;font-family:${DOCFONTS[S.docFont]};font-size:${S.docSize}pt;line-height:${S.docLine}}
.page{max-width:${(PAGEMM[S.page]||PAGEMM.A4)[0]}mm;margin:20px auto;background:#fff;padding:${m.t}cm ${m.r}cm ${m.b}cm ${m.l}cm;box-shadow:0 6px 24px rgba(0,0,0,.12)}
h1,h2,h3{line-height:1.25}table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:.4em .6em}
blockquote{border-left:3px solid #4f8cff;margin:1em 0;padding:.3em .9em;color:#445}
pre{background:#f5f5f5;padding:.8em;border-radius:6px;overflow:auto}img{max-width:100%}
hr.page-break{page-break-after:always;border:0}
@media print{body{background:#fff}.page{box-shadow:none;margin:0;max-width:none;padding:0}}
</style></head><body><div class="page">${sourceHtml()}</div></body></html>`;
}
async function buildBlob(fmt){
  const name=($('#expName').value||baseName()).replace(/[\\/:*?"<>|]/g,'_');
  switch(fmt){
    case 'docx': {
      if(st.kind==='pdf') throw new Error('сначала извлеките текст из PDF');
      if(!window.DocxExport) throw new Error('модуль экспорта не загружен');
      const opts=docxOpts();
      const b = st.view==='page' ? await DocxExport.fromElement(doc(),opts)
        : await DocxExport.fromHtml(st.kind==='html' ? await htmlExportSource() : sourceHtml(), opts);
      return {blob:b,name:name+'.docx'};
    }
    case 'html': {
      const html = st.kind==='html' ? aceCode.getValue() : fullHtml();
      return {blob:new Blob([html],{type:'text/html;charset=utf-8'}),name:name+'.html'};
    }
    case 'md':   return {blob:new Blob([toMarkdown()],{type:'text/markdown;charset=utf-8'}),name:name+'.md'};
    case 'txt':  return {blob:new Blob([sourceText()],{type:'text/plain;charset=utf-8'}),name:name+'.txt'};
    case 'src': {
      if(st.original&&(st.kind==='pdf'||st.kind==='code'||st.kind==='md'||st.kind==='docx'||st.kind==='html')) return {blob:st.original,name:st.name};
      return {blob:new Blob([sourceText()],{type:'text/plain;charset=utf-8'}),name:name+'.'+(extOf(st.name)||'txt')};
    }
    default: throw new Error('неизвестный формат');
  }
}
function download(blob,name){
  const u=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=u; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),3000);
}
async function exportRun(saveAs){
  if(st.kind==='none') return toast('Сначала создайте или откройте документ');
  const fmt=st.exportFmt;
  if(fmt==='pdf') return printDoc();
  try{
    const {blob,name}=await buildBlob(fmt);
    if(saveAs&&window.showSaveFilePicker){
      const h=await window.showSaveFilePicker({suggestedName:name,types:[{description:fmt.toUpperCase(),accept:{[blob.type]:['.'+extOf(name)]}}]});
      const w=await h.createWritable(); await w.write(blob); await w.close();
      if(extOf(name)===extOf(st.name)) st.handle=h;
      clean(); toast('Сохранено: '+name); return;
    }
    download(blob,name); clean(); toast('Экспортировано: '+name);
  }catch(e){ console.error(e); toast('Ошибка экспорта: '+e.message); }
}
function printDoc(){
  if(st.kind==='html'){ if(st.view!=='html') setView('html'); setTimeout(htmlPreviewPrint,350); return; }
  if(!availableViews().includes('page')) return toast('Печать доступна в режиме «Страница»');
  if(st.view!=='page') setView('page');
  setTimeout(()=>window.print(),150);
}
async function save(){
  if(st.kind==='none') return toast('Нет открытого документа');
  const ext=extOf($('#fileName').value);
  if(ext==='docx'||st.kind==='rich'||st.kind==='docx'){ st.exportFmt='docx'; return exportRun(true); }
  if(st.kind==='pdf'&&st.original){ download(st.original,st.name); return; }
  const text = ext==='md' ? toMarkdown() : sourceText();
  const blob=new Blob([text],{type:st.kind==='html'?'text/html;charset=utf-8':'text/plain;charset=utf-8'});
  try{
    if(st.handle){ const w=await st.handle.createWritable(); await w.write(blob); await w.close(); }
    else if(window.showSaveFilePicker){
      const h=await window.showSaveFilePicker({suggestedName:$('#fileName').value});
      const w=await h.createWritable(); await w.write(blob); await w.close(); st.handle=h;
    } else download(blob,$('#fileName').value);
    clean(); toast('Сохранено');
  }catch(e){ if(e.name!=='AbortError') toast('Не сохранено: '+e.message); }
}

/* ---------- поиск и замена ---------- */
let lastRange=null;
function openFind(){
  if(!availableViews().includes('page')) return toast('Поиск доступен в режиме «Страница»');
  if(st.view!=='page') setView('page');
  $('#findModal').hidden=false; $('#fInfo').textContent=''; $('#fQuery').focus(); $('#fQuery').select();
}
function textNodes(){ const w=document.createTreeWalker(doc(),NodeFilter.SHOW_TEXT); const a=[]; let n; while(n=w.nextNode()) a.push(n); return a; }
function findNext(){
  const q=$('#fQuery').value; if(!q) return false;
  const cs=$('#fCase').checked, nodes=textNodes(), sel=getSelection();
  let start=0, offset=0;
  if(lastRange){ const i=nodes.indexOf(lastRange.startContainer); if(i>=0){ start=i; offset=lastRange.endOffset; } }
  for(let i=start;i<nodes.length;i++){
    const t=nodes[i].nodeValue, hay=cs?t:t.toLowerCase(), needle=cs?q:q.toLowerCase();
    const idx=hay.indexOf(needle,i===start?offset:0);
    if(idx>=0){
      const r=document.createRange(); r.setStart(nodes[i],idx); r.setEnd(nodes[i],idx+q.length);
      sel.removeAllRanges(); sel.addRange(r); lastRange=r;
      nodes[i].parentElement.scrollIntoView({block:'center',behavior:'smooth'});
      $('#fInfo').textContent='Совпадение выделено'; return true;
    }
  }
  lastRange=null; $('#fInfo').textContent='Совпадений больше нет'; return false;
}
function replaceOne(){
  const sel=getSelection();
  if(sel.rangeCount&&!sel.isCollapsed&&lastRange){ focusDoc(); document.execCommand('insertText',false,$('#fRepl').value); touch(); lastRange=null; }
  findNext();
}
function replaceAll(){
  const q=$('#fQuery').value; if(!q) return;
  const cs=$('#fCase').checked, rx=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),cs?'g':'gi');
  let n=0; textNodes().forEach(t=>{ const c=(t.nodeValue.match(rx)||[]).length; if(c){ n+=c; t.nodeValue=t.nodeValue.replace(rx,$('#fRepl').value); }});
  lastRange=null; touch(); $('#fInfo').textContent='Заменено: '+n;
}

/* ---------- диалоги / панели ---------- */
function closeDialog(value){
  $('#dlg').hidden=true;
  const r=dlgResolve; dlgResolve=null;
  if(r) r(value);
}
function collectDialog(){
  const o={}; $$('#dlgFields [data-k]').forEach(i=>o[i.dataset.k]=i.type==='checkbox'?i.checked:i.value); return o;
}
function dialog(title,fields){
  return new Promise(res=>{
    if(dlgResolve) closeDialog(null);
    $('#dlgTitle').textContent=title;
    $('#dlgFields').innerHTML=fields.map(f=>{
      if(f.t==='note') return `<p class="hint">${escapeHtml(f.l)}</p>`;
      if(f.t==='check') return `<label class="chk"><input type="checkbox" data-k="${f.k}" ${f.v?'checked':''}>${f.l}</label>`;
      return `<label class="fld">${f.l}<input type="${f.t||'text'}" data-k="${f.k}" value="${escapeAttr(f.v??'')}"></label>`;
    }).join('');
    dlgResolve=res; $('#dlg').hidden=false;
    const first=$('#dlgFields input'); if(first){ first.focus(); if(first.select) first.select(); }
  });
}
const openSheet=v=>{ $('#sheet').hidden=!v; $('#sheetOverlay').hidden=!v; };
let toastT; function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('on'),2800); }
function zoom(d){ S.fit=false; S.zoom=Math.min(250,Math.max(40,S.zoom+d)); apply(); }

/* ---------- автосохранение ---------- */
function scheduleAuto(){
  if(!S.autosave) return; clearTimeout(autoTimer);
  autoTimer=setTimeout(()=>{
    try{
      localStorage.setItem('de.auto',JSON.stringify({name:$('#fileName').value,kind:st.kind,view:st.view,lang:st.lang,
        html:doc().innerHTML,md:aceMd?.getValue(),code:aceCode?.getValue(),ts:Date.now()}));
      $('#stSaved').textContent='автосохранено';
    }catch(e){ $('#stSaved').textContent='автосохранение недоступно'; }
  },1200);
}
function restoreAuto(){
  try{
    const a=JSON.parse(localStorage.getItem('de.auto')||'null');
    if(!a||Date.now()-a.ts>7*864e5) return false;
    st.kind=(a.kind==='none'||a.kind==='pdf'||a.kind==='docx')?'rich':a.kind;
    st.name=a.name||'Документ.docx'; st.lang=a.lang||null; $('#fileName').value=st.name;
    doc().innerHTML=a.html||'';
    if(a.md!=null) aceMd.setValue(a.md,-1);
    if(a.code!=null) aceCode.setValue(a.code,-1);
    if(st.kind==='md'&&a.html) doc().dataset.fromMd='1';
    if(st.lang&&window.ace) aceCode.session.setMode('ace/mode/'+st.lang);
    let v=a.view;
    if(st.kind==='html'&&v==='page') v='code';
    if(v==='fidelity') v='page';
    setView(v); renderMd(); clean();
    toast('Восстановлен несохранённый документ'); return true;
  }catch(e){ return false; }
}

/* ---------- редакторы (с запасным вариантом) ---------- */
function makeEditor(id,mode){
  if(window.ace){
    const a=ace.edit(id);
    a.setOptions({showPrintMargin:false,useWorker:false,enableBasicAutocompletion:true,enableLiveAutocompletion:true,wrap:true});
    a.$blockScrolling=Infinity; a.session.setMode('ace/mode/'+mode);
    return a;
  }
  const host=document.getElementById(id);
  host.innerHTML='<textarea class="fallback-ed" spellcheck="false"></textarea>';
  const ta=host.firstChild, subs=[];
  ta.addEventListener('input',()=>subs.forEach(f=>f()));
  return {
    getValue:()=>ta.value,
    setValue:v=>{ ta.value=v; subs.forEach(f=>f()); },
    session:{ setMode(){}, setTabSize(v){ ta.style.tabSize=v; }, setUseWrapMode(v){ ta.wrap=v?'soft':'off'; } },
    setFontSize(v){ ta.style.fontSize=v+'px'; }, setTheme(){}, resize(){}, focus(){ ta.focus(); },
    on(ev,f){ if(ev==='change') subs.push(f); }
  };
}

/* ---------- инициализация ---------- */
window.addEventListener('DOMContentLoaded',()=>{
  renderRibbon();
  const fo=Object.keys(DOCFONTS).map(f=>`<option>${f}</option>`).join('');
  $('#expFont').innerHTML=fo; $('#expFont').value=S.docFont; $('#setDocFont').innerHTML=fo;
  $('#accents').innerHTML=['#4f8cff','#22c55e','#a855f7','#f59e0b','#ef4444','#06b6d4','#ec4899']
    .map(c=>`<button class="sw" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('');
  $$('#accents .sw').forEach(b=>b.onclick=()=>{S.accent=b.dataset.c;apply();});

  aceMd=makeEditor('aceMd','markdown'); aceCode=makeEditor('aceCode','text');
  aceMd.on('change',()=>{ clearTimeout(mdTimer); mdTimer=setTimeout(renderMd,180); touch(); });
  aceCode.on('change',()=>{ touch(); scheduleHtmlPreview(); });
  apply();

  $('#btnNew').onclick=newDoc; $('#wNew').onclick=newDoc;
  $('#btnOpen').onclick=openFile; $('#wOpen').onclick=openFile;
  $('#btnSave').onclick=save; $('#btnClose').onclick=closeFile;
  $('#btnTheme').onclick=()=>CMD.theme();
  $('#btnSettings').onclick=()=>openSheet(true);
  $('#ribbonTabs').onclick=e=>{ const t=e.target.closest('.tab'); if(t) tab(t.dataset.tab); };
  $('#fileInput').onchange=e=>{ const f=e.target.files[0]; if(f) loadFile(f); e.target.value=''; };
  $('#fileName').onchange=()=>{ st.name=$('#fileName').value; expNameTouched=false; syncExportOpts(); touch(); };
  $('#toEdit').onclick=()=>setView('page');
  $('#pdfExtract').onclick=()=>pdfExtract().catch(e=>toast('PDF: '+e.message));
  $('#pdfSave').onclick=()=>st.original&&download(st.original,st.name);
  $('#zoomIn').onclick=()=>zoom(10); $('#zoomOut').onclick=()=>zoom(-10);
  $$('.samples [data-sample]').forEach(b=>b.onclick=()=>loadSample(b.dataset.sample));
  $('#htmlWidth').onchange=renderHtmlPreview;
  $('#htmlRefresh').onclick=()=>{ renderHtmlPreview(); toast('Просмотр обновлён'); };
  $('#htmlOpen').onclick=htmlOpenTab;
  $('#htmlPrint').onclick=htmlPreviewPrint;
  $$('.md-tabs button').forEach(b=>b.onclick=()=>{
    $$('.md-tabs button').forEach(x=>x.classList.toggle('active',x===b));
    document.body.classList.remove('md-edit','md-read','md-split');
    document.body.classList.add('md-'+b.dataset.md); setTimeout(()=>aceMd.resize(),40);
  });
  document.body.classList.add('md-split');

  $('#exportGrid').onclick=e=>{ const c=e.target.closest('.card'); if(!c||c.disabled) return;
    st.exportFmt=c.dataset.fmt; $$('#exportGrid .card').forEach(x=>x.classList.toggle('active',x===c)); syncExportOpts(); };
  $('#expName').addEventListener('input',()=>expNameTouched=true);
  $('#expDownload').onclick=()=>exportRun(false);
  $('#expSaveAs').onclick=()=>exportRun(true);

  $$('[data-set]').forEach(el=>{
    const ev=el.type==='checkbox'||el.tagName==='SELECT'?'change':'input';
    el.addEventListener(ev,()=>{ const k=el.dataset.set;
      S[k]=el.type==='checkbox'?el.checked:(el.type==='number'||el.type==='range'?+el.value:el.value);
      if(k==='docFont') $('#expFont').value=S.docFont; apply(); });
  });
  $$('[data-seg=theme] button').forEach(b=>b.onclick=()=>{S.theme=b.dataset.v;apply();});
  $('#resetSet').onclick=()=>{ S={...DEF}; apply(); toast('Оформление сброшено'); };
  $('#clearAuto').onclick=()=>{ localStorage.removeItem('de.auto'); toast('Автосохранение удалено'); };
  $$('#sheet [data-close]').forEach(b=>b.onclick=()=>openSheet(false));
  $('#sheetOverlay').onclick=()=>openSheet(false);

  $('#dlg').hidden=true; $('#findModal').hidden=true; $('#sheet').hidden=true; $('#sheetOverlay').hidden=true;
  $$('#dlg [data-close]').forEach(b=>b.onclick=()=>closeDialog(null));
  $('#dlgOk').onclick=()=>closeDialog(collectDialog());
  $('#dlg').addEventListener('mousedown',e=>{ if(e.target===$('#dlg')) closeDialog(null); });
  $('#dlg').addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); closeDialog(collectDialog()); }});
  $$('#findModal [data-close]').forEach(b=>b.onclick=()=>$('#findModal').hidden=true);
  $('#findModal').addEventListener('mousedown',e=>{ if(e.target===$('#findModal')) $('#findModal').hidden=true; });
  $('#fNext').onclick=findNext; $('#fOne').onclick=replaceOne; $('#fAll').onclick=replaceAll;
  $('#fQuery').onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); findNext(); } };
  $('#fRepl').onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); replaceOne(); } };

  doc().addEventListener('input',touch);
  doc().addEventListener('paste',e=>{
    const dt=e.clipboardData; if(!dt) return;
    const img=[...dt.items].find(i=>i.type.startsWith('image/'));
    if(img){ e.preventDefault(); const fr=new FileReader(); fr.onload=()=>insertHTML(`<img src="${fr.result}">`); fr.readAsDataURL(img.getAsFile()); return; }
    const h=dt.getData('text/html'); e.preventDefault();
    if(h) insertHTML(sanitize(h)); else document.execCommand('insertText',false,dt.getData('text/plain'));
  });
  document.addEventListener('selectionchange',()=>{ if(st.view==='page') requestAnimationFrame(syncTools); });
  matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{ if(S.theme==='auto') apply(); });

  const dz=$('#drop');
  document.addEventListener('dragenter',e=>{ e.preventDefault(); dragDepth++; dz.classList.add('on'); });
  document.addEventListener('dragover',e=>e.preventDefault());
  document.addEventListener('dragleave',e=>{ e.preventDefault(); dragDepth=Math.max(0,dragDepth-1); if(!dragDepth) dz.classList.remove('on'); });
  document.addEventListener('drop',e=>{ e.preventDefault(); dragDepth=0; dz.classList.remove('on');
    const f=e.dataTransfer?.files?.[0]; if(f) loadFile(f); });

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      if(!$('#dlg').hidden) return closeDialog(null);
      if(!$('#findModal').hidden){ $('#findModal').hidden=true; return; }
      if(!$('#sheet').hidden){ openSheet(false); return; }
    }
    if(e.altKey && e.key.toLowerCase()==='w'){ e.preventDefault(); closeFile(); return; }
    const mod=e.ctrlKey||e.metaKey; if(!mod) return;
    const k=e.key.toLowerCase();
    if(k==='s'){e.preventDefault();save();}
    else if(k==='o'){e.preventDefault();openFile();}
    else if(k==='n'&&!e.shiftKey){e.preventDefault();newDoc();}
    else if(k==='f'&&st.view==='page'){e.preventDefault();openFind();}
    else if(k==='h'&&(st.view==='code'||st.view==='md')){e.preventDefault();codeSearch(true);}
    else if(k==='g'&&(st.view==='code'||st.view==='md')){e.preventDefault();CMD.cGoto();}
    else if(k==='e'){e.preventDefault();tab('export');}
    else if(k==='p'){e.preventDefault();printDoc();}
  });
  addEventListener('beforeunload',e=>{ if(st.dirty){ e.preventDefault(); e.returnValue=''; } });

  let prompt=null;
  addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); prompt=e; $('#btnInstall').hidden=false; });
  $('#btnInstall').onclick=async()=>{
    if(!prompt) return toast('Меню браузера → «Установить приложение» / «На экран Домой»');
    prompt.prompt(); const r=await prompt.userChoice;
    if(r.outcome==='accepted') $('#btnInstall').hidden=true; prompt=null;
  };
  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

  const q=new URLSearchParams(location.search);
  if(q.has('new')) newDoc();
  else if(!restoreAuto()){
    if(!localStorage.getItem('de.seen')){ try{localStorage.setItem('de.seen','1');}catch(e){} loadSample('word'); }
    else setView('welcome');
  }
  if(q.has('open')) openFile();
  updateRibbonLock();
});