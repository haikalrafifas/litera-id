'use client';

export default function Button({
  href = '',
  text = '',
  background = 'white',
  textColor = 'green',
  onClick = () => {},
  disabled = false,
}) {
  const style = {
    backgroundColor: background,
    color: textColor,
  };

  const NavButton = () => {
    return (
      <a
      href={href}
      style={style}
      // className={`block text-center py-2 px-4 rounded hover:bg-gray-100 transition duration-300`}>
      className={`text-center py-2 px-4 rounded hover:bg-gray-100 transition duration-300`}>
        {text}
    </a>
    );
  };

  const RegularButton = () => {
    return (
      <button
        onClick={onClick}
        style={style}
        // className={`block text-center py-2 px-4 rounded hover:bg-gray-100 transition duration-300`}>
        className={`text-center py-2 px-4 rounded hover:bg-gray-100 transition duration-300`}
        disabled={disabled}
      >
          {text}
      </button>
    );
  };

  return href ? NavButton() : RegularButton();
}
