defmodule Arcs.Repo do
  use Ecto.Repo,
    otp_app: :arcs,
    adapter: Ecto.Adapters.Postgres
end
