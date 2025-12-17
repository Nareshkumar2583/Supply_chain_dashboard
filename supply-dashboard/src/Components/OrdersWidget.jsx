import Card from "./ui/Cards"

export default function OrdersWidget() {
  return (
    <Card title="Orders Status" icon="📦">
      <ul className="space-y-2 text-gray-700">
        <li>Processing: <b>15</b></li>
        <li>Shipped: <b>8</b></li>
        <li>Delivered: <b>20</b></li>
      </ul>
    </Card>
  )
}
