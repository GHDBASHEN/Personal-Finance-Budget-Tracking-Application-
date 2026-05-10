const fs = require('fs');
const path = require('path');

const srcDirs = [
  path.join(__dirname, '../frontend/src/pages'),
  path.join(__dirname, '../frontend/src/components'),
  path.join(__dirname, '../frontend/src')
];

const replacements = {
  'text-white': 'text-slate-900',
  'text-slate-200': 'text-slate-800',
  'text-slate-300': 'text-slate-700',
  'text-slate-400': 'text-slate-500',
  'border-slate-700/50': 'border-slate-200',
  'border-slate-700': 'border-slate-200',
  'border-slate-600': 'border-slate-300',
  'bg-slate-800/50': 'bg-white',
  'bg-slate-800/30': 'bg-slate-50',
  'bg-slate-800': 'bg-slate-50',
  'bg-slate-900/60': 'bg-slate-900/20',
  'hover:bg-slate-800': 'hover:bg-slate-100',
  'hover:bg-slate-700': 'hover:bg-slate-100',
  'hover:text-white': 'hover:text-slate-900',
  'bg-slate-700': 'bg-slate-200',
  'stroke="#334155"': 'stroke="#e2e8f0"',
  'stroke="#94a3b8"': 'stroke="#64748b"',
  "backgroundColor: '#1e293b'": "backgroundColor: '#ffffff'",
  "border: '1px solid #334155'": "border: '1px solid #e2e8f0'",
  "itemStyle={{ color: '#f8fafc' }}": "itemStyle={{ color: '#0f172a' }}",
  'text-slate-500': 'text-slate-500', // Just for doc
  'hover:border-slate-500': 'hover:border-slate-400',
};

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // do nothing
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Need to be careful with text-white replacement to not replace parts of other strings, but in tailwind it's separated by spaces
      Object.keys(replacements).forEach(key => {
        // use basic string replacement, repeat to catch all
        let newContent = content.split(key).join(replacements[key]);
        content = newContent;
      });
      
      fs.writeFileSync(fullPath, content);
      console.log('Updated ' + file);
    }
  }
}

srcDirs.forEach(processDir);
