# frozen_string_literal: true

require "json"
require_relative "money"

# Billing helpers.
#
# @author Hoang
# @param amount [Integer] cents
module Billing
  TAX_RATE = 0.2
  HEX_FLAG = 0xFF
  CURRENCIES = %w[USD EUR VND].freeze

  class InsufficientFunds < StandardError; end

  # An invoice with line items.
  class Invoice
    include Comparable
    attr_reader :number, :lines
    attr_accessor :paid

    @@count = 0

    def initialize(number, lines = [], currency: "USD", **opts)
      @number = number
      @lines = lines
      @currency = currency
      @paid = false
      @@count += 1
      yield self if block_given?
    end

    def total(with_tax: true)
      subtotal = @lines.sum { |line| line[:qty] * line[:price] }
      with_tax ? (subtotal * (1 + TAX_RATE)).round(2) : subtotal
    end

    def <=>(other) = number <=> other.number

    def to_s
      "Invoice ##{number} (#{@currency}): #{format('%.2f', total)}\n"
    end

    def self.parse(json)
      data = JSON.parse(json, symbolize_names: true)
      new(data[:number], data.fetch(:lines, []))
    rescue JSON::ParserError => e
      warn "bad invoice: #{e.message}"
      nil
    end

    private

    def charge!(card)
      raise InsufficientFunds, "declined" unless card&.valid?
      self.paid = true
    end
  end
end

invoice = Billing::Invoice.new(1_001, [{ qty: 2, price: 9.99 }]) { |inv| inv.paid = nil }
puts invoice, invoice.total(with_tax: false), :done, 'single\n'
puts "matched" if invoice.to_s =~ /Invoice #\d+/
CURRENCIES = nil unless defined?(Billing)
