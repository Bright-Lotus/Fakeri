import './App.css';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Button, Container } from 'react-bootstrap';

function CategoriesGrid() {
	const navigate = useNavigate();

	const handleClick = (event, category) => {
			navigate(`/${category.toLowerCase()}`);
	}

	return (
		<Container>
			<Card>
				<Card.Header><p style={{ color: 'black', marginBottom: '0px !important', justifyContent: 'center' }}>Fakeri</p></Card.Header>
				<Card.Body>
					<Row xs={1} md={2} className="g-4" style={{ overflowY: 'scroll', height: '550px' }}>
						{['Keywords', 'Swords', 'Wands', 'Ability Orbs', 'Armor Plates', 'Monsters', 'Event Info']
						.map((category, idx) => (
							<Col>
								<Card>
									<Card.Body>
										<Card.Title><p style={{ color: 'black' }}>{category}</p></Card.Title>
										<Card.Text>
											<p style={{ color: 'black' }}>See descriptions and other things for {category}</p>
										</Card.Text>
									</Card.Body>
									<Card.Footer><Button onClick={event => { handleClick(event, category) }}>Go!</Button></Card.Footer>
								</Card>
							</Col>
						))}
					</Row>
				</Card.Body>
			</Card>
		</Container>
	)
}


function App() {
	return (
		<div className="App">
			<header className="App-header">
				<CategoriesGrid />
			</header>
		</div>
	);
}

export default App;
