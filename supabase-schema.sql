-- Posts tablosu (makaleler, haberler, duyurular, eğitimler)
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  type text not null check (type in ('article', 'news', 'announcement', 'training')),
  tags text[] default '{}',
  published boolean default false,
  featured boolean default false,
  view_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mesajlar tablosu
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Newsletter aboneleri
create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamptz default now()
);

-- Hakkımda bilgileri
create table if not exists about_info (
  id uuid default gen_random_uuid() primary key,
  full_name text default 'Adem ŞENER',
  title text default 'CBS Uzmanı & Yazılım Geliştirici',
  organization text default 'Ünye Belediyesi Bilgi İşlem Müdürlüğü',
  bio text default '',
  skills text[] default '{}',
  social_links jsonb default '{}',
  profile_image text,
  updated_at timestamptz default now()
);

-- Başlangıç verisi
insert into about_info (full_name, title, organization, bio, skills, social_links)
values (
  'Adem ŞENER',
  'CBS Uzmanı & Yazılım Geliştirici',
  'Ünye Belediyesi Bilgi İşlem Müdürlüğü',
  'Coğrafi Bilgi Sistemleri ve yazılım geliştirme alanlarında uzmanlaşmış bir profesyonel olarak, mekansal veri analizinden web uygulamalarına kadar geniş bir yelpazede çalışmalar yürütmekteyim.',
  ARRAY['CBS / GIS', 'QGIS', 'ArcGIS', 'PostGIS', 'Node.js', 'React', 'Python', 'PostgreSQL', 'WebGIS', 'REST API'],
  '{"email": "adem.sener@example.com"}'
)
on conflict do nothing;

-- RLS (Row Level Security) politikaları
alter table posts enable row level security;
alter table messages enable row level security;
alter table newsletter_subscribers enable row level security;
alter table about_info enable row level security;

-- Public okuma erişimi (yayınlanmış içerikler)
create policy "Public can read published posts" on posts
  for select using (published = true);

-- Authenticated kullanıcı tam erişim
create policy "Authenticated full access to posts" on posts
  for all using (auth.role() = 'authenticated');

create policy "Public can insert messages" on messages
  for insert with check (true);

create policy "Authenticated can read messages" on messages
  for select using (auth.role() = 'authenticated');

create policy "Authenticated can update messages" on messages
  for update using (auth.role() = 'authenticated');

create policy "Public can subscribe newsletter" on newsletter_subscribers
  for insert with check (true);

create policy "Authenticated can read subscribers" on newsletter_subscribers
  for select using (auth.role() = 'authenticated');

create policy "Public can read about" on about_info
  for select using (true);

create policy "Authenticated can update about" on about_info
  for all using (auth.role() = 'authenticated');

-- Updated_at otomatik güncelleme
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at before update on posts
  for each row execute function update_updated_at();

create trigger about_updated_at before update on about_info
  for each row execute function update_updated_at();

-- View count artırma fonksiyonu
create or replace function increment_view_count(post_id uuid)
returns void as $$
begin
  update posts set view_count = view_count + 1 where id = post_id;
end;
$$ language plpgsql security definer;
