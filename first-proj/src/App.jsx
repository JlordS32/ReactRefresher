const Card = ({ title }) => {
   const [hasLiked, setHasLiked] = useState(false);
   
   return (
      <div className="card">
         <h1>{title}</h1>
         <button onClick={() => setHasLiked(true)}>Like</button>
      </div>
   );
};

// Function to generate the cards
const generateCards = (count) => {
   const cards = [];
   for (let i = 0; i < count; i++) {
      cards.push(<Card key={i} title={`Card ${i + 1}`} />);
   }
   return cards;
};

const App = () => {
   

   return <div className="card-container">
      <Card title="Iron Man" />
      <Card title="Penguin Shits" />
      <Card title="Moana" />
   </div>;
};

export default App;
