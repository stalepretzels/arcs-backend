defmodule ArcsWeb.Router do
  import Phoenix.LiveDashboard.Router
  use ArcsWeb, :router
  
  plug :match
  plug :dispatch

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {ArcsWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  # pipeline :api do
  #   plug :accepts, ["json"]
  # end

  # define the new pipeline using auth_plug
  pipeline :authOptional, do: plug(AuthPlugOptional)

  scope "/", ArcsWeb do
    pipe_through [:browser, :authOptional]

    get "/", PageController, :home
    get "/login", AuthController, :login
    get "/logout", AuthController, :logout
  end

  scope "/api", Arcs do
    pipe_through :api

  #  post "/auth/signup", AuthController, :authenticate
  
    get "/version" do
      send_resp(conn, 200, File.read!("version.txt"))
    end
  
  end
  
  pipeline :admins_only do
  plug :admin_basic_auth
end

scope "/" do
  pipe_through [:browser, :admins_only]
  live_dashboard "/dashboard", metrics: ArcsWeb.Telemetry
end

defp admin_basic_auth(conn, _opts) do
  username = "cadmins"
  password = File.read!("auth.txt")
  Plug.BasicAuth.basic_auth(conn, username: username, password: password)
end
end
