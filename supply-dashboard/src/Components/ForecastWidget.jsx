import Card from "./ui/Cards"

export default function ForecastWidget() {
  return (
    <Card title="Stockout Prediction" icon="🔮">
      <p className="text-gray-600 mb-3">
        Inventory forecast suggests you’ll run out in:
      </p>
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white 
                      rounded-xl px-4 py-3 text-center text-lg font-bold shadow">
        12 days
      </div>
    </Card>
  )
}

