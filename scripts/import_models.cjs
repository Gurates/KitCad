const fs = require('fs');
const path = require('path');

const KITCAD_ROOT = path.join(__dirname, '..', 'KITCAD (2)', 'KITCAD', 'KITCAD');
const KITCAD_GLB = path.join(__dirname, '..', 'KITCAD (2)', 'KITCAD', 'KITCAD GLB');
const KITCAD_SS = path.join(__dirname, '..', 'KITCAD (2)', 'KITCAD', 'KITCAD SS');
const PUBLIC_MODELS = path.join(__dirname, '..', 'public', 'models');
const MOCK_DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'mockData.js');

// Utility to recursively find files
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

function getTokens(name) {
  return path.basename(name, path.extname(name))
    .toLowerCase()
    .replace(/-/g, '') // remove hyphens so am-2647 becomes am2647
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

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

function matchFile(sourceName, targetFiles) {
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

    if (sourceFirstToken === targetTokens[0]) {
      score += 50;
    }

    const cleanTarget = targetTokens.join('');

    if (cleanSource.includes(cleanTarget)) {
      score += (cleanTarget.length / cleanSource.length) * 30;
    } else if (cleanTarget.includes(cleanSource)) {
      score += (cleanSource.length / cleanTarget.length) * 30;
    }

    const lcsLen = lcs(cleanSource, cleanTarget);
    score += (lcsLen / Math.max(cleanSource.length, cleanTarget.length)) * 20;

    let commonTokens = 0;
    for (const token of sourceTokens) {
      if (targetTokens.includes(token)) commonTokens++;
      // Partial token match (e.g. mecanumleft vs mecanum)
      else if (targetTokens.some(t => t.includes(token) || token.includes(t))) {
        commonTokens += 0.5;
      }
    }
    score += commonTokens * 5;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = target;
    }
  }

  if (maxScore > 10) {
    return bestMatch;
  }
  return null;
}

// Clear public/models folder
if (fs.existsSync(PUBLIC_MODELS)) {
  fs.rmSync(PUBLIC_MODELS, { recursive: true, force: true });
}
fs.mkdirSync(PUBLIC_MODELS, { recursive: true });

// Collect all files
const stepFiles = findFiles(KITCAD_ROOT, ['.stp', '.step']);
const glbFiles = findFiles(KITCAD_GLB, ['.glb']);
const imageFiles = findFiles(KITCAD_SS, ['.png', '.jpg', '.jpeg', '.webp', '.avif']);

const mockModels = [];

console.log(`Found ${stepFiles.length} STEP files, ${glbFiles.length} GLB files, ${imageFiles.length} Images.`);

let modelCounter = 1;

for (const stepPath of stepFiles) {
  const originalName = path.basename(stepPath);
  // Get categories from the directory structure relative to KITCAD_ROOT
  const relativeDir = path.dirname(path.relative(KITCAD_ROOT, stepPath));
  let categories = relativeDir.split(path.sep).filter(Boolean);

  // Clean up categories (uppercase first level typically)
  if (categories.length > 0) {
    categories[0] = categories[0].toUpperCase();
  } else {
    categories = ['Uncategorized'];
  }

  const overrides = {
    "LIMELIGHT3ACAD_STEP.stp": { img: "limelight3A2-640x640.jpg", glb: "LIMELIGHT3ACAD_STEP.glb" },
    "LIMELIGHT3CAD_STEP.stp": { img: "limeligth3.jpg", glb: "LIMELIGHT3CAD_STEP.glb" },
    "LIMELIGHT3GCAD_STEP.stp": { img: "limelight3G.png", glb: "LIMELIGHT3CAD_STEP.glb" },
    "LIMELIGHT4CAD_STEP.stp": { img: "limelight4.jpg", glb: "LIMELIGHT4CAD_STEP.glb" },
    "LimelightCAD1STEP.stp": { img: "limelight1.png", glb: "LimelightCAD1STEP.glb" },
    "LimelightCAD2STEPSimp.stp": { img: "limelight2.jpg", glb: "LimelightCAD2STEPSimp.glb" },
    "mecanumleft.STEP": { img: "75mm_Mecanum_Wheel_Set_Main_Solo__97065.webp", glb: "mecanumleft.glb" },
    "mecanumright.STEP": { img: "75mm_Mecanum_Wheel_Set_Main_Solo__97065.webp", glb: "mecanumright.glb" },
    "am-3563 4IN Stealth Wheel 8mm Nub Bore.STEP": { img: "am-stealthwheel_1_dc9c722d-ce0d-42b3-9022-24a5b9752162_large.webp", glb: "am-3563 4IN Stealth Wheel 8mm Nub Bore.glb" },
    "am-3563 4IN Compliant Wheel 8mm Nub Bore.STEP": { img: "am-compliantwheels_1_0ce428d5-dd39-403c-852a-d7830047ff90_700x700.webp", glb: "am-3563 4IN Compliant Wheel 8mm Nub Bore.glb" },
    "Neo5501.STEP": { img: "REV-21-1651-NEO550-iso-noflag-FINAL__53096.png", glb: "Neo5501.glb" },
    "NEO-Vortex-Moter-and-SPARK-Flex-Motor-Controller-with-8mm-Shaft.STEP": { img: "REV-11-1652-NEOVortexBrushlessMotor-Hero-FINAL__08884.png", glb: "NEO-Vortex-Moter-and-SPARK-Flex-Motor-Controller-with-8mm-Shaft.glb" },
    "CİM(Pinion).STEP": { img: "am-0255_700x700.webp", glb: "CİM(Pinion).glb" },
    "CİM(Yalın).STEP": { img: "am-0255_700x700.webp", glb: "CİM(Yalın).glb" },
    "Minion.STEP": { img: "CTR-Electronics-Minion-Brushless-Standalone-Motor.webp", glb: "Minion.glb" },
    "PDH_Breaker_Extractor.STEP": { img: "PDH_Breaker_Extractor.jpeg", glb: "PDH_Breaker_Extractor.glb" },
  };

  let matchedGlb = null;
  let matchedImage = null;

  if (overrides[originalName]) {
    const override = overrides[originalName];
    if (override.glb) {
      matchedGlb = glbFiles.find(f => path.basename(f) === override.glb);
    }
    if (override.img) {
      matchedImage = imageFiles.find(f => path.basename(f) === override.img);
    }
  } else {
    matchedGlb = matchFile(originalName, glbFiles);
    matchedImage = matchFile(originalName, imageFiles);
  }

  const modelId = `m${Date.now()}${modelCounter++}`;
  const modelDir = path.join(PUBLIC_MODELS, modelId);
  fs.mkdirSync(modelDir, { recursive: true });

  // Destination paths
  const destStep = path.join(modelDir, `model_raw${path.extname(stepPath)}`);
  fs.copyFileSync(stepPath, destStep);

  let glbUrl = null;
  if (matchedGlb) {
    const destGlb = path.join(modelDir, `model_web.glb`);
    fs.copyFileSync(matchedGlb, destGlb);
    glbUrl = `/models/${modelId}/model_web.glb`;
  }

  let thumbUrl = null;
  if (matchedImage) {
    const destImage = path.join(modelDir, `model_thumb${path.extname(matchedImage)}`);
    fs.copyFileSync(matchedImage, destImage);
    thumbUrl = `/models/${modelId}/model_thumb${path.extname(matchedImage)}`;
  }

  console.log(`\nImporting: ${originalName}`);
  console.log(`  -> GLB: ${matchedGlb ? path.basename(matchedGlb) : 'NOT FOUND'}`);
  console.log(`  -> IMG: ${matchedImage ? path.basename(matchedImage) : 'NOT FOUND'}`);

  mockModels.push({
    id: modelId,
    name: path.basename(originalName, path.extname(originalName)),
    teamNumber: '9021', // Defaulting to the team number seen in mockData
    teamName: 'Team 9021',
    downloads: 0,
    uploadDate: new Date().toISOString().split('T')[0],
    thumbnail: thumbUrl || 'https://via.placeholder.com/400x300?text=No+Preview',
    categories: categories,
    features: [],
    rawUrl: `/models/${modelId}/model_raw${path.extname(stepPath)}`,
    glbUrl: glbUrl || ''
  });
}

// Update mockData.js
let mockDataContent = fs.readFileSync(MOCK_DATA_PATH, 'utf-8');

// We need to replace the entire export const mockModels = [...] array.
// A regex might be tricky if it's large, but we can do it since we know the structure.
// Using regex to replace the array definition:
const regex = /export const mockModels = \[[\s\S]*?\];/;
const replacement = `export const mockModels = ${JSON.stringify(mockModels, null, 2)};`;

if (regex.test(mockDataContent)) {
  mockDataContent = mockDataContent.replace(regex, replacement);
  fs.writeFileSync(MOCK_DATA_PATH, mockDataContent);
  console.log(`\nSuccessfully updated src/data/mockData.js with ${mockModels.length} models.`);
} else {
  console.error('\nCould not find mockModels array to replace in mockData.js!');
}
