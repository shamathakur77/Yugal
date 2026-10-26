# Guest Book setup (one time, 2 minutes)

guestbook.html writes to a `guests` table through three database functions.
Nothing can read the table directly with the public key: inserts and the
family-only list both go through functions, and the list needs the family code.

1. Open Supabase → project mrbzglbnjwoyxtsmmsud → SQL Editor → New query.
2. Change `CHANGE-ME` below to a family code (letters/numbers, no spaces). Share it only with Roma, Mom and yourself.
3. Paste and Run.

```sql
create table if not exists guests (
  id bigserial primary key,
  code text not null,
  name text not null,
  pax int not null default 1,
  side text, events text, city text,
  room boolean default false, nights int default 0,
  food text, phone text, lang text,
  created_at timestamptz default now()
);
alter table guests enable row level security;   -- no policies: anon cannot touch it directly

create table if not exists guestbook_admin (code text primary key, admin_code text not null);
insert into guestbook_admin (code, admin_code) values ('roma-prashant-nov', 'CHANGE-ME')
  on conflict (code) do update set admin_code = excluded.admin_code;
alter table guestbook_admin enable row level security;

create or replace function add_guest(p_code text, p_name text, p_pax int, p_side text, p_events text, p_city text, p_room boolean, p_nights int, p_food text, p_phone text, p_lang text)
returns int language plpgsql security definer as $$
declare n int;
begin
  if p_code <> 'roma-prashant-nov' or length(p_name) < 2 or p_pax < 1 or p_pax > 20 then raise exception 'invalid'; end if;
  insert into guests (code,name,pax,side,events,city,room,nights,food,phone,lang)
  values (p_code,left(p_name,80),p_pax,left(p_side,20),left(p_events,40),left(p_city,60),p_room,least(p_nights,7),left(p_food,10),left(p_phone,30),left(p_lang,2));
  select count(*) into n from guests where code = p_code;
  return n;
end $$;

create or replace function guest_count(p_code text) returns int language sql security definer as $$
  select coalesce(sum(pax),0)::int from guests where code = p_code;
$$;

create or replace function list_guests(p_code text, p_admin text)
returns setof guests language plpgsql security definer as $$
begin
  if not exists (select 1 from guestbook_admin where code = p_code and admin_code = p_admin) then raise exception 'denied'; end if;
  return query select * from guests where code = p_code order by created_at desc;
end $$;

grant execute on function add_guest(text,text,int,text,text,text,boolean,int,text,text,text) to anon;
grant execute on function guest_count(text) to anon;
grant execute on function list_guests(text,text) to anon;
```

4. Test: open https://yugal-beryl.vercel.app/guestbook.html, add yourself.
5. Family view: https://yugal-beryl.vercel.app/guestbook.html?admin and enter the code. CSV download is there.
