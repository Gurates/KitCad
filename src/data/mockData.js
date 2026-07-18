export const mockModels = [
  {
    id: 'm1784381361238',
    name: 'Bumper Wood Corner Bracket',
    teamNumber: '9021',
    teamName: 'Team 9021',
    downloads: 0,
    uploadDate: '2026-07-18',
    thumbnail: '/models/m1784381361238_thumb.jpg',
    categories: ["MEKANİK","Şase","Bumper Brackets"],
    features: [],
    rawUrl: '/models/m1784381361238_raw.STEP',
    glbUrl: '/models/m1784381361238_web.glb'
  },
  {
    id: 'm1784223077283',
    name: 'Deneme',
    teamNumber: '9021',
    teamName: 'Team 9021',
    downloads: 0,
    uploadDate: '2026-07-16',
    thumbnail: '/models/m1784223077283_thumb.webp',
    categories: ['MEKANİK'],
    features: ["APÜSODJAŞİSMİAŞMS"],
    rawUrl: '/models/m1784223077283_raw.STEP',
    glbUrl: '/models/m1784223077283_web.glb'
  },];

// Helper: count models in a category (including subcategories)
const countModels = (catName) => mockModels.filter(m => {
  const cats = m.categories || (m.category ? [m.category] : []);
  return cats.includes(catName);
}).length;

// Helper: recursively count models including children
const countWithChildren = (node) => {
  let total = countModels(node.name);
  if (node.children) {
    node.children.forEach(child => { total += countWithChildren(child); });
  }
  return total;
};

// Hierarchical category tree
export const categoryTree = [
  {
    name: 'MEKANİK',
    children: [
      {
        name: 'Bağlantı Elemanları',
        children: [
          { name: 'Insert' },
          { name: 'Nuts' },
        ]
      },
      {
        name: 'Güç Aktarma',
        children: [
          { name: 'Adapters' },
          { name: 'Collar Clamp' },
          { name: 'GEARBOXES' },
          { name: 'Kasnaklar' },
        ]
      },
      { name: 'Pnömatik' },
      { name: 'Rulmanlar' },
      {
        name: 'ŞASE',
        children: [
          { name: 'Bumper Brackets' },
          {
            name: 'Swerve Modules',
            children: [
              { name: 'MK4 Family' },
              { name: 'MK5 Family' },
            ]
          },
        ]
      },
      { name: 'Wheels' },
    ]
  },
  { name: 'HAZIR MEKANİZMALAR' },
  {
    name: 'ELEKTRONİK',
    children: [
      {
        name: 'Güç Sistemleri',
        children: [
          { name: 'Limelight Series' },
        ]
      },
      { name: 'Motor Controller' },
      { name: 'Motorlar' },
      { name: 'Sensörler' },
    ]
  },
];

// Flatten tree to get all category names (for Admin panel checkboxes)
const flattenTree = (nodes) => {
  let result = [];
  nodes.forEach(node => {
    result.push(node.name);
    if (node.children) result = result.concat(flattenTree(node.children));
  });
  return result;
};

export const allCategoryNames = flattenTree(categoryTree);

// Legacy flat list (kept for backward compat)
export const mockCategories = allCategoryNames.map((name, idx) => ({
  id: `c${idx + 1}`,
  name,
  count: countModels(name)
}));

export const mockTeam = {
  id: 't1',
  number: '254',
  name: 'The Cheesy Poofs',
  location: 'San Jose, California, USA',
  logo: 'https://ui-avatars.com/api/?name=254&background=2563eb&color=fff&size=200',
  banner: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1600&q=80',
  stats: {
    models: 24,
    downloads: 45000,
    likes: 8500
  }
};

export const mockUser = {
  id: 'u1',
  username: 'frc_designer_99',
  avatar: 'https://ui-avatars.com/api/?name=FRC+Designer&background=0f172a&color=fff',
  stats: {
    saved: 45,
    liked: 128,
    uploaded: 3
  }
};
