function LeftSidebar({ sections }) {
  return (
    <aside className="sidebar left-sidebar">
      <ul>
        {sections.map((sec) => (
          <li 
            key={sec.index} 
            style={{ marginLeft: `${(sec.toclevel - 1) * 1}rem` }}
          >
            <a href={`#${sec.anchor}`}>{sec.line}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default LeftSidebar;