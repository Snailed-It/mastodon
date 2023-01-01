# frozen_string_literal: true

class LinkCrawlWorker
  include Sidekiq::Worker

  MAX_DELAY = ENV.fetch('MAX_LINK_CRAWL_DELAY_SECONDS', 59).to_i

  sidekiq_options queue: 'pull', retry: 0

  def perform(status_id)
    FetchLinkCardService.new.call(Status.find(status_id))
  rescue ActiveRecord::RecordNotFound
    true
  end
end
