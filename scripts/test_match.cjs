const fs = require('fs');
const path = require('path');

const KITCAD_ROOT = path.join(__dirname, '..', 'KITCAD (2)', 'KITCAD', 'KITCAD');
const KITCAD_GLB = path.join(__dirname, '..', 'KITCAD (2)', 'KITCAD', 'KITCAD GLB');
const KITCAD_SS = path.join(__dirname, '..', 'KITCAD (2)', 'KITCAD', 'KITCAD SS');

function findFiles(dir, extArray = [], files = []) {
  if (!fs.existsSync(dir)) return files;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findFiles(fullPath, extArray, files);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (extArray.length === 0 || extArray.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

const stepFiles = findFiles(KITCAD_ROOT, ['.stp', '.step']);
const glbFiles = findFiles(KITCAD_GLB, ['.glb']);
const imageFiles = findFiles(KITCAD_SS, ['.png', '.jpg', '.jpeg', '.webp', '.avif']);

function getTokens(name) {
  return path.basename(name, path.extname(name))
    .toLowerCase()
    .replace(/-/g, '') // remove hyphens so am-2647 becomes am2647
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

// Compute the longest common substring length
function lcs(s1, s2) {
  let maxLen = 0;
  for (let i = 0; i < s1.length; i++) {
    for (let j = i + 1; j <= s1.length; j++) {
      let sub = s1.substring(i, j);
      if (s2.includes(sub) && sub.length > maxLen) {
        maxLen = sub.length;
      }
    }
  }
  return maxLen;
}

function matchFileImproved(sourceName, targetFiles) {
  const sourceTokens = getTokens(sourceName);
  if (sourceTokens.length === 0) return null;
  const cleanSource = sourceTokens.join('');
  const sourceFirstToken = sourceTokens[0];
  
  let bestMatch = null;
  let maxScore = -1;

  for (const target of targetFiles) {
    const targetTokens = getTokens(target);
    if (targetTokens.length === 0) continue;
    
    let score = 0;
    
    // Exact first token match (e.g. am2647)
    if (sourceFirstToken === targetTokens[0]) {
      score += 50;
    }
    
    const cleanTarget = targetTokens.join('');
    
    // Substring match
    if (cleanSource.includes(cleanTarget)) {
      score += (cleanTarget.length / cleanSource.length) * 30; 
    } else if (cleanTarget.includes(cleanSource)) {
      score += (cleanSource.length / cleanTarget.length) * 30;
    }
    
    // Longest common substring 
    const lcsLen = lcs(cleanSource, cleanTarget);
    score += (lcsLen / Math.max(cleanSource.length, cleanTarget.length)) * 20;

    // Token intersection
    let commonTokens = 0;
    for (const token of sourceTokens) {
      if (targetTokens.includes(token)) commonTokens++;
    }
    score += commonTokens * 5;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = target;
    }
  }
  
  // We need a decent score to consider it a match
  if (maxScore > 10) {
    return { file: bestMatch, score: maxScore };
  }
  return { file: null, score: maxScore };
}

let glbFoundCount = 0;
let imgFoundCount = 0;

for (const stepPath of stepFiles) {
  const originalName = path.basename(stepPath);
  
  const glbMatch = matchFileImproved(originalName, glbFiles);
  const imgMatch = matchFileImproved(originalName, imageFiles);

  if (glbMatch.file) glbFoundCount++;
  if (imgMatch.file) imgFoundCount++;

  if (!glbMatch.file || !imgMatch.file) {
    console.log(`\nOriginal: ${originalName}`);
    console.log(`GLB (${Math.round(glbMatch.score)}): ${glbMatch.file ? path.basename(glbMatch.file) : 'NOT FOUND'}`);
    console.log(`IMG (${Math.round(imgMatch.score)}): ${imgMatch.file ? path.basename(imgMatch.file) : 'NOT FOUND'}`);
  }
}

console.log(`\nTotal STEPs: ${stepFiles.length}`);
console.log(`GLB found: ${glbFoundCount}`);
console.log(`IMG found: ${imgFoundCount}`);
