import Card from "./ui/Cards"


export default function SuppliersWidget() {
  return (
    <Card title="Suppliers Performance" icon="🚚">
      <ul className="space-y-2 text-gray-700">
        <li>Supplier A: On-time 92%</li>
        <li>Supplier B: On-time 85%</li>
        <li>Supplier C: On-time 78%</li>
      </ul>
    </Card>
  )
}
