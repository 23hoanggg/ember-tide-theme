-- inventory.lua: simple item inventory with metatables.
--- @class Inventory
--- @field items table<string, integer>
--- @param capacity integer maximum slots
local json = require("dkjson")

local MAX_SLOTS <const> = 0x20
local Inventory = {}
Inventory.__index = Inventory

---Creates a new inventory.
---@param capacity? integer
---@return Inventory
function Inventory.new(capacity)
  local self = setmetatable({}, Inventory)
  self.capacity = capacity or MAX_SLOTS
  self.items = {}
  self.count = 0
  return self
end

function Inventory:add(name, qty)
  qty = qty or 1
  if self.count >= self.capacity and not self.items[name] then
    error(string.format("inventory full (%d/%d)\n", self.count, self.capacity))
  end
  self.items[name] = (self.items[name] or 0) + qty
  self.count = self.count + 1
  return self.items[name]
end

function Inventory:each()
  local keys = {}
  for k in pairs(self.items) do keys[#keys + 1] = k end
  table.sort(keys)
  local i = 0
  return function()
    i = i + 1
    local key = keys[i]
    if key ~= nil then return key, self.items[key] end
  end
end

local inv = Inventory.new(8)
inv:add("sword")
inv:add("potion", 3)

for name, qty in inv:each() do
  print(("%-10s x%d"):format(name, qty))
end

local note = [[
  multi-line "raw" string
]]
local ok, err = pcall(function() return inv:add(nil) end)
print(ok == false, err, #note, 1e3 // 7, 2 ^ 10, true, nil, json.encode(inv.items))
goto continue
::continue::
