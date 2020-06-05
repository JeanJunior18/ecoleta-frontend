import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';



import './styles.css';
import logo from '../../assets/logo.svg';

const Home: React.FC = () => {

	interface Item {
		id: number;
		title: string;
		image_url: string;
	}

	interface UFResponse {
		sigla: string;
	}

	interface CityResponse {
		nome: string;
	}

	const [items, setItems] = useState<Item[]>([]);
	const [ufs, setUfs]= useState<string[]>([]);
	const [cities, setCities]= useState<string[]>([]);
	const [selectedUf, setSelectedUf] = useState('0');

	useEffect(()=>{
		api.get('items').then(response => setItems(response.data))
	},[]);

	useEffect(()=>{
		api.get<UFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
		.then(response => {
			const ufInitials = response.data.map(uf => uf.sigla)
			setUfs(ufInitials)
		})
	},[]);

	useEffect(()=>{
		api.get<CityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
		.then(response => {
			const cities = response.data.map(city => city.nome)
			setCities(cities)
		})
		
	},[selectedUf])

	return(
		<div id="page-create-point">
			<header>
				<img src={logo} alt="ecoleta"/>
				<Link to='/'>
					<FiArrowLeft/>
					Voltar para a home
				</Link>
			</header>

			<form action="">
				<h1>Cadastro do <br/> ponto de coleta</h1>

				<fieldset>
					<legend><h2>Dados</h2></legend>

					<div className="field">
						<label htmlFor="name">Nome da entidade</label>
						<input
						type="text"
						name="name" 
						id="name"
						/>
					</div>

					<div className="field-group">
						<div className="field">
							<label htmlFor="email">E-mail</label>
							<input
							type="text"
							name="email" 
							id="email"
							/>
						</div>
						<div className="field">
							<label htmlFor="whatsapp">Whatsapp</label>
							<input
							type="text"
							name="whatsapp" 
							id="whatsapp"
							/>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Endereço</h2>
						<span>Selecione um endereço no mapa</span>
					</legend>

					<Map center={[-4.466322,-43.8768724]} zoom={15}>
						<TileLayer 
							attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>

						<Marker position={[-4.466322,-43.8768724]} />
					</Map>

					<div className="field-group">

							<div className="field">
								<label htmlFor="uf">Estado (UF)</label>
								<select name="uf" id="uf" onChange={e => setSelectedUf(e.target.value)}>
									<option value="0">Selecione uma UF</option>
									{ufs.map(uf => <option value={uf} key={uf} >{uf}</option>)}
								</select>
							</div>

							<div className="field">
								<label htmlFor="city">Cidade</label>
								<select name="city" id="city">
									<option value="0">Selecione uma Cidade</option>
									{cities.map(city => <option value={city} key={city}>{city}</option> )}
								</select>
							</div>
						</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Ítens de coleta</h2>
						<span>Selecione um ou mais ítens abaixo</span>
					</legend>

					<ul className="items-grid">
					{items.map(item => (
							<li key={item.id} className='selected'>
								<img src={item.image_url} alt="Teste"/>
								<span>{item.title}</span>
						</li>
						))}
				
					</ul>

				</fieldset>

				<button type="submit">
					Cadastrar ponto de coleta
				</button>
			</form>
		</div>
	)
}

export default Home;