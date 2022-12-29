# frozen_string_literal: true

ActiveSupport::Notifications.subscribe(/rack_attack/) do |_name, _start, _finish, _request_id, payload|
  req = payload[:request]

  next unless [:throttle, :blacklist].include? req.env['rack.attack.match_type']

  throttle_name = req.env['rack.attack.matched']
  discriminator = req.env['rack.attack.match_discriminator']
  Rails.logger.info("Rate limit hit (#{req.env['rack.attack.match_type']}:#{throttle_name}): #{discriminator} #{req.remote_ip} #{req.request_method} #{req.fullpath}")
end
