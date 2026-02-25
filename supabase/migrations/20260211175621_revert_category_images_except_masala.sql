-- Revert Category Images except Masala
UPDATE categories SET image_url = 'https://ghorerbazar.com/cdn/shop/files/Crystal_honey_webslider_1.png?v=1767270852&width=360' WHERE slug = 'honey';
UPDATE categories SET image_url = 'https://ghorerbazar.com/cdn/shop/files/Shosti-Ghee-1kg.jpg?v=1762321237&width=533' WHERE slug = 'ghee';
UPDATE categories SET image_url = 'https://ghorerbazar.com/cdn/shop/files/Shsoti-Mastraid-oil5lt.jpg?v=1767012506&width=533' WHERE slug = 'oil';
UPDATE categories SET image_url = 'https://ghorerbazar.com/cdn/shop/files/Sukkari-Dates_1kg_V1_1.jpg?v=1767444935&width=533' WHERE slug = 'dates';
UPDATE categories SET image_url = 'https://ghorerbazar.com/cdn/shop/files/Honey_nuts_800g.jpg?v=1754736848&width=533' WHERE slug = 'nuts-dry-fruits';
-- Masala remains the high quality spice image from previous migration
