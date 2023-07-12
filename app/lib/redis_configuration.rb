# frozen_string_literal: true

class RedisConfiguration
  class << self
    def establish_pool(new_pool_size)
      @pool&.shutdown(&:close)
      @pool = ConnectionPool.new(size: new_pool_size) { new.connection }
    end

    delegate :with, to: :pool

    def pool
      @pool ||= establish_pool(pool_size)
    end

    def pool_size
      if Sidekiq.server?
        Sidekiq[:concurrency]
      else
        ENV['MAX_THREADS'] || 5
      end
    end
  end

  def connection
    if namespace?
      Redis::Namespace.new(namespace, redis: raw_connection)
    else
      raw_connection
    end
  end

  def namespace?
    namespace.present?
  end

  def namespace
    ENV.fetch('REDIS_NAMESPACE', nil)
  end

  def url
    ENV['REDIS_URL']
  end

  private

  def raw_connection
    if ENV['REDIS_SENTINELS'].nil? || ENV['REDIS_NAME'].nil?
      Redis.new(url: url, driver: :hiredis)
    else
      sentinels = parse_sentinels(ENV['REDIS_SENTINELS'], ENV['REDIS_PORT'], ENV['REDIS_PASSWORD'])
      Redis.new(name: ENV['REDIS_NAME'], sentinels: sentinels, role: :master)
    end
  end

  def parse_sentinels(sentinels, port, password)
    sentinels.split(',').map do |address|
      sentinel = { host: address, port: port || 6379 }
      sentinel[:password] = password unless password.nil?
      sentinel
    end
  end
end
