import { useState, useEffect } from "react";
import SalasContext from "./SalasContext";
import Tabela from "./Tabela";
import Form from "./Form";

function Salas() {

    const [alerta, setAlerta] = useState({ "status": "", "message": "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({
        codigo: "", numero: "", descricao: "",
        capacidade: "", predio : ""
    });
    const [listaPredios, setListaPredios] = useState([]);

    const recuperar = async codigo => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/salas/${codigo}`)
            .then(response => response.json())
            .then(data => setObjeto(data))
            .catch(err => setAlerta({ "status": "error", "message": err }))
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/salas`,
                {
                    method: metodo,
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(objeto)
                }).then(response => response.json())
                .then(json => {
                    setAlerta({ status: json.status, message: json.message });
                    setObjeto(json.objeto);
                    if (!editar) {
                        setEditar(true);
                    }
                })
        } catch (err) {
            setAlerta({ "status": "error", "message": err })
        }
        recuperaSalas();
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    const recuperaPredios = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predios`)
            .then(response => response.json())
            .then(data => setListaPredios(data))
            .catch(err => setAlerta({ "status": "error", "message": err }))
    }

    const recuperaSalas = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/salas`)
            .then(response => response.json())
            .then(data => setListaObjetos(data))
            .catch(err => setAlerta({ "status": "error", "message": err }))
    }    

    const remover = async objeto => {
        if (window.confirm('Deseja remover este objeto?')) {
            try {
                await
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/salas/${objeto.codigo}`,
                        { method: "DELETE" })
                        .then(response => response.json())
                        .then(json => setAlerta({
                            "status": json.status,
                            "message": json.message
                        }))
                recuperaSalas();
            } catch (err) {
                setAlerta({ "status": "error", "message": err })
            }
        }
    }

    useEffect(() => {
        recuperaPredios();
        recuperaSalas();
    }, []);

    return (
        <SalasContext.Provider value={
            {
                alerta, setAlerta,
                listaObjetos, setListaObjetos,
                recuperaPredios, remover,
                objeto, setObjeto,
                editar, setEditar,
                recuperar,
                acaoCadastrar, handleChange, listaPredios
            }
        }>
            <Tabela />
            <Form />

        </SalasContext.Provider>
    )

}

export default Salas;