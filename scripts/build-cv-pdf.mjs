import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = process.cwd();
const buildDir = path.join(root, 'build', 'cv-pdf');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-cv-'));
fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(buildDir, { recursive: true });

for (const name of ['profile', 'cv']) {
  const source = fs.readFileSync(path.join(root, 'src', 'data', `${name}.ts`), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  fs.writeFileSync(path.join(tempDir, `${name}.mjs`), output);
}

const { profile } = await import(pathToFileURL(path.join(tempDir, 'profile.mjs')).href);
const { cv } = await import(pathToFileURL(path.join(tempDir, 'cv.mjs')).href);

const headings = {
  en: {
    interests: 'Research interests',
    education: 'Education',
    experience: 'Selected projects',
    awards: 'Awards',
    skills: 'Skills'
  },
  zh: {
    interests: '研究兴趣',
    education: '教育背景',
    experience: '项目经历',
    awards: '获奖经历',
    skills: '专业技能'
  }
};

const escapeLatex = (value) => String(value).replace(/[\\&%$#_{}~^·–—’‘“”…]/g, character => ({
  '\\': '\\textbackslash{}',
  '&': '\\&',
  '%': '\\%',
  '$': '\\$',
  '#': '\\#',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
  '·': '\\textperiodcentered{}',
  '–': '\\textendash{}',
  '—': '\\textemdash{}',
  '’': '\\textquoteright{}',
  '‘': '\\textquoteleft{}',
  '“': '\\textquotedblleft{}',
  '”': '\\textquotedblright{}',
  '…': '\\ldots{}'
}[character]));

const renderEntry = (entry) => [
  `\\entry{${escapeLatex(entry.title)}}{${escapeLatex(entry.period)}}{${escapeLatex(entry.description)}}`
].join('\n');

const renderSkill = (skill) => [
  `\\skill{${escapeLatex(skill.title)}}{${escapeLatex(skill.description)}}`
].join('\n');

const renderCv = (lang) => {
  const data = cv[lang];
  const t = headings[lang];
  const name = escapeLatex(profile.name[lang]);
  const role = escapeLatex(profile.role[lang]);
  const introduction = escapeLatex(data.introduction);
  const contacts = [];
  if (profile.email) contacts.push(`\\href{mailto:${profile.email}}{${escapeLatex(profile.email)}}`);
  if (profile.github) contacts.push(`\\href{${profile.github}}{${escapeLatex(profile.github.replace(/^https?:\/\//, ''))}}`);
  const contactLine = contacts.join(' \\quad ');
  const interests = data.interests.map(escapeLatex).join(' \\sep ');

  return `\\documentclass[10pt,a4paper]{article}
\\usepackage[margin=16mm,top=14mm,bottom=14mm]{geometry}
\\usepackage{fontspec}
\\usepackage{xeCJK}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage[hidelinks]{hyperref}
\\setmainfont{TeX Gyre Heros}
\\setsansfont{TeX Gyre Heros}
\\setCJKmainfont{Droid Sans Fallback}[AutoFakeBold=2.5]
\\setCJKsansfont{Droid Sans Fallback}[AutoFakeBold=2.5]
\\definecolor{accent}{HTML}{3730A3}
\\definecolor{muted}{HTML}{52627B}
\\definecolor{line}{HTML}{DCE2ED}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{2.5pt}
\\setlength{\\emergencystretch}{2em}
\\raggedright
\\pagestyle{empty}
\\titleformat{\\section}{\\color{accent}\\large\\bfseries}{}{0pt}{}[\\vspace{-5pt}{\\color{line}\\rule{\\linewidth}{0.5pt}}]
\\titlespacing*{\\section}{0pt}{9pt}{5pt}
\\newcommand{\\sep}{\\hspace{0.65em}{\\color{line}\\textbullet}\\hspace{0.65em}}
\\newcommand{\\entry}[3]{%
  \\noindent\\textbf{#1}\\hfill{\\small\\color{muted}#2}\\par
  \\vspace{1pt}{\\small #3}\\par\\vspace{4pt}}
\\newcommand{\\skill}[2]{\\noindent\\textbf{#1}\\quad #2\\par\\vspace{2pt}}
\\begin{document}
\\begin{minipage}[t]{0.68\\textwidth}
{\\fontsize{24}{28}\\selectfont\\bfseries ${name}}\\par
\\vspace{3pt}
{\\color{accent}\\fontsize{10.5}{13.5}\\selectfont ${role}}\\par
\\end{minipage}%
\\hfill
\\begin{minipage}[t]{0.30\\textwidth}\\raggedleft\\small
${contactLine}
\\end{minipage}
\\par\\vspace{7pt}
{\\color{line}\\rule{\\linewidth}{0.8pt}}
\\vspace{6pt}
${introduction}\\par

\\section*{${t.interests}}
\\noindent ${interests}\\par

\\section*{${t.education}}
${data.education.map(renderEntry).join('\n')}

\\section*{${t.experience}}
${data.experience.map(renderEntry).join('\n')}

\\section*{${t.awards}}
${data.awards.map(renderEntry).join('\n')}

\\section*{${t.skills}}
${data.skills.map(renderSkill).join('\n')}
\\end{document}
`;
};

for (const lang of ['en', 'zh']) {
  const texPath = path.join(buildDir, `cv-${lang}.tex`);
  fs.writeFileSync(texPath, renderCv(lang), 'utf8');
  for (let pass = 0; pass < 2; pass += 1) {
    const result = spawnSync('xelatex', [
      '-interaction=nonstopmode',
      '-halt-on-error',
      `-output-directory=${buildDir}`,
      texPath
    ], { encoding: 'utf8' });
    if (result.error || result.status !== 0) {
      console.error(result.stdout || '');
      console.error(result.stderr || '');
      process.exit(result.status ?? 1);
    }
  }
  const pdf = path.join(buildDir, `cv-${lang}.pdf`);
  if (!fs.existsSync(pdf)) {
    console.error(`Missing generated PDF: ${pdf}`);
    process.exit(1);
  }
  fs.copyFileSync(pdf, path.join(root, 'public', `cv-${lang}.pdf`));
  console.log(`Generated public/cv-${lang}.pdf (${fs.statSync(pdf).size} bytes)`);
}
