function Button({ children, handleFilter, filter, active }) {
  return (
    <button
      className={`${filter === active ? 'bg-primary-700 text-primary-50' : ''} px-5 py-2 hover:bg-primary-700`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}

export default Button;
