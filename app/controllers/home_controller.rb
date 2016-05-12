class HomeController < ApplicationController
  layout "home"
  def index
    @articles = Article.by_newest
  end
end
