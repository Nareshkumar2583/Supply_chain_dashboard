// components/ui/Card.jsx
export default function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
        <span className="mr-2">{icon}</span> {title}
      </h2>
      {children}
    </div>
  )
}
