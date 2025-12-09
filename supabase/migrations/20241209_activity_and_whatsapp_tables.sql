-- Create activity_registrations table
create table if not exists activity_registrations (
  id uuid default gen_random_uuid() primary key,
  activity_id int not null,
  activity_title varchar(255),
  first_name varchar(255) not null,
  last_name varchar(255) not null,
  email varchar(255) not null,
  phone varchar(20),
  registered_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create index on email and activity_id for faster queries
create index if not exists activity_registrations_email_idx on activity_registrations(email);
create index if not exists activity_registrations_activity_id_idx on activity_registrations(activity_id);

-- Enable RLS
alter table activity_registrations enable row level security;

-- Create RLS policy for public insert (anyone can register)
create policy "Allow public to register for activities" on activity_registrations
  for insert with check (true);

-- Create RLS policy for viewing
create policy "Allow anyone to view registrations" on activity_registrations
  for select using (true);

-- Create whatsapp_invitations table
create table if not exists whatsapp_invitations (
  id uuid default gen_random_uuid() primary key,
  email varchar(255) not null,
  name varchar(255),
  invited_at timestamp with time zone default now(),
  status varchar(50) default 'pending',
  created_at timestamp with time zone default now()
);

-- Create index on email
create index if not exists whatsapp_invitations_email_idx on whatsapp_invitations(email);

-- Enable RLS
alter table whatsapp_invitations enable row level security;

-- Create RLS policy for public insert
create policy "Allow public to log WhatsApp invitations" on whatsapp_invitations
  for insert with check (true);

-- Create RLS policy for viewing
create policy "Allow anyone to view WhatsApp invitations" on whatsapp_invitations
  for select using (true);
