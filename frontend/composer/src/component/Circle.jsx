function Circle({color, size = 15, text}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        overflow: 'hidden',
      }}
    >
      {text}
    </div>)
}

export default Circle;