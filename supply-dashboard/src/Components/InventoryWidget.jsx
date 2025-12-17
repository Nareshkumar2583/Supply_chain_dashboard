import Card from "./ui/Cards"

export default function InventoryWidget() {
  return (
    <Card title="Inventory Overview" icon="📊">
      <p className="text-gray-700"><span className="font-medium">SKU:</span> sku123</p>
      <p className="text-gray-700"><span className="font-medium">Current Stock:</span> 120</p>
      <p className="text-gray-700"><span className="font-medium">Orders Pending:</span> 25</p>
    </Card>
  )
}
