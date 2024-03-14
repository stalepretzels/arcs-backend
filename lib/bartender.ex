defmodule Bartender do
  use Rustler, otp_app: :arcs, crate: "bartender"

  # When your NIF is loaded, it will override this function.
  def filter_profanity(_input), do: :erlang.nif_error(:nif_not_loaded)
end