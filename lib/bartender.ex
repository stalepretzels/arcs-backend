defmodule Bartender do
  use Rustler, otp_app: :arcs, crate: "bartender"

  # When your NIF is loaded, it will override this function.
  def censor(_input), do: :erlang.nif_error(:nif_not_loaded)
  def is_inappropriate(_input), do: :erlang.nif_error(:nif_not_loaded)
  def is(_input, _filter_input), do: :erlang.nif_error(:nif_not_loaded)
  def isnt(_input, _filter_input), do: :erlang.nif_error(:nif_not_loaded)
end
