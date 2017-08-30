###
# Page options, layouts, aliases and proxies
###
require 'json'

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false
page '/paste.html', layout: false


# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

# General configuration

activate :directory_indexes

activate :asset_hash
activate :relative_assets
set :relative_links, true

activate :external_pipeline,
  name: :webpack,
  command: build? ? 'npm run-script build' : 'npm run-script dev',
  source: ".tmp/dist",
  latency: 1

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

###
# Helpers
###

# Methods defined in the helpers block are available in templates
helpers do
  def nav_link_to(body, url, options = {})
    options[:class] = 'nav-link'
    options[:onclick] = "ga('send', 'event', 'navigation_topic_link', 'click', '#{url}')"
    link_to(body, url, options)
  end

  def _common_prepending_spaces_count(input)
    non_empty_lines = input.lines.reject { |line| line.strip == '' }
    prepending_spaces = non_empty_lines.map { |line| line.match(/^ +/).to_s.length }
    prepending_spaces.min
  end

  def fix_pre(input)
    pre_count = _common_prepending_spaces_count(input)
    fixed = input.lines.map do |line|
      line.strip == '' ? '' : line[(0 + pre_count)..-1]
    end
    fixed[0] = nil if fixed[0] == ''
    fixed[-1] = nil if fixed[-1] == ''
    fixed.join('')
  end
end

# Build-specific configuration
configure :build do
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
  ready do
    sitemap.resources.select { |resource| resource.data.title && resource.data.published == false }.each do |resource|
      ignore resource.path
    end
  end
end
