function App({ predios }) {
  return (
      <div>
          <h1>Prédios do Instituto</h1>
          <div className="container">
          <div className="row">
          {predios.map(objeto => (
              <div key={objeto.codigo} className="card col-3" >
                  <div className="card-body">
                      <h5 className="card-title">{objeto.nome} - {objeto.sigla}</h5>
                      <p className="card-text">{objeto.descricao}</p>
                  </div>
              </div>
          ))}
          </div>
          </div>
      </div>
  )
};

export default App;


export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predios`);
  const predios = await res.json();
  return {
      props: {
          predios
      }
  }
}