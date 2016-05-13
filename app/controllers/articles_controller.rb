class ArticlesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  layout false
  layout "home", except: :new

  def index
    articles = Article.all
    @articles = articles.map{|ar| PagePresenter.new ar}
  end

  def show
    article = Article.find params[:id]
    @article = PagePresenter.new article
  end

  def new
    @article = Article.new
  end

  def create
    @article = Article.new article_params
    if @article.save
      redirect_to article_path @article
    else
      render :new
    end
  end

  private
  def article_params
    params.require(:article).permit(:title, :content)
  end
end
