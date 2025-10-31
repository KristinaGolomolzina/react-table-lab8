

//Children в React — это способ передачи дочерних элементов
// от родительского компонента к дочернему.
function Container(p) {
  const children = p.children; 
  return <div className="container">{children}</div>;
}

export default Container;