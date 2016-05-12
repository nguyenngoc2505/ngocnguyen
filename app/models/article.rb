class Article < ActiveRecord::Base
  extend FriendlyId
  friendly_id :beautiful_title, use: [:slugged, :finders]

  scope :by_newest, ->{order(id: :desc).first 5}

  private
  def beautiful_title
    title.to_slug.normalize(transliterations: :vietnamese).to_s
  end
end
