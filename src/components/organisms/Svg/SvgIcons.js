const StatusIcon = (w, h, fillColor) => {
  const width = w ? w : '16';
  const height = h ? h : '16';
  const color = fillColor ? fillColor : '#ffffff';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={color}
      className="bi bi-exclamation-circle-fill"
      viewBox={`0 0 16 16`}
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
    </svg>
  );
};

module.exports = {
  StatusIcon
};
