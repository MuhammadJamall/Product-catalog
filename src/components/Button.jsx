export default function Button({
  label,
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
  type = "button"
}) {
  const variantClass = `btn-${variant}`;
  const disabledClass = disabled ? "btn-disabled" : "";

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${disabledClass} ${className}`.trim()}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children || label}
    </button>
  );
}


