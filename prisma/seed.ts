import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type Loc = { fr: string; en: string; de: string; pt: string };
type Seed = {
  slug: string;
  category: 'baby_shower' | 'corporate' | 'wedding' | 'baptism' | 'birthday';
  name: Loc;
  short: Loc;
  long: Loc;
  priceCents: number;
  stock: number;
  featured?: boolean;
};

const j = (l: Loc) => JSON.stringify(l);

// Helper to keep the seed compact: build a Loc with FR + EN content.
// DE / PT are filled with EN as a sensible fallback so the admin can refine later.
const L = (fr: string, en: string, de?: string, pt?: string): Loc => ({
  fr,
  en,
  de: de ?? en,
  pt: pt ?? fr,
});

const products: Seed[] = [
  // ============== BABY SHOWER (10) ==============
  {
    slug: 'caixas-baby-personalizadas',
    category: 'baby_shower',
    name: L('Boîtes Baby Personnalisées', 'Personalised Baby Boxes'),
    short: L('Boîtes cadeau imprimées avec le nom du bébé', 'Gift boxes printed with the baby\'s name'),
    long: L(
      'Boîtes cadeau élégantes avec impression UV haute qualité. Idéales pour offrir des dragées, biscuits ou petits cadeaux. Personnalisation complète avec le nom et la date de naissance.',
      'Elegant gift boxes with high-quality UV printing. Perfect for sweets, biscuits or small gifts. Full personalisation with name and birth date.',
    ),
    priceCents: 1890, stock: 50, featured: true,
  },
  {
    slug: 'garrafas-baby-personalizadas',
    category: 'baby_shower',
    name: L('Bouteilles Personnalisées', 'Personalised Bottles'),
    short: L('Bouteilles d\'eau gravées laser', 'Laser-engraved water bottles'),
    long: L(
      'Bouteilles en verre ou acier inoxydable gravées au laser avec design unique. Souvenir durable pour vos invités.',
      'Glass or stainless steel bottles laser-engraved with a unique design. Durable keepsake for your guests.',
    ),
    priceCents: 2450, stock: 80,
  },
  {
    slug: 'velas-decorativas-baby',
    category: 'baby_shower',
    name: L('Bougies Décoratives Baby', 'Decorative Baby Candles'),
    short: L('Bougies parfumées avec étiquette personnalisée', 'Scented candles with custom label'),
    long: L(
      'Bougies artisanales parfumées avec étiquette imprimée sur mesure. Cire de soja naturelle, parfums doux adaptés à un baby shower.',
      'Handcrafted scented candles with custom-printed label. Natural soy wax, gentle scents perfect for a baby shower.',
    ),
    priceCents: 1650, stock: 60,
  },
  {
    slug: 'lembrancas-acrilico-baby',
    category: 'baby_shower',
    name: L('Souvenirs en Acrylique', 'Acrylic Keepsakes'),
    short: L('Plaques acryliques découpées au laser', 'Laser-cut acrylic plaques'),
    long: L(
      'Plaques acryliques transparentes ou colorées, découpées et gravées au laser. Personnalisation avec prénom, date et motifs au choix.',
      'Clear or coloured acrylic plaques, laser-cut and engraved. Personalised with name, date and your choice of motifs.',
    ),
    priceCents: 1290, stock: 100, featured: true,
  },
  {
    slug: 'bolsinhas-baby-personalizadas',
    category: 'baby_shower',
    name: L('Pochettes Personnalisées', 'Personalised Pouches'),
    short: L('Petites pochettes en tissu pour cadeaux', 'Small fabric pouches for gifts'),
    long: L(
      'Pochettes en coton ou lin avec impression sublimation. Réutilisables, idéales pour offrir des petits cadeaux ou des dragées.',
      'Cotton or linen pouches with sublimation print. Reusable, ideal for small gifts or sweets.',
    ),
    priceCents: 990, stock: 120,
  },
  {
    slug: 'biscoitos-personalizados-baby',
    category: 'baby_shower',
    name: L('Biscuits Personnalisés', 'Personalised Cookies'),
    short: L('Biscuits décorés avec design unique', 'Decorated cookies with custom design'),
    long: L(
      'Biscuits artisanaux décorés à la main avec glaçage royal. Designs personnalisés selon le thème de votre événement.',
      'Handcrafted cookies decorated by hand with royal icing. Custom designs to match your event theme.',
    ),
    priceCents: 350, stock: 200,
  },
  {
    slug: 'marcadores-livro-baby',
    category: 'baby_shower',
    name: L('Marque-pages Souvenirs', 'Bookmark Keepsakes'),
    short: L('Marque-pages élégants pour vos invités', 'Elegant bookmarks for your guests'),
    long: L(
      'Marque-pages en métal ou acrylique avec gravure laser. Souvenir utile et raffiné, parfait à offrir.',
      'Metal or acrylic bookmarks with laser engraving. A useful and refined keepsake, perfect to give.',
    ),
    priceCents: 590, stock: 150,
  },
  {
    slug: 'bonecas-personalizadas',
    category: 'baby_shower',
    name: L('Poupées Personnalisées', 'Personalised Dolls'),
    short: L('Poupées en tissu avec prénom brodé', 'Fabric dolls with embroidered name'),
    long: L(
      'Poupées artisanales en tissu doux avec broderie du prénom. Cadeau tendre et unique pour le bébé à naître.',
      'Handcrafted soft fabric dolls with embroidered name. A tender, unique gift for the baby-to-be.',
    ),
    priceCents: 4500, stock: 25,
  },
  {
    slug: 'mobiles-decorativos',
    category: 'baby_shower',
    name: L('Mobiles Décoratifs', 'Decorative Mobiles'),
    short: L('Mobiles personnalisés pour la chambre', 'Personalised nursery mobiles'),
    long: L(
      'Mobiles fabriqués sur mesure en bois et feutrine. Designs uniques au choix : étoiles, animaux, nuages.',
      'Custom-made mobiles in wood and felt. Unique designs to choose from: stars, animals, clouds.',
    ),
    priceCents: 7800, stock: 15,
  },
  {
    slug: 'kit-presente-baby-completo',
    category: 'baby_shower',
    name: L('Kit Cadeau Baby Complet', 'Complete Baby Gift Kit'),
    short: L('Coffret tout-en-un pour baby shower', 'All-in-one baby shower set'),
    long: L(
      'Coffret cadeau prestige incluant boîte personnalisée, bougie, biscuits décorés et marque-page. Le tout sur mesure.',
      'Premium gift set including personalised box, candle, decorated cookies and bookmark. All custom-made.',
    ),
    priceCents: 8900, stock: 20, featured: true,
  },

  // ============== CORPORATE (10) ==============
  {
    slug: 'canetas-personalizadas-premium',
    category: 'corporate',
    name: L('Stylos Premium Gravés', 'Premium Engraved Pens'),
    short: L('Stylos de luxe avec gravure laser', 'Luxury pens with laser engraving'),
    long: L(
      'Stylos en métal brossé avec gravure laser de votre logo. Présentation en boîte cadeau élégante. Idéal pour cadeaux d\'affaires.',
      'Brushed metal pens with laser-engraved logo. Presented in an elegant gift box. Perfect for business gifts.',
    ),
    priceCents: 3450, stock: 100, featured: true,
  },
  {
    slug: 'pastas-corporativas-gravadas',
    category: 'corporate',
    name: L('Pochettes & Classeurs Gravés', 'Engraved Folders & Files'),
    short: L('Classeurs cuir avec logo gravé', 'Leather folders with engraved logo'),
    long: L(
      'Classeurs en cuir véritable ou simili-cuir avec gravure du logo de votre entreprise. Plusieurs formats disponibles.',
      'Genuine or faux leather folders with your company logo engraved. Multiple formats available.',
    ),
    priceCents: 6500, stock: 40,
  },
  {
    slug: 'trofeus-corporativos',
    category: 'corporate',
    name: L('Trophées Corporate', 'Corporate Trophies'),
    short: L('Trophées sur mesure en acrylique', 'Custom acrylic trophies'),
    long: L(
      'Trophées en acrylique massif découpés et gravés au laser. Idéal pour récompenses, anniversaires d\'entreprise ou événements.',
      'Solid acrylic trophies, laser-cut and engraved. Ideal for awards, company anniversaries or events.',
    ),
    priceCents: 8900, stock: 30, featured: true,
  },
  {
    slug: 'placas-homenagem',
    category: 'corporate',
    name: L('Plaques d\'Honneur', 'Award Plaques'),
    short: L('Plaques commémoratives élégantes', 'Elegant commemorative plaques'),
    long: L(
      'Plaques en bois, métal ou acrylique avec gravure personnalisée. Pour récompenser, remercier ou commémorer.',
      'Wood, metal or acrylic plaques with personalised engraving. To award, thank or commemorate.',
    ),
    priceCents: 5500, stock: 35,
  },
  {
    slug: 'pendrives-personalizados',
    category: 'corporate',
    name: L('Clés USB Personnalisées', 'Personalised USB Drives'),
    short: L('Clés USB avec logo gravé', 'USB drives with engraved logo'),
    long: L(
      'Clés USB en bois, métal ou cuir avec gravure laser de votre logo. Capacités de 16 Go à 128 Go.',
      'Wood, metal or leather USB drives with laser-engraved logo. Capacities from 16 GB to 128 GB.',
    ),
    priceCents: 2800, stock: 80,
  },
  {
    slug: 'mochilas-corporativas',
    category: 'corporate',
    name: L('Sacs à Dos Corporate', 'Corporate Backpacks'),
    short: L('Sacs à dos avec logo brodé', 'Backpacks with embroidered logo'),
    long: L(
      'Sacs à dos professionnels avec broderie ou impression du logo. Plusieurs coloris et formats disponibles.',
      'Professional backpacks with embroidered or printed logo. Multiple colours and sizes available.',
    ),
    priceCents: 7900, stock: 25,
  },
  {
    slug: 'bones-corporativos',
    category: 'corporate',
    name: L('Casquettes Personnalisées', 'Personalised Caps'),
    short: L('Casquettes avec logo brodé', 'Caps with embroidered logo'),
    long: L(
      'Casquettes de qualité avec broderie 3D du logo. Plusieurs coloris, ajustement universel.',
      'Quality caps with 3D-embroidered logo. Multiple colours, universal fit.',
    ),
    priceCents: 1990, stock: 120,
  },
  {
    slug: 'garrafas-isotermicas-corporate',
    category: 'corporate',
    name: L('Bouteilles Isothermes Corporate', 'Corporate Insulated Bottles'),
    short: L('Bouteilles thermos avec logo', 'Thermos bottles with logo'),
    long: L(
      'Bouteilles isothermes en acier inoxydable double paroi. Gravure laser du logo. Maintien chaud/froid 12h.',
      'Double-wall stainless steel insulated bottles. Laser-engraved logo. Keeps hot/cold for 12h.',
    ),
    priceCents: 3290, stock: 70,
  },
  {
    slug: 'mousepads-personalizados',
    category: 'corporate',
    name: L('Tapis de Souris Personnalisés', 'Personalised Mouse Pads'),
    short: L('Mousepads avec impression sur mesure', 'Mouse pads with custom print'),
    long: L(
      'Tapis de souris avec impression sublimation pleine couleur. Plusieurs formats : standard, XL, gaming.',
      'Mouse pads with full-colour sublimation print. Multiple sizes: standard, XL, gaming.',
    ),
    priceCents: 1490, stock: 150,
  },
  {
    slug: 'kit-executivo-completo',
    category: 'corporate',
    name: L('Kit Exécutif Complet', 'Complete Executive Kit'),
    short: L('Coffret cadeau d\'affaires premium', 'Premium business gift set'),
    long: L(
      'Coffret prestige : stylo gravé, carnet en cuir, clé USB et bouteille isotherme. Présentation luxueuse, le tout personnalisé.',
      'Prestige set: engraved pen, leather notebook, USB drive and insulated bottle. Luxurious presentation, all personalised.',
    ),
    priceCents: 14900, stock: 15, featured: true,
  },

  // ============== WEDDING (10) ==============
  {
    slug: 'caixas-casamento-personalizadas',
    category: 'wedding',
    name: L('Boîtes Mariage Personnalisées', 'Personalised Wedding Boxes'),
    short: L('Boîtes à dragées élégantes', 'Elegant favour boxes'),
    long: L(
      'Boîtes à dragées raffinées avec impression métallisée or, argent ou rose-gold. Personnalisation avec prénoms et date.',
      'Refined favour boxes with gold, silver or rose-gold metallic print. Personalised with names and date.',
    ),
    priceCents: 1750, stock: 200, featured: true,
  },
  {
    slug: 'lembrancas-acrilico-casamento',
    category: 'wedding',
    name: L('Souvenirs Acrylique Mariage', 'Wedding Acrylic Keepsakes'),
    short: L('Plaques acryliques premium gravées', 'Premium engraved acrylic plaques'),
    long: L(
      'Plaques acryliques épaisses, polies et gravées au laser. Designs floraux, géométriques ou minimalistes au choix.',
      'Thick polished acrylic plaques, laser-engraved. Choice of floral, geometric or minimalist designs.',
    ),
    priceCents: 2890, stock: 150,
  },
  {
    slug: 'garrafas-vinho-casamento',
    category: 'wedding',
    name: L('Bouteilles de Vin Personnalisées', 'Personalised Wine Bottles'),
    short: L('Étiquettes vin sur mesure', 'Custom wine labels'),
    long: L(
      'Étiquettes vin imprimées avec photo, prénoms, date et message. Disponible aussi avec gravure directe sur la bouteille.',
      'Wine labels printed with photo, names, date and message. Also available with direct bottle engraving.',
    ),
    priceCents: 2400, stock: 100,
  },
  {
    slug: 'almofadas-decorativas-casamento',
    category: 'wedding',
    name: L('Coussins Décoratifs Mariage', 'Wedding Decorative Cushions'),
    short: L('Coussins porte-alliances personnalisés', 'Personalised ring cushions'),
    long: L(
      'Coussins porte-alliances en satin ou velours avec broderie sur mesure. Dentelle et perles disponibles.',
      'Satin or velvet ring cushions with custom embroidery. Lace and pearl options available.',
    ),
    priceCents: 5900, stock: 30,
  },
  {
    slug: 'lencos-seda-personalizados',
    category: 'wedding',
    name: L('Foulards Soie Personnalisés', 'Personalised Silk Scarves'),
    short: L('Foulards en soie avec impression', 'Silk scarves with custom print'),
    long: L(
      'Foulards en soie naturelle imprimés avec design exclusif. Cadeau précieux pour témoins ou demoiselles d\'honneur.',
      'Natural silk scarves printed with an exclusive design. A precious gift for witnesses or bridesmaids.',
    ),
    priceCents: 8900, stock: 20,
  },
  {
    slug: 'velas-casamento',
    category: 'wedding',
    name: L('Bougies Mariage', 'Wedding Candles'),
    short: L('Bougies cérémonie personnalisées', 'Personalised ceremony candles'),
    long: L(
      'Bougies de cérémonie en cire végétale avec étiquettes personnalisées. Idéal pour la cérémonie ou en cadeau invité.',
      'Vegetable-wax ceremony candles with personalised labels. Ideal for the ceremony or as guest favours.',
    ),
    priceCents: 1990, stock: 100,
  },
  {
    slug: 'livro-visitas-3d',
    category: 'wedding',
    name: L('Livre d\'Or 3D', '3D Guest Book'),
    short: L('Livre d\'or imprimé 3D unique', 'Unique 3D-printed guest book'),
    long: L(
      'Livre d\'or avec couverture imprimée en 3D, prénoms en relief et finition haut de gamme. Pages crème de qualité.',
      'Guest book with 3D-printed cover, raised names and premium finish. Quality cream pages.',
    ),
    priceCents: 9500, stock: 25, featured: true,
  },
  {
    slug: 'marcadores-tematicos-casamento',
    category: 'wedding',
    name: L('Marque-places Thématiques', 'Themed Place Cards'),
    short: L('Marque-places personnalisés invités', 'Personalised guest place cards'),
    long: L(
      'Marque-places en papier de luxe ou bois découpé. Prénom de chaque invité imprimé ou gravé, design assorti à votre thème.',
      'Place cards in luxury paper or cut wood. Each guest\'s name printed or engraved, design matching your theme.',
    ),
    priceCents: 290, stock: 500,
  },
  {
    slug: 'caixas-presente-elegantes',
    category: 'wedding',
    name: L('Coffrets Cadeaux Élégants', 'Elegant Gift Boxes'),
    short: L('Coffrets pour témoins et famille', 'Boxes for witnesses and family'),
    long: L(
      'Coffrets cadeaux raffinés contenant souvenirs, dragées et message personnalisé. Présentation soignée digne d\'un cadeau précieux.',
      'Refined gift boxes with keepsakes, sweets and personalised message. Polished presentation worthy of a precious gift.',
    ),
    priceCents: 6900, stock: 35,
  },
  {
    slug: 'fotografia-impressa-casamento',
    category: 'wedding',
    name: L('Service Photo Imprimée', 'Printed Photo Service'),
    short: L('Photos imprimées sur supports variés', 'Photos printed on various media'),
    long: L(
      'Vos photos préférées imprimées sur acrylique, bois, métal ou toile. Finition mate, brillante ou texturée. Plusieurs formats.',
      'Your favourite photos printed on acrylic, wood, metal or canvas. Matte, glossy or textured finish. Multiple sizes.',
    ),
    priceCents: 4500, stock: 60,
  },

  // ============== BAPTISM (10) ==============
  {
    slug: 'caixas-batizado',
    category: 'baptism',
    name: L('Boîtes Baptême', 'Baptism Boxes'),
    short: L('Boîtes à dragées baptême', 'Baptism favour boxes'),
    long: L(
      'Boîtes à dragées élégantes avec croix, ange ou design personnalisé. Impression UV de qualité, finitions soignées.',
      'Elegant favour boxes with cross, angel or custom design. Quality UV print, polished finish.',
    ),
    priceCents: 1690, stock: 150, featured: true,
  },
  {
    slug: 'velas-batizado',
    category: 'baptism',
    name: L('Bougies Baptême', 'Baptism Candles'),
    short: L('Bougies cérémonie sur mesure', 'Custom ceremony candles'),
    long: L(
      'Bougies de baptême décorées avec prénom de l\'enfant, date et symboles religieux. Cire pure, présentation soignée.',
      'Baptism candles decorated with child\'s name, date and religious symbols. Pure wax, polished presentation.',
    ),
    priceCents: 2490, stock: 80,
  },
  {
    slug: 'bolsinhas-batizado',
    category: 'baptism',
    name: L('Pochettes Baptême', 'Baptism Pouches'),
    short: L('Petites pochettes pour invités', 'Small pouches for guests'),
    long: L(
      'Pochettes en tissu doux avec impression sublimation. Idéales pour offrir dragées ou petits souvenirs aux invités.',
      'Soft fabric pouches with sublimation print. Ideal for sweets or small keepsakes for guests.',
    ),
    priceCents: 890, stock: 200,
  },
  {
    slug: 'lembrancas-acrilico-batizado',
    category: 'baptism',
    name: L('Souvenirs Acrylique Baptême', 'Baptism Acrylic Keepsakes'),
    short: L('Plaques souvenir baptême', 'Baptism keepsake plaques'),
    long: L(
      'Plaques en acrylique avec gravure du prénom, date et symboles religieux. Souvenir durable et élégant.',
      'Acrylic plaques engraved with name, date and religious symbols. A durable, elegant keepsake.',
    ),
    priceCents: 1390, stock: 100,
  },
  {
    slug: 'lencos-batizado',
    category: 'baptism',
    name: L('Mouchoirs Personnalisés', 'Personalised Handkerchiefs'),
    short: L('Mouchoirs en lin brodés', 'Embroidered linen handkerchiefs'),
    long: L(
      'Mouchoirs en lin fin avec broderie du prénom et de la date. Cadeau traditionnel et précieux.',
      'Fine linen handkerchiefs embroidered with name and date. A traditional, precious gift.',
    ),
    priceCents: 1290, stock: 80,
  },
  {
    slug: 'biscoitos-decorados-batizado',
    category: 'baptism',
    name: L('Biscuits Décorés Baptême', 'Decorated Baptism Cookies'),
    short: L('Biscuits glaçage royal sur mesure', 'Custom royal-icing cookies'),
    long: L(
      'Biscuits artisanaux décorés à la main aux couleurs et motifs du baptême. Emballage individuel possible.',
      'Handcrafted cookies decorated by hand in baptism colours and motifs. Individual wrapping available.',
    ),
    priceCents: 320, stock: 250,
  },
  {
    slug: 'fitas-personalizadas-batizado',
    category: 'baptism',
    name: L('Rubans Personnalisés', 'Personalised Ribbons'),
    short: L('Rubans imprimés avec prénom', 'Ribbons printed with name'),
    long: L(
      'Rubans satin de qualité avec impression du prénom et date. Idéal pour décoration ou emballage cadeaux.',
      'Quality satin ribbons printed with name and date. Ideal for decoration or gift wrapping.',
    ),
    priceCents: 490, stock: 300,
  },
  {
    slug: 'anjos-decorativos',
    category: 'baptism',
    name: L('Anges Décoratifs', 'Decorative Angels'),
    short: L('Statuettes anges personnalisées', 'Personalised angel statuettes'),
    long: L(
      'Statuettes d\'anges en résine ou acrylique avec gravure personnalisée. Souvenir religieux délicat et raffiné.',
      'Resin or acrylic angel statuettes with personalised engraving. A delicate, refined religious keepsake.',
    ),
    priceCents: 2890, stock: 50,
  },
  {
    slug: 'caixas-doces-batizado',
    category: 'baptism',
    name: L('Boîtes avec Douceurs', 'Sweet Treat Boxes'),
    short: L('Coffrets garnis personnalisés', 'Personalised filled boxes'),
    long: L(
      'Coffrets personnalisés contenant dragées, biscuits décorés et petits souvenirs. Présentation soignée.',
      'Personalised boxes filled with sweets, decorated cookies and small keepsakes. Polished presentation.',
    ),
    priceCents: 3500, stock: 60,
  },
  {
    slug: 'kit-batizado-completo',
    category: 'baptism',
    name: L('Kit Baptême Complet', 'Complete Baptism Kit'),
    short: L('Coffret tout-en-un baptême', 'All-in-one baptism set'),
    long: L(
      'Coffret prestige : boîte personnalisée, bougie, mouchoir brodé, ange décoratif et biscuits. Le coffret idéal.',
      'Premium set: personalised box, candle, embroidered handkerchief, decorative angel and cookies. The ideal kit.',
    ),
    priceCents: 7900, stock: 25, featured: true,
  },

  // ============== BIRTHDAY (10) ==============
  {
    slug: 'caixas-aniversario',
    category: 'birthday',
    name: L('Boîtes Anniversaire', 'Birthday Boxes'),
    short: L('Boîtes cadeau personnalisées', 'Personalised gift boxes'),
    long: L(
      'Boîtes festives avec impression au thème souhaité (super-héros, princesses, animaux, etc.). Personnalisation prénom et âge.',
      'Festive boxes printed with chosen theme (superheroes, princesses, animals, etc.). Personalised with name and age.',
    ),
    priceCents: 1490, stock: 150, featured: true,
  },
  {
    slug: 'baloes-personalizados',
    category: 'birthday',
    name: L('Ballons Personnalisés', 'Personalised Balloons'),
    short: L('Ballons imprimés sur mesure', 'Custom-printed balloons'),
    long: L(
      'Ballons latex ou aluminium avec impression du prénom, âge ou message. Plusieurs coloris et formats.',
      'Latex or foil balloons printed with name, age or message. Multiple colours and sizes.',
    ),
    priceCents: 390, stock: 500,
  },
  {
    slug: 'garrafas-aniversario',
    category: 'birthday',
    name: L('Bouteilles Anniversaire', 'Birthday Bottles'),
    short: L('Bouteilles personnalisées festives', 'Festive personalised bottles'),
    long: L(
      'Bouteilles avec étiquettes personnalisées ou gravure laser. Boisson au choix : eau, jus, vin, champagne.',
      'Bottles with personalised labels or laser engraving. Choice of drink: water, juice, wine, champagne.',
    ),
    priceCents: 1890, stock: 100,
  },
  {
    slug: 'camisetas-personalizadas',
    category: 'birthday',
    name: L('T-shirts Personnalisés', 'Personalised T-shirts'),
    short: L('T-shirts imprimés sur mesure', 'Custom-printed t-shirts'),
    long: L(
      'T-shirts coton avec impression sublimation ou flex. Designs personnalisés pour anniversaires, EVJF, EVG, etc.',
      'Cotton t-shirts with sublimation or flex print. Custom designs for birthdays, hen/stag parties, etc.',
    ),
    priceCents: 2490, stock: 100,
  },
  {
    slug: 'bones-aniversario',
    category: 'birthday',
    name: L('Casquettes Anniversaire', 'Birthday Caps'),
    short: L('Casquettes festives personnalisées', 'Personalised festive caps'),
    long: L(
      'Casquettes brodées ou imprimées avec message ou design unique. Plusieurs coloris au choix.',
      'Embroidered or printed caps with unique message or design. Multiple colours.',
    ),
    priceCents: 1990, stock: 80,
  },
  {
    slug: 'mochilas-aniversario',
    category: 'birthday',
    name: L('Sacs à Dos Personnalisés', 'Personalised Backpacks'),
    short: L('Sacs à dos avec prénom', 'Backpacks with name'),
    long: L(
      'Sacs à dos pour enfants ou adultes avec broderie ou impression du prénom. Plusieurs tailles et coloris.',
      'Backpacks for kids or adults with embroidered or printed name. Multiple sizes and colours.',
    ),
    priceCents: 3890, stock: 50,
  },
  {
    slug: 'garrafas-isotermicas-aniversario',
    category: 'birthday',
    name: L('Bouteilles Isothermes Anniversaire', 'Birthday Insulated Bottles'),
    short: L('Bouteilles thermos festives', 'Festive thermos bottles'),
    long: L(
      'Bouteilles isothermes avec gravure du prénom, âge ou message. Cadeau pratique et durable.',
      'Insulated bottles engraved with name, age or message. A practical, durable gift.',
    ),
    priceCents: 2890, stock: 70,
  },
  {
    slug: 'placas-decorativas-aniversario',
    category: 'birthday',
    name: L('Plaques Décoratives', 'Decorative Plaques'),
    short: L('Plaques personnalisées de décoration', 'Personalised decorative plaques'),
    long: L(
      'Plaques en bois, acrylique ou métal pour décorer la fête. Impression UV ou gravure laser au choix.',
      'Wood, acrylic or metal plaques to decorate the party. UV print or laser engraving available.',
    ),
    priceCents: 1990, stock: 80,
  },
  {
    slug: 'kit-surpresa-personalizado',
    category: 'birthday',
    name: L('Kit Surprise Personnalisé', 'Personalised Surprise Kit'),
    short: L('Coffret surprise sur mesure', 'Bespoke surprise box'),
    long: L(
      'Coffret surprise contenant ballons, bouteille personnalisée, t-shirt et plaque décorative. Le tout sur mesure.',
      'Surprise box with balloons, personalised bottle, t-shirt and decorative plaque. All custom-made.',
    ),
    priceCents: 8900, stock: 25, featured: true,
  },
  {
    slug: 'lembrancas-3d-aniversario',
    category: 'birthday',
    name: L('Souvenirs 3D Personnalisés', '3D Personalised Keepsakes'),
    short: L('Figurines 3D imprimées sur mesure', 'Custom 3D-printed figurines'),
    long: L(
      'Figurines imprimées en 3D au design unique : prénom en lettres, personnages, objets thématiques. Plusieurs coloris.',
      'Custom 3D-printed figurines: name letters, characters, themed objects. Multiple colours.',
    ),
    priceCents: 2490, stock: 60,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Wipe existing products to make seed idempotent.
  await prisma.product.deleteMany();

  for (const p of products) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        category: p.category,
        name: j(p.name),
        shortDescription: j(p.short),
        longDescription: j(p.long),
        priceCents: p.priceCents,
        stock: p.stock,
        featured: p.featured ?? false,
        active: true,
        leadTime: '5-7 jours ouvrables',
        customizable: true,
      },
    });
  }
  console.log(`✅ Inserted ${products.length} products.`);

  // Seed admin user (stored in Setting table because we use NextAuth Credentials)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kadoa.ch';
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-strong-password';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.setting.upsert({
    where: { key: 'admin_email' },
    create: { key: 'admin_email', value: adminEmail },
    update: { value: adminEmail },
  });
  await prisma.setting.upsert({
    where: { key: 'admin_password_hash' },
    create: { key: 'admin_password_hash', value: passwordHash },
    update: { value: passwordHash },
  });
  console.log(`✅ Admin user seeded (${adminEmail}).`);

  // Default settings
  const defaults: Array<[string, string]> = [
    ['shipping_flat_cents', '900'],         // 9.00 CHF flat shipping
    ['free_shipping_threshold_cents', '15000'], // free shipping over 150 CHF
    ['payment_stripe_enabled', 'true'],
    ['payment_twint_enabled', 'true'],
    ['payment_paypal_enabled', 'false'],
    ['payment_bank_transfer_enabled', 'true'],
    ['business_hours', 'Lun-Ven 9h-18h, Sam 10h-15h'],
  ];
  for (const [k, v] of defaults) {
    await prisma.setting.upsert({
      where: { key: k },
      create: { key: k, value: v },
      update: {},
    });
  }
  console.log('✅ Default settings seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
