function Chips({ items, kind, emptyText }) {
  if (!items.length) {
    return (
      <ul className="chips">
        <li className="empty">{emptyText}</li>
      </ul>
    );
  }
  return (
    <ul className="chips">
      {items.map((skill) => (
        <li key={skill.name} className={kind}>
          {skill.name}
          {skill.weight === 3 ? " · core" : ""}
        </li>
      ))}
    </ul>
  );
}

export default function SkillLists({ present, missing }) {
  return (
    <div className="grid-2">
      <article className="card card-ok">
        <h3>
          <span className="pill pill-ok">Present</span> Skills a recruiter will see
        </h3>
        <Chips items={present} kind="found" emptyText="No matching skills found." />
      </article>
      <article className="card card-miss">
        <h3>
          <span className="pill pill-miss">Missing</span> Skills the role expects
        </h3>
        <Chips items={missing} kind="gap" emptyText="Nothing missing — nice." />
      </article>
    </div>
  );
}
