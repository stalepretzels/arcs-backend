defmodule ArcsWeb.Presence do
  use Phoenix.Presence,
    otp_app: :arcs,
    pubsub_server: Arcs.PubSub
end
