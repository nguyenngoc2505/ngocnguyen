Rails.application.routes.draw do
  devise_for :users
  root to: "home#index"
  get "profile", to: "profile#index"
  resources :articles, path: "blogs" do
    post :upload, on: :member
  end
  get "/:id", to: "articles#show"
end
