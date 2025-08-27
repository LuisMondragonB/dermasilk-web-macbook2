/*
  RPC: increment_points
  - Actualiza puntos de un cliente de forma atómica
  - Registra la transacción en rewards_transactions
  - Devuelve el total de puntos resultante
*/

create or replace function public.increment_points(
  p_client_id uuid,
  p_points integer,
  p_type text,
  p_reason text,
  p_description text default null
)
returns integer
language plpgsql
as $$
declare
  v_current integer;
  v_delta integer;
  v_new integer;
begin
  if p_points is null or p_points <= 0 then
    raise exception 'points must be > 0';
  end if;

  if p_type not in ('earned', 'redeemed') then
    raise exception 'invalid transaction_type';
  end if;

  select points into v_current from clients where id = p_client_id for update;
  if not found then
    raise exception 'client not found';
  end if;

  v_delta := case when p_type = 'earned' then p_points else -p_points end;
  v_new := coalesce(v_current, 0) + v_delta;
  if v_new < 0 then
    raise exception 'insufficient points';
  end if;

  update clients set points = v_new where id = p_client_id;

  insert into rewards_transactions (client_id, points, transaction_type, reason, description)
  values (p_client_id, p_points, p_type, p_reason, p_description);

  return v_new;
end;
$$;


