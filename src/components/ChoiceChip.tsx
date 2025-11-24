type Props = {
  label: string
  selected?: boolean
  onSelect?: () => void
}

export const ChoiceChip = ({ label, selected, onSelect }: Props) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-full px-4 py-2 text-sm transition-all duration-150 ease-out min-h-[44px] ${
        selected
          ? 'border border-transparent bg-[#e3f1f2] text-[#0f172a] shadow-sm'
          : 'border border-dashed border-gray-300 bg-white text-gray-700 hover:border-gray-400'
      }`}
    >
      {label}
    </button>
  )
}
