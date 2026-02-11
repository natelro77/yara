// This is the core logic that makes butterflies move and respond to clicks
export default function Home() {
  const { data: compliments } = useCompliments();
  const [selected, setSelected] = useState(null);

  return (
    <div className="garden-container">
      <h1>For my queen Yara ❤️</h1>
      {compliments.map((c) => (
        <Butterfly 
          key={c.id} 
          text={c.text} 
          onClick={() => setSelected(c)} 
        />
      ))}
      {selected && <Modal text={selected.text} onClose={() => setSelected(null)} />}
    </div>
  );
}
