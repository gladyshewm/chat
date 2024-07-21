--DROP function public.change_user_credentials;

create or replace function public.change_user_credentials(
  p_user_uuid uuid,
  p_name text default null,
  p_email text default null,
  p_password text default null
)
returns jsonb
language plpgsql
SECURITY DEFINER
as $$
declare
  v_user_id uuid;
  v_result jsonb;
begin
  begin
    select
      id
    into
      v_user_id
    from
      auth.users
    where
      id = p_user_uuid;

    if v_user_id is null then
      raise exception 'User not found';
    end if;

    if p_name is not null then
      update
        auth.users
      set
        raw_user_meta_data = raw_user_meta_data || jsonb_build_object('name', p_name)
      where
        id = v_user_id;

      update
        public.profiles
      set
        name = p_name
      where
        uuid = v_user_id;
      end if;

      if p_email is not null then
        update
          auth.users
        set
          email = p_email,
          raw_user_meta_data = raw_user_meta_data || jsonb_build_object('email', p_email)
        where
          id = v_user_id;
      end if;

      if p_password is not null then
        update
          auth.users
        set
          encrypted_password = crypt(p_password, gen_salt('bf'))
        where
          id = v_user_id;
      end if;

      select jsonb_build_object(
        'uuid', id,
        'name', raw_user_meta_data->>'name',
        'email', email
      ) 
      into 
        v_result
      from
        auth.users
      where
        id = v_user_id;

      return v_result;

  exception
    when others then
      raise;
  end;
end;
$$;