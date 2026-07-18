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

export const mockCategories = [
  { id: 'c1', name: 'MEKANİK' },
  { id: 'c2', name: 'HAZIR MEKANİZMALAR' },
  { id: 'c3', name: 'ELEKTRONİK' },
  { id: 'c4', name: 'Güç Sistemleri' },
  { id: 'c5', name: 'Motor Controller' },
  { id: 'c6', name: 'Motorlar' },
  { id: 'c7', name: 'Sensörler' },
  { id: 'c8', name: 'Limelight Series' },
  { id: 'c9', name: 'Insert' },
  { id: 'c10', name: 'Nuts' },
  { id: 'c11', name: 'Adapters' },
  { id: 'c12', name: 'Collar clamp' },
  { id: 'c13', name: 'GEARBOXES' },
  { id: 'c14', name: 'Kasnaklar' },
  { id: 'c15', name: 'Bumper Brackets' },
  { id: 'c16', name: 'Swerve Modules' },
  { id: 'c17', name: 'MK4 Family' },
  { id: 'c18', name: 'MK5 Family' },
  { id: 'c19', name: 'Şase' },
].map(cat => ({
  ...cat,
  count: mockModels.filter(m => {
    const cats = m.categories || (m.category ? [m.category] : []);
    return cats.includes(cat.name);
  }).length
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
