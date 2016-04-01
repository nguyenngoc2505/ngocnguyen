Rails.application.routes.draw do
  root to: "home#index"
  get "profile", to: "profile#index"
end
