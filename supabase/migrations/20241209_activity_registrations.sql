-- Create activity_registrations table
create table if not exists activity_registrations (
  id uuid default gen_random_uuid() primary key,
  activity_id int not null,
  user_id uuid,
  first_name varchar(255) not null,
  last_name varchar(255) not null,
  email varchar(255) not null,
  phone varchar(20),
  registered_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  foreign key (user_id) references auth.users(id) on delete set null
);

-- Create index on activity_id and user_id for faster queries
create index activity_registrations_activity_id_idx on activity_registrations(activity_id);
create index activity_registrations_user_id_idx on activity_registrations(user_id);
create index activity_registrations_email_idx on activity_registrations(email);

-- Enable RLS
alter table activity_registrations enable row level security;

-- Create RLS policy for public insert (anyone can register)
create policy "Allow public to register for activities" on activity_registrations
  for insert with check (true);

-- Create RLS policy for users to view their own registrations
create policy "Users can view their own registrations" on activity_registrations
  for select using (auth.uid() = user_id or user_id is null);
