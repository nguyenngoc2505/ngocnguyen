class PagePresenter

  def initialize page
    @page = page
  end

  delegate :id, :slug, to: :page

  def title
    page.title.present? ? page.title : "No Title"
  end

  def content
    markdown.render page_content
  end

  def published_at
    page.created_at.strftime("%m/%d/%Y")
  end

  private
  attr_reader :page

  def page_content
    @page_content ||= page.content || ""
  end

  def markdown
    renderer = Redcarpet::Render::HTML.new hard_wrap: true, with_toc_data: true
    markdown = Redcarpet::Markdown.new renderer, autolink: true, tables: true,
      lax_spacing: true, fenced_code_blocks: true, no_intra_emphasis: true
  end
end
