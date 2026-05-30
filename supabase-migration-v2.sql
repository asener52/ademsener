-- Yeni içerik tiplerini ekle (posts tablosundaki check constraint'i güncelle)
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_type_check;
ALTER TABLE posts ADD CONSTRAINT posts_type_check
  CHECK (type IN ('article', 'news', 'announcement', 'training', 'project', 'publication'));
