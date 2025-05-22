export default function DeleteConfirmation({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="text-center">
      <p className="text-[#00032e] mb-4">Are you sure you want to delete this property?</p>
      <div className="flex justify-end gap-4">
        <button onClick={onCancel} className="bg-gray-300 py-2 px-4 rounded">Cancel</button>
        <button onClick={onConfirm} className="bg-red-500 text-white py-2 px-4 rounded">Delete</button>
      </div>
    </div>
  );
}