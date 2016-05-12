class ArticlesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  layout "home"

  def index
    @articles = Article.all
  end

  def show
    @article = Article.find params[:id]
  end
end
