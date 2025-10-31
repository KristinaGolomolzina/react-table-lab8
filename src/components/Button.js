 import './Button.css';

function Button({ children, onClick, variant="first"}) {
  return (
    <button className={variant}onClick={onClick}>
      {children}
    </button>
  );
}

// позволяет использовать этот компонент в других файлах
export default Button; 